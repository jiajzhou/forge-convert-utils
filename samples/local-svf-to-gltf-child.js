/*
 * Example: converting an SVF (without property database) from local file system.
 * Usage:
 *     node local-svf-to-gltf.js <path to svf file> <path to output folder>
 */

const path = require('path');
const { SvfReader, GltfWriter } = require('..');

async function run (options) {
    const {filepath, outputDir, start, end, partId} = options;

    const defaultOptions = {
        deduplicate: true,
        skipUnusedUvs: true,
        center: true,
        filter: (dbid) => dbid >= start && dbid < end,
        // log: console.log
    };

    try {
        const reader = await SvfReader.FromFileSystem(filepath);
        const scene = await reader.read();
        let writer;
        writer = new GltfWriter(Object.assign({}, defaultOptions));
        await writer.write(scene, path.join(outputDir));
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = function(data, callback) {
    run(data).then(() => {
        callback(null, data.partId);
    }).catch(err => {
        callback(err, data.partId);
    });
}
