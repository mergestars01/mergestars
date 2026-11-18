import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/living-museum/lib/unique-reference-photos.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { referencePhotoKey, uniqueReferencePhotos } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const photos = [{ image: '/a.png', title: 'Original' }, { image: '/b.png' }, { image: '/a.png', title: 'Repeated' }];
assert.deepEqual(uniqueReferencePhotos(photos), photos.slice(0, 2));
assert.equal(photos.length, 3);
assert.deepEqual(uniqueReferencePhotos([]), []);
console.log('Reference photos: stable order, first entry retained, input preserved.');

const assets = '/living-museum/assets/';
const aliases = [
  { image: assets + 'vip-grand-museum.png', title: 'Keep this caption' },
  { image: assets + 'approved-mega-museum.png' },
  { image: assets + 'optimized/approved-mega-museum.webp' },
  { image: assets + 'entrance-dual-closed.png' },
  { image: assets + 'founder-portal-closed.png' },
  { image: assets + 'founder-open-portal-oct18.png' },
  { image: 'https://example.com/vip-grand-museum.png' },
];
assert.deepEqual(uniqueReferencePhotos(aliases), [aliases[0], aliases[3], aliases[5], aliases[6]]);
assert.equal(referencePhotoKey(aliases[0].image), referencePhotoKey(aliases[2].image));
assert.notEqual(referencePhotoKey(aliases[3].image), referencePhotoKey(aliases[5].image));
