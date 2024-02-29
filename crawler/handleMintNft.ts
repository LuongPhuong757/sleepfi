import NftService from "./services/NftService";

require('dotenv').config()

async function updateNftOnChain() {
  console.log('----- Start update nft on chain -----');
  try {
    await NftService.getInstance().mintNft();
  } catch (e) {
    console.log(`Update nft on chain error`, e);
  }
  console.log(`----- Update nft on chain END -----`);
  setTimeout(updateNftOnChain, 60000);
}

const mainLoop = async function (nftType, contractAddress, tokenId) {
  updateNftOnChain();
};

(async (nftType, contractAddress, tokenId) => {
  await mainLoop(nftType, contractAddress, tokenId);
})();
