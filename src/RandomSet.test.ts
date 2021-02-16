import { assert } from 'chai';
import seedrandom from 'seedrandom';
import { RandomSet } from './randomUtil';

describe('Op tests', () => {
    it('Allows insertion of elements, and removal afterwards', () => {
        const rng = seedrandom('hello');
        const randomSet = new RandomSet<number>(rng);
        const a = 3;
        const b = 7;
        const c = 31;
        assert.isTrue(randomSet.isEmpty());
        randomSet.addElement(a);
        assert.isFalse(randomSet.isEmpty());
        randomSet.addElement(b);
        assert.isFalse(randomSet.isEmpty());
        randomSet.addElement(c);
        assert.isFalse(randomSet.isEmpty());
        const set = new Set<number>();
        set.add(randomSet.removeRandomElement());
        set.add(randomSet.removeRandomElement());
        set.add(randomSet.removeRandomElement());
        assert.throws(() => {
            randomSet.removeRandomElement();
        });
        assert.isTrue(randomSet.isEmpty());
        assert.isTrue(set.has(a));
        assert.isTrue(set.has(b));
        assert.isTrue(set.has(c));
    });
});
