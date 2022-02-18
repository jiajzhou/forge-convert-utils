/*
 * Example: converting an SVF (without property database) from local file system.
 * Usage:
 *     node local-svf-to-gltf.js <path to svf file> <path to output folder>
 */

const path = require('path');
const { SvfReader, GltfWriter } = require('..');

const workerFarm = require('worker-farm');
const workers = workerFarm(require.resolve('./local-svf-to-gltf-child'));

async function run (filepath, outputDir) {
    const reader = await SvfReader.FromFileSystem(filepath);

    let maxDbId = 0;
    for await (const frag of reader.enumerateFragments()) {
        maxDbId = Math.max(maxDbId, frag.dbID);
    }

    console.log('max dbid ' + maxDbId);

    const PART_SIZE = 100000;
    let total = 0;
    let partId = 0;
    let start = 0;
    let end = PART_SIZE;
    while (start <= maxDbId) {
        total++;
        partId++;
        workers({filepath: filepath, outputDir: path.join(outputDir, `part-${partId}`), start, end, partId}, (err, output) => {
            total--;
            if (total == 0) {
                workerFarm.end(workers);
            }
        });
        console.log('started worker ' + partId);
        start = end;
        end += PART_SIZE;
    }
}

run(process.argv[2], process.argv[3]);
