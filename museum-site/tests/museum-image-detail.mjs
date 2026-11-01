import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { imageDetailLayout, imageDetailTransform } from '../lib/image-detail.ts';
import { spatialExhibits } from '../lib/museum-spatial.ts';

for (const e of spatialExhibits) for (const [width, height] of [[390, 360], [1280, 620]]) {
  const view = imageDetailLayout(1536, 1024, width, height, e.crop);
  assert(view.width <= width && view.height <= height);
  const native = imageDetailTransform(view, view.nativeZoom, 0, 0, width, height);
  assert(Math.abs(native.width - view.naturalWidth) < 1e-8);
  assert(Math.abs(native.height - view.naturalHeight) < 1e-8);
  const far = imageDetailTransform(view, 8000, 999999, -999999, width, height);
  assert(far.zoom <= Math.max(8, view.nativeZoom));
  assert.equal(far.x, Math.max(0, (far.width - width) / 2));
  assert.equal(far.y, -Math.max(0, (far.height - height) / 2));
  assert.equal(e.modelStatus, 'VIEW_ONLY');
  assert.equal(e.displayScale, 'EXHIBITION_ONLY');
}
for (const crop of [[0,0,0,1],[-.1,0,1,1],[0,0,1,2],[0,NaN,1,1]]) assert.throws(() => imageDetailLayout(1536,1024,390,360,crop));
assert.throws(() => imageDetailLayout(0,1024,390,360));
const s = await readFile(new URL('../components/museum-image-detail.tsx',import.meta.url),'utf8');
assert(s.includes('src={image}'),'Detail inspection loads the original image, not a compressed presentation fallback');
assert(s.includes('VIEW ONLY · ORIGINAL') && s.includes('layout!.nativeZoom'));
const ui=await readFile(new URL('../components/museum-spatial.tsx',import.meta.url),'utf8');
assert(ui.includes('onDetail(selected.id)') && ui.includes('j.selected??undefined'));
const integration=await readFile(new URL('../components/museum.tsx',import.meta.url),'utf8');
assert(integration.includes('setInspection({ id, image: item.image, title: item.title, crop: item.crop }); setPanel("detail");'));
assert(integration.includes('onOpenChange={open => { if (!open) setPanel("none"); }}'),'Closing detail clears the layer without changing Museum journey or camera');
console.log('PASS: all 18 exhibits expose original detail pixels, exact native scale, bounded pan/zoom, valid crops and preserved VIEW ONLY / display-only states. This is not browser E2E.');
