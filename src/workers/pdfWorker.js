import { createRequire } from "module";
import path from "path";
import { generatePdf, preloadFonts } from "pdf-markup";
import { parentPort } from "worker_threads";

let fontsReady = false;

const require = createRequire(import.meta.url);

const fontsDir = path.dirname(require.resolve("pdf-markup"));

async function init() {
  if (!fontsReady) {
    preloadFonts(fontsDir);
    fontsReady = true;
  }
}

parentPort.on("message", async (job) => {
  try {
    await init();
    switch (job.type) {
      case "generatePdf":
        const pdf = await generatePdf(job.payload);
        parentPort.postMessage({ id: job.id, result: pdf });
        break;
    }
  } catch (err) {
    parentPort.postMessage({ id: job.id, error: err instanceof Error ? err.message : String(err) });
  }
});
