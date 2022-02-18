const { Document, NodeIO } = require("@gltf-transform/core");
const { KHRONOS_EXTENSIONS } = require("@gltf-transform/extensions");
const { prune } = require("@gltf-transform/functions");

const fs = require("fs");
const path = require("path");
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);

async function run(inputFolder, outputFolder) {
  const parts = fs
    .readdirSync(inputFolder)
    // .filter((p) => p.startsWith("part-"));
    .filter((p) => p === 'part-5' || p === 'part-6'|| p === 'part-3');

  fs.mkdirSync(outputFolder, { recursive: true });

  filePaths = parts.map((p) => path.join(inputFolder, p, "output.gltf"));

  const document = new Document();
  const root = document.getRoot();

  // Merge all files.
  for (const path of filePaths) {
      console.log('loading: ' + path)
    document.merge(await io.read(path));
  }

  // (Optional) Consolidate buffers.
  const buffer = root.listBuffers()[0];
  root.listAccessors().forEach((a) => a.setBuffer(buffer));
  root.listBuffers().forEach((b, index) => (index > 0 ? b.dispose() : null));

  const mainScene = root.listScenes()[0];

  for (const scene of root.listScenes()) {
      console.log('processing ' + scene.getName())
    if (scene === mainScene) continue;

    for (const child of scene.listChildren()) {
      // If conditions are met, append child to `mainScene`.
      // Doing so will automatically detach it from the
      // previous scene.
      mainScene.addChild(child);
    }

    scene.dispose();
  }

  await document.transform(prune);

  await io.write(path.join(outputFolder, "merged1.gltf"), document);
}

run(process.argv[2], process.argv[3]);
