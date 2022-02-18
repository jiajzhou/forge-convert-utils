const { Document, NodeIO } = require("@gltf-transform/core");
const { KHRONOS_EXTENSIONS } = require("@gltf-transform/extensions");
const { prune } = require("@gltf-transform/functions");
const gltfPipeline = require("gltf-pipeline");

const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
const gltfToGlb = gltfPipeline.gltfToGlb;

async function run(inputFolder) {
  const parts = fs
    .readdirSync(inputFolder)
    .filter((p) => p.startsWith("part-"));
    //.filter((p) => p === "part-1" || p === "part-2");

  // Merge all files.
  for (const p of parts) {
    console.log("loading: " + p);
    const gltf = fsExtra.readJsonSync(path.join(inputFolder, p, "output.gltf"));
    try {
      const results = await gltfToGlb(gltf, {resourceDirectory: path.join(inputFolder, p)});
      fsExtra.writeFileSync(path.join(inputFolder, p, p + ".glb"), results.glb);
    } catch (err) {
      console.error("failed to transform", err);
    }
  }
}

run(process.argv[2]);
