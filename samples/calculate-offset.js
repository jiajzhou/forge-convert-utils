
const { Document, NodeIO } = require("@gltf-transform/core");
const { KHRONOS_EXTENSIONS } = require("@gltf-transform/extensions");
const { prune, bounds } = require("@gltf-transform/functions");

const fs = require("fs");
const path = require("path");
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);

async function run(inputFolder, outputFolder) {
    const parts = fs
      .readdirSync(inputFolder)
      .filter((p) => p.startsWith("part-"));


    // const loader = new THREE.GLTFLoader();
    // loader.load(ff, function(gltf) {

    

  for (const p of parts) {
    console.log("loading: " + p);
    //     const box = new THREE.Box3().setFromObject(gltf.scene);
    //     const size = box.getSize(new Vector3()).length();
    //     const center = box.getCenter(new Vector3());
    
    //     console.log(size, center)
    
      
        const document = await io.read(path.join(inputFolder, p, "output.gltf"));
        const root = document.getRoot();
        const {min, max} = bounds(root.listScenes()[0]);
        const offset = [(max[0] + min[0]) / 2, min[1], (max[2] + min[2]) / 2]
        console.log(p,  offset)
    // })
  }
}

run(process.argv[2], process.argv[3]);
