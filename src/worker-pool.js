import { Worker } from "worker_threads";

export class WorkerPool {
  constructor(workerFile, size = 4) {
    this.workers = [];
    this.freeWorkers = [];

    this.jobs = new Map();
    this.jobQueue = [];
    this.jobCounter = 0;

    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerFile);

      worker.on("message", (msg) => this._handleMessage(msg, worker));

      worker.on("error", (err) => console.error("Worker error:", err));

      worker.on("exit", (code) => {
        if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
      });

      this.freeWorkers.push(worker);

      this.workers.push(worker);
    }
  }

  _handleMessage(msg, worker) {
    const job = this.jobs.get(msg.id);
    if (!job) return;

    if (msg.error) job.reject(new Error(msg.error));
    else job.resolve(msg.result);

    this.jobs.delete(msg.id);
    this.freeWorkers.push(worker);

    if (this.jobQueue.length > 0) {
      const nextJob = this.jobQueue.shift();

      this._dispatch(nextJob);
    }
  }

  run(type, payload) {
    return new Promise((resolve, reject) => {
      const id = ++this.jobCounter;

      const job = { id, type, payload, resolve, reject };
      this.jobs.set(id, job);

      if (this.freeWorkers.length > 0) {
        this._dispatch(job);
      } else {
        this.jobQueue.push(job);
      }
    });
  }

  _dispatch(job) {
    const worker = this.freeWorkers.pop();

    if (!worker) {
      this.jobQueue.push(job);
      return;
    }
    worker.postMessage({ id: job.id, type: job.type, payload: job.payload });
  }

  destroy() {
    this.workers.forEach((w) => w.terminate());
    this.workers = [];

    this.freeWorkers = [];

    this.jobs.clear();
    this.jobQueue = [];
  }
}
