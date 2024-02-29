import { connectDB } from "./database";
import { BedMintings } from "./entities/BedMinting.entity"
import { NftAttributes } from "./entities/NftAttributes.entity"

async function updateBedMinting() {
  const nftAttributes = await NftAttributes
    .createQueryBuilder('na')
    .select('na.nft_id as nftId')
    .where('na.level < 5')
    .getRawMany()

  for (let i = 0; i < nftAttributes.length; i++) {
    await BedMintings.update({ bedId: nftAttributes[i].nftId }, { maxMinting: 0 })
  }
}

(async () => {
  await connectDB();
  await updateBedMinting()
  console.log('end');
})();
