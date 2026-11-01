import assert from 'node:assert/strict';
import { catalog, nextIndex } from '../lib/museum-domain.ts';
assert.equal(nextIndex(0,-1,catalog.length),catalog.length-1);
assert.equal(nextIndex(catalog.length-1,1,catalog.length),0);
assert.throws(()=>nextIndex(0,1,0));
assert.throws(()=>nextIndex(0,.5,2));
assert(Object.isFrozen(catalog)&&Object.isFrozen(catalog[0])&&Object.isFrozen(catalog[0].config));
assert.equal(catalog[1].category,'COIN CASE');
console.log('PASS: circular exhibit navigation, invalid navigation rejected, source references immutable, MERGE COIN case identity preserved.');
