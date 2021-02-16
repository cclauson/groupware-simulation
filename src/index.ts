import seedrandom, { prng } from 'seedrandom';
import { DocumentEditorFactory } from './DocumentEditor';
import { Process, ProcessFactory } from './process';
import { randomInt, RandomSet } from './randomUtil';


const nProcesses = 7;
const rng = seedrandom('hello');
const processFactory = new DocumentEditorFactory();

simulate(processFactory, rng, nProcesses);

function simulate<TOp, TState>(processFactory: ProcessFactory<TOp, TState>, rng: prng, nProcesses: number): void {
    const processes: Process<TOp, TState>[] = [];
    for (let i = 0; i < nProcesses; ++i) {
        processes.push(processFactory.createProcess(i, rng));
    }

    // An op that has undergone ordering, and is awaiting delivery
    interface OpToDeliver {
        op: TOp;
        order: number;
        recipient: number;
    }

    const opsToOrder = new RandomSet<TOp>(rng);
    const opsToDeliver = new RandomSet<OpToDeliver>(rng);

    function createOp() {
        const process = processes[randomInt(nProcesses, rng)];
        const op = process.generateLocalOp();
        opsToOrder.addElement(op);
    }

    function orderOp() {
        let order = 0;
        if (opsToOrder.isEmpty()) {
            throw new Error("Can't order op, since none are queued to order");
        }
        const op = opsToOrder.removeRandomElement();
        for (let i = 0; i < nProcesses; ++i) {
            opsToDeliver.addElement({
                op,
                order,
                recipient: i
            });
        }
        ++order;
    }

    function deliverOp() {
        if (opsToDeliver.isEmpty()) {
            throw new Error("Can't deliver op, since none are queued to deliver");
        }
        const op = opsToDeliver.removeRandomElement();
        const process = processes[op.recipient];
        process.processRemoteOp(op.op, op.order);
    }

    function orderOpOrDeliverOp() {
        if (opsToOrder.isEmpty()) {
            deliverOp();
            return;
        }
        if (opsToDeliver.isEmpty()) {
            orderOp();
            return;
        }
        const threshold = opsToOrder.getSize() / (opsToOrder.getSize() + opsToDeliver.getSize());
        if (rng.double() < threshold) {
            orderOp();
        } else {
            deliverOp();
        }
    }

    let numOpsToCreate = 100;

    while (numOpsToCreate > 0 || opsToOrder.getSize() > 0 || opsToDeliver.getSize() > 0) {
        if (numOpsToCreate === 0) {
            orderOpOrDeliverOp();
        } else if (opsToOrder.getSize() === 0 && opsToDeliver.getSize() === 0) {
            createOp();
            numOpsToCreate--;
        } else {
            const threshold = 1 / nProcesses;
            if (rng.double() < threshold) {
                createOp();
                numOpsToCreate--;
            } else {
                orderOpOrDeliverOp();
            }
        }
    }

    console.log('Done!');
    for (let process of processes) {
        console.log(process.getState());
    }
}
