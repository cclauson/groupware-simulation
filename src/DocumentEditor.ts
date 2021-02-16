import { prng } from 'seedrandom';
import { applyOpToDocument, createDeleteOp, createInsertOp, DeleteOp, DocumentOp, InsertOp } from './DocumentOps';
import { Process, ProcessFactory } from './process';
import { randomInt } from './randomUtil';
import { VersionVector } from './VersionVector';

interface DocumentEditorOp {
    op: DocumentOp;
    originatingProcess: number;
    versionVector: VersionVector;
}

export class DocumentEditorFactory implements ProcessFactory<DocumentEditorOp, string> {
    public createProcess(processId: number, prng: prng): Process<DocumentEditorOp, string> {
        return new DocumentEditor(processId, prng);
    }
}

export class DocumentEditor implements Process<DocumentEditorOp, string> {
    private readonly processId: number;
    private readonly prng: prng;
    private document: string;
    private versionVector: VersionVector;

    public constructor(processId: number, prng: prng) {
        this.processId = processId;
        this.prng = prng;
        this.document = '';
        this.versionVector = VersionVector.initial;
    }

    public generateLocalOp(): DocumentEditorOp {
        const op = this.createRandomOp();
        this.document = applyOpToDocument(op, this.document);
        this.versionVector = this.versionVector.incrementForProcessId(this.processId);
        return {
            op,
            originatingProcess: this.processId,
            versionVector: this.versionVector
        };
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

    public processRemoteOp(op: DocumentEditorOp, order: number): void {
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
