import { prng } from 'seedrandom';
import { applyOpToDocument, createDeleteOp, createInsertOp, DeleteOp, DocumentOp, InsertOp } from './DocumentOps';
import { Process, ProcessFactory } from './process';
import { randomInt } from './randomUtil';

export class DocumentEditorFactory implements ProcessFactory<DocumentOp, string> {
    public createProcess(processId: number, prng: prng): Process<DocumentOp, string> {
        return new DocumentEditor(processId, prng);
    }
}

export class DocumentEditor implements Process<DocumentOp, string> {
    private readonly processId: number;
    private readonly prng: prng;
    private document: string;

    public constructor(processId: number, prng: prng) {
        this.processId = processId;
        this.prng = prng;
        this.document = '';
    }

    public generateLocalOp(): DocumentOp {
        const op = this.createRandomOp();
        this.document = applyOpToDocument(op, this.document);
        return op;
    }

    private createRandomOp(): DocumentOp {
        if (this.document.length === 0) {
            return createRandomInsert(0, this.prng);
        }
        if (this.prng.double() < 0.3) {
            return createRandomDelete(this.document.length, this.prng);
        } else {
            return createRandomInsert(this.document.length, this.prng);
        }
    }

    public processRemoteOp(op: DocumentOp, order: number): void {
        // noop for now
    }

    public getState(): string {
        return this.document;
    }
}

function createRandomInsert(docLength: number, prng: prng): InsertOp {
    return createInsertOp(randomInt(docLength, prng), createRandomLetter(prng));
}

function createRandomDelete(docLength: number, prng: prng): DeleteOp {
    if (docLength === 0) {
        throw new Error("Can't delete content from document of zero length");
    }
    return createDeleteOp(randomInt(docLength - 1, prng));
}

function createRandomLetter(prng: prng): string {
    return String.fromCharCode(97 + randomInt(26, prng));
}
