import { assert } from "chai";
import { applyOpToDocument, createDeleteOp, createInsertOp } from "./DocumentOps";

describe('Op tests', () => {
    it('Inserts into a string', () => {
        const doc = 'ac';
        const insertOp = createInsertOp(1, 'b');
        const docOperatedOn = applyOpToDocument(insertOp, doc);
        assert.strictEqual(docOperatedOn, 'abc');
    });
    it('Appends to beginning of a string', () => {
        const doc = 'ac';
        const insertOp = createInsertOp(0, 'b');
        const docOperatedOn = applyOpToDocument(insertOp, doc);
        assert.strictEqual(docOperatedOn, 'bac');
    });
    it('Appends to end of a string', () => {
        const doc = 'ac';
        const insertOp = createInsertOp(2, 'b');
        const docOperatedOn = applyOpToDocument(insertOp, doc);
        assert.strictEqual(docOperatedOn, 'acb');
    });
    it("Doesn't insert past end of string", () => {
        const doc = 'ac';
        const insertOp = createInsertOp(3, 'b');
        assert.throws(() => applyOpToDocument(insertOp, doc));
    });
    it('Deletes first character of a string', () => {
        const doc = 'abc';
        const deleteOp = createDeleteOp(0);
        const docOperatedOn = applyOpToDocument(deleteOp, doc);
        assert.strictEqual(docOperatedOn, 'bc');
    })
    it('Deletes middle character of a string', () => {
        const doc = 'abc';
        const deleteOp = createDeleteOp(1);
        const docOperatedOn = applyOpToDocument(deleteOp, doc);
        assert.strictEqual(docOperatedOn, 'ac');
    })
    it('Deletes end character of a string', () => {
        const doc = 'abc';
        const deleteOp = createDeleteOp(2);
        const docOperatedOn = applyOpToDocument(deleteOp, doc);
        assert.strictEqual(docOperatedOn, 'ab');
    })
    it("Doesn't delete off the end of a string", () => {
        const doc = 'abc';
        const deleteOp = createDeleteOp(3);
        assert.throws(() => applyOpToDocument(deleteOp, doc));
    })
});