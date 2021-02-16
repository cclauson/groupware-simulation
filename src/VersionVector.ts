

export class VersionVector {
    private readonly map: Map<number, number>;

    private constructor(map: Map<number, number>) {
        this.map = map;
    }

    public static initial = new VersionVector(new Map());

    public incrementForProcessId(processId: number): VersionVector {
        const clonedMap = new Map(this.map);
        const currVal = clonedMap.get(processId);
        if (currVal) {
            clonedMap.set(processId, currVal + 1);
        } else {
            clonedMap.set(processId, 1);
        }
        return new VersionVector(clonedMap);
    }
}