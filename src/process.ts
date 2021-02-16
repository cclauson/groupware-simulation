import { prng } from "seedrandom";

export interface Process<TOp, TState> {
    generateLocalOp(): TOp;
    processRemoteOp(op: TOp, order: number): void;
    getState(): TState;
}

export interface ProcessFactory<TOp, TState> {
    createProcess(processId: number, prng: prng): Process<TOp, TState>;
}