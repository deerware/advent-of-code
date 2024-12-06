import { Worker, isMainThread, parentPort } from 'worker_threads';

export default class WorkerWorker<T, U> {
    constructor(
        public child: (message: T) => U | Promise<U>,
    ) {
        if (!isMainThread && parentPort)
            parentPort.once('message', (message: T) => {
                const result = child(message);

                if (result instanceof Promise)
                    result.then(result => parentPort!.postMessage(result));
                else
                    parentPort!.postMessage(result);
            });
    }

    async run(message: T, filename: string): Promise<U> {
        if (!isMainThread)
            throw new Error('Cannot run worker from worker.');

        return new Promise((resolve, reject) => {
            const worker = new Worker(filename);
            worker.once('message', (result: U) => {
                resolve(result);
            });
            worker.once('error', (error) => {
                reject(error);
            });
            worker.once('exit', (code) => {
                reject(new Error(`Worker stopped with exit code ${code}`));
            });
            worker.postMessage(message);
        });
    }
}