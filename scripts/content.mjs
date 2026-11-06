import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, basename, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

export const locales = { en: 'BLOG_LIST_BR_EN', 'pt-BR': 'BLOG_LIST_BR_PT-BR' };
const origin = 'https://www.keeta-global.com';
const required = ['headline', 'description', 'articleBody', 'articleSection'];
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const httpsURL = value => {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; }
  catch { return false; }
};
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

export function validateArticle(article, locale, filename) {
  const prefix = `${locale}/${filename ?? article?.id}`;
  assert(Object.hasOwn(locales, locale), `${prefix}: unsupported locale`);
  assert(article && typeof article === 'object' && !Array.isArray(article), `${prefix}: expected an object`);
  assert(typeof article.id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.id), `${prefix}: use a lowercase ASCII kebab-case id`);
  if (filename) assert(basename(filename, '.json') === article.id, `${prefix}: filename must match id`);
  assert(article['@context'] === 'https://schema.org' && article['@type'] === 'BlogPosting', `${prefix}: expected Schema.org BlogPosting`);
  for (const field of required) assert(typeof article[field] === 'string' && article[field].trim(), `${prefix}: missing ${field}`);
  assert(article.headline.length <= 120 && article.description.length <= 160, `${prefix}: title/description exceeds repository limits (120/160)`);
  assert(article.inLanguage === locale, `${prefix}: inLanguage must equal folder locale`);
  for (const field of ['datePublished', 'dateModified']) assert(validDate(article[field]), `${prefix}: invalid ${field}`);
  assert(article.dateModified >= article.datePublished, `${prefix}: modified date precedes publication date`);
  assert(article.mainEntityOfPage?.['@type'] === 'WebPage'
    && article.mainEntityOfPage['@id'] === `${origin}/BR/${locale}/blog/${article.id}`, `${prefix}: canonical does not match the BR locale and id`);
  assert(Array.isArray(article.image) && article.image.length > 0 && article.image.every(httpsURL), `${prefix}: image must contain absolute HTTPS CDN URLs`);
  for (const field of ['author', 'publisher']) {
    assert(article[field]?.['@type'] === 'Organization' && article[field].name === 'Keeta Brasil'
      && article[field].url === `${origin}/BR/${locale}`, `${prefix}: invalid ${field} attribution`);
  }
  assert(article.publisher.logo?.['@type'] === 'ImageObject' && httpsURL(article.publisher.logo.url), `${prefix}: missing publisher logo`);
  assert(Array.isArray(article.keywords) && article.keywords.length > 0
    && article.keywords.every(k => typeof k === 'string' && k.trim()), `${prefix}: keywords must be nonempty strings`);
  assert(Number.isInteger(article.wordCount) && article.wordCount > 0
    && Number.isFinite(article.readTime) && article.readTime > 0, `${prefix}: wordCount/readTime must be positive`);
  // An editorial tripwire, not a general HTML sanitizer. The official site renders this HTML.
  assert(!/<\s*\/?\s*(script|iframe|object|embed|form|style|svg|math)\b|\bon[a-z]+\s*=|(?:javascript|vbscript|data)\s*:/i.test(article.articleBody), `${prefix}: active HTML is not permitted`);
  assert(/<(p|h2|ul|ol)\b/i.test(article.articleBody), `${prefix}: expected article HTML`);
  return article;
}

export function mergeArticles(baseline, articles) {
  assert(baseline && typeof baseline === 'object' && !Array.isArray(baseline), 'Baseline must be a JSON object');
  const result = structuredClone(baseline);
  for (const [locale, key] of Object.entries(locales)) {
    assert(Array.isArray(result[key]), `Baseline is missing ${key}`);
    const ids = new Set();
    for (const post of result[key]) {
      assert(post && typeof post.id === 'string' && post.id, `Baseline ${key}: missing id`);
      assert(!ids.has(post.id), `Baseline ${key}: duplicate id ${post.id}`);
      ids.add(post.id);
    }
    for (const item of articles.filter(item => item.locale === locale)) {
      const post = validateArticle(item.article, locale, item.filename);
      assert(!ids.has(post.id), `${locale}: duplicate id ${post.id}; updates require a separately reviewed change`);
      ids.add(post.id);
      result[key].push(structuredClone(post));
    }
  }
  assert(articles.every(item => Object.hasOwn(locales, item.locale)), 'Unsupported article locale');
  return result;
}

export async function readArticles(root) {
  const articles = [];
  for (const locale of Object.keys(locales)) {
    const folder = resolve(root, 'content/guides', locale);
    for (const file of (await readdir(folder)).sort()) {
      if (file === '.gitkeep') continue;
      assert(file.endsWith('.json'), `${locale}/${file}: only JSON article files are supported`);
      const article = JSON.parse(await readFile(resolve(folder, file), 'utf8'));
      validateArticle(article, locale, file);
      articles.push({ locale, filename: file, article });
    }
  }
  return articles;
}

async function main() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    assert(['--check', '--baseline', '--out'].includes(arg), `Unknown argument: ${arg}`);
    if (arg === '--check') options.check = true;
    else {
      assert(args[i + 1] && !args[i + 1].startsWith('--'), `${arg} requires a path`);
      options[arg.slice(2)] = resolve(args[++i]);
    }
  }
  const articles = await readArticles(process.cwd());
  // The snapshot catches existing-site duplicates even when no fresh baseline is supplied.
  const known = JSON.parse(await readFile(resolve('docs/reference/existing-slugs.json'), 'utf8'));
  mergeArticles(known, articles);
  const baseline = options.baseline ? JSON.parse(await readFile(options.baseline, 'utf8'))
    : Object.fromEntries(Object.values(locales).map(key => [key, []]));
  const merged = mergeArticles(baseline, articles);
  if (!options.check) {
    const out = options.out ?? resolve('dist', options.baseline ? 'blog-posts.merged.json' : 'blog-posts.additions.json');
    assert(out !== options.baseline, 'Output must differ from baseline; the official source is read-only');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify(merged, null, 2) + '\n');
    console.log(`Wrote ${out}. ${options.baseline ? 'Merged review artifact' : 'ADDITIONS ONLY: never replace the official source with this file'}.`);
  }
  console.log(`Validated ${articles.length} staged articles. No website was deployed.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
