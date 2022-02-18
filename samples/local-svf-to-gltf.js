/*
 * Example: converting an SVF (without property database) from local file system.
 * Usage:
 *     node local-svf-to-gltf.js <path to svf file> <path to output folder>
 */

const path = require('path');
const { SvfReader, GltfWriter } = require('..');

async function run (filepath, outputDir) {
    const defaultOptions = {
        deduplicate: false,
        skipUnusedUvs: false,
        center: true,
        // log: console.log
        maxBufferSize: 200 * (1 << 20)
    };

    try {
        const reader = await SvfReader.FromFileSystem(filepath);
        const scene = await reader.read();
        console.log('done reading');
        let writer;
        writer = new GltfWriter(Object.assign({}, defaultOptions));
        await writer.write(scene, path.join(outputDir, 'gltf'));
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

run(process.argv[2], process.argv[3]);
