import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeArticles, validateArticle } from './content.mjs';

const fixture = (locale = 'en') => ({
  '@context': 'https://schema.org', '@type': 'BlogPosting', id: 'test-article',
  headline: 'Test article', description: 'A test fixture only.',
  articleSection: 'Guides', articleBody: '<h2>Heading</h2><p>Example body.</p>',
  inLanguage: locale, datePublished: '2026-01-01', dateModified: '2026-01-01',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.keeta-global.com/BR/${locale}/blog/test-article` },
  image: ['https://img-ap-hongkong.mykeeta.net/test.webp'],
  author: { '@type': 'Organization', name: 'Keeta Brasil', url: `https://www.keeta-global.com/BR/${locale}` },
  publisher: { '@type': 'Organization', name: 'Keeta Brasil', url: `https://www.keeta-global.com/BR/${locale}`, logo: { '@type': 'ImageObject', url: 'https://img-ap-hongkong.mykeeta.net/logo.png' } },
  keywords: ['test'], wordCount: 4, readTime: 1,
});
const empty = () => ({ BLOG_LIST_BR_EN: [], 'BLOG_LIST_BR_PT-BR': [] });

test('merging preserves original data, extra keys, order and language boundaries', () => {
  const baseline = { ...empty(), BLOG_LIST_BR_EN: [{ id: 'legacy-accent-é', custom: true }], extra: { keep: true } };
  const before = structuredClone(baseline);
  const out = mergeArticles(baseline, [{ locale: 'en', article: fixture() }, { locale: 'pt-BR', article: fixture('pt-BR') }]);
  assert.deepEqual(baseline, before);
  assert.deepEqual(out.BLOG_LIST_BR_EN[0], baseline.BLOG_LIST_BR_EN[0]);
  assert.deepEqual(out.extra, baseline.extra);
  assert.equal(out.BLOG_LIST_BR_EN.length, 2);
  assert.equal(out['BLOG_LIST_BR_PT-BR'].length, 1);
});
test('duplicate ids cannot silently overwrite existing or newly staged articles', () => {
  const item = { locale: 'en', article: fixture() };
  assert.throws(() => mergeArticles({ ...empty(), BLOG_LIST_BR_EN: [fixture()] }, [item]), /duplicate id/);
  assert.throws(() => mergeArticles(empty(), [item, item]), /duplicate id/);
});
test('wrong-language and wrong-domain canonicals fail', () => {
  for (const url of ['https://www.keeta-global.com/BR/pt-BR/blog/test-article', 'https://example.com/BR/en/blog/test-article']) {
    const post = fixture(); post.mainEntityOfPage['@id'] = url;
    assert.throws(() => validateArticle(post, 'en'), /canonical/);
  }
});
test('invalid dates, local covers and active HTML fail before export', () => {
  for (const changes of [{ datePublished: '2026-02-30' }, { image: ['/blog/covers/test.svg'] }, { articleBody: '<p onclick="bad()">Test</p>' }]) {
    assert.throws(() => validateArticle({ ...fixture(), ...changes }, 'en'));
  }
});
