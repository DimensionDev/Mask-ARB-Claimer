import Claimers from "./claimer.json";
import { MerkleTree } from "merkletreejs";
import { utils } from "ethers";
import { resolve } from "path";
import { writeFile, mkdir } from "fs/promises";

async function main() {
  const airdropList = Object.entries(Claimers).map(([address, amount]) => {
    return utils.keccak256(
      utils.solidityPack(
        ["address", "uint256"],
        [address, utils.parseEther(amount)]
      )
    );
  });

  const merkleTree = new MerkleTree(airdropList, utils.keccak256, {
    sortPairs: true,
  });
  const merkleRoot = "0x" + merkleTree.getRoot().toString("hex");

  const pathToDist = resolve(__dirname, "./dist/");

  await mkdir(pathToDist, { recursive: true });
  await writeFile(`${pathToDist}/merkleRoot.txt`, merkleRoot);

  console.log("Generated merkle root successfully!");
}

main();
