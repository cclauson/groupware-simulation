import { prng } from 'seedrandom';

// supports addition of elements to the set,
// as well as removal of a random element
export class RandomSet<TElement> {
    private readonly prng: prng;
    private elements: TElement[]

    constructor(prng: prng) {
        this.prng = prng;
        this.elements = [];
    }

    public addElement(element: TElement): void {
        this.elements.push(element);
    }

    public removeRandomElement(): TElement {
        if (this.elements.length === 0) {
            throw new Error("Can't remove random element from set, since set is empty");
        }
        const index = randomInt(this.elements.length, this.prng);
        const element = this.elements[index];
        this.elements = this.elements.slice(0, index).concat(this.elements.slice(index + 1));
        return element;
    }

    public isEmpty(): boolean {
        return this.elements.length === 0;
    }

    public getSize(): number {
        return this.elements.length;
    }
}

export function randomInt(upperBoundExclusive: number, prng: prng): number {
    return Math.floor(prng.double() * upperBoundExclusive);
}
