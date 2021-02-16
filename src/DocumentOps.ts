
export interface InsertOp {
    kind: 'insert';
    index: number;
    char: string;
}

export interface DeleteOp {
    kind: 'delete';
    index: number;
}

export function createInsertOp(index: number, char: string): InsertOp {
    if (char.length !== 1) {
        throw new Error(`Expected character to be length 1 string, but length was ${char.length}.`);
    }
    return {
        kind: 'insert',
        index,
        char
    }
}

export function createDeleteOp(index: number): DeleteOp {
    return {
        kind: 'delete',
        index
    }
}

export type DocumentOp = InsertOp | DeleteOp;


export function applyOpToDocument(op: DocumentOp, doc: string): string {
    switch (op.kind) {
        case 'insert':
            if (doc.length < op.index) {
                throw new Error(`Can't insert into position ${op.index} in document of length ${doc.length}.`);
            }
            if (op.char.length !== 1) {
                throw new Error(`Expected character to be length 1 string, but length was ${op.char.length}.`);
            }
            return [ doc.slice(0, op.index), op.char, doc.slice(op.index) ].join('');
        case 'delete':
            if (doc.length <= op.index) {
                throw new Error(`Can't delete, index out of bounds, index: ${op.index}, doc length: ${doc.length}`)
            }
            return [doc.slice(0, op.index), doc.slice(op.index + 1)].join('');
    }
}
