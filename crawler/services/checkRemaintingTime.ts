import { BadRequestException } from "@nestjs/common";
import BigNumber from "bignumber.js";
import { BedMintings } from "crawler/entities/BedMinting.entity";
import { ConfigMinting } from "crawler/entities/ConfigMinting.entity";
import { NftAttributes } from "crawler/entities/NftAttributes.entity";
import { NftLevelUp } from "crawler/entities/NftLevelUp.entity";
import { Poins } from "crawler/entities/Points.entity";
import { SpendingBalances } from "crawler/entities/SpendingBalance.entity";
import { User } from "crawler/entities/User.entity";
import { UserTransaction } from "crawler/entities/UserTransaction.entity";
import moment from "moment";
import { MESSAGE } from "src/common/messageError";
import { GET_POINT } from "src/common/minting";
import { TYPE } from "src/common/UserTransaction";
import { getLevel } from "src/common/Utils";
import { NUMBER_VALUE } from "src/nfts/constants";

import { KEY_IN_CACHE, NFT_LEVEL_UP_STATUS, NUMBER_DAY_IN_MONTH, NUMBER_DAY_IN_YEAR, ONE_DAY, StatusStacking } from "../constants/enum";

export class remaintingTime {
  public checkRemaintingTime = async () => {
    console.log('====================================');
    console.log(`remaintingTime`);
    console.log('====================================');
    const findStatusNftLevelUp = await NftLevelUp.find({
      where: {
        status: NFT_LEVEL_UP_STATUS.PROCESSING
      }
    })
    for (const item of findStatusNftLevelUp) {
      const bed = await this.findBed(item.bedId)
      const userFind = await User.findOne({ wallet: bed.owner });
      const chekCostLevelUp = await this.getCostLevelUp(bed.level, bed.time, item.bedId)
      if (item?.remainTime && Number(item.remainTime) <= Number(moment(new Date)) && item.status == NFT_LEVEL_UP_STATUS.PROCESSING) {
        item.status = NFT_LEVEL_UP_STATUS.PENDING;
        item.levelUpTime = chekCostLevelUp.nextLevel.level_time;
        item.remainTime = null;
        await item.save()
        console.log('==========updateNftLevelUpSuccess=========');
        bed.level += 1
        bed.levelUpTime = null
        const updateBed = await bed.save()

        //update points
        const point = await GET_POINT(bed.quality);
        let bedPoints = await Poins.findOne({ bedId: bed.nftId });
        if (!bedPoints) {
          bedPoints = new Poins();
        }
        const updateBedPoints = await this.updateBedPoints(bedPoints, bed.nftId, point);
        console.log('============updateBedPoints======:', updateBedPoints);
        const newBedMinting = await this.updateBedMinting(updateBed)
        const bedPoint = await updateBedPoints.save()
        //insert user_transaction when level up 
        await UserTransaction.insert([
          {
            type: TYPE.POINT_MINTED,
            userId: userFind.id,
            nftId: bed.nftId,
            pointMinted: bedPoint.bedPoint
          },
          {
            type: TYPE.MAX_MINTING,
            userId: userFind.id,
            nftId: bed.nftId,
            maxMinting: newBedMinting.mintedNumber
          }
        ])
      }
    }

  }

  public updateBedMinting = async (bed: NftAttributes) => {
    let bedMinting = await BedMintings.findOne({ bedId: bed.id })
    if (!bedMinting) {
      bedMinting = await this.insertBedMinting(bed)
    }
    const configMinting = await ConfigMinting.findOne({ level: bed.level })
    if (configMinting) {
      bedMinting.maxMinting = configMinting.mintingNumber
      return await bedMinting.save()
    } else {
      return bedMinting
    }
  }


  public insertBedMinting = async (bed: NftAttributes) => {
    const bedMinting = new BedMintings()
    bedMinting.bedId = bed.id
    bedMinting.mintedNumber = 0;
    bedMinting.maxMinting = 0;
    bedMinting.waitingTime = null;
    return await bedMinting.save()
  }

  public updateBedPoints = async (bedPoints: Poins, id: number, point: number) => {
    bedPoints.bedId = id;
    bedPoints.bedPoint = (bedPoints.bedPoint) ? bedPoints.bedPoint + point : 0 + point;
    return bedPoints;
  }

  public getCostLevelUp = async (next_level, sleep_time, bedId) => {
    // const nextLevelValue = await getLevel(next_level);
    const findBed = await NftAttributes.findOne({ where: { nftId: bedId } })
    const nextLevelValue = await getLevel(findBed.level);
    const nextLevel = await getLevel(findBed.level + 1);
    const nftLevelUp = await NftLevelUp.findOne({ bedId });
    let data = {
      cost: null,
      constSpeedUp: null,
      require_time: null,
      sleep_time: null
    };
    // not speed up
    if (nextLevelValue.level_time <= sleep_time || nftLevelUp.remainTime <= Number(moment(new Date))) {
      data = {
        cost: nextLevelValue.level_token,
        constSpeedUp: nextLevelValue.level_fee,
        require_time: nextLevelValue.level_time,
        sleep_time: sleep_time,
      };
    }
    return { data, nextLevel }
  }

  public findBed(bedId: number) {
    return NftAttributes.findOne({
      where: {
        nftId: bedId
      }
    })
  }
}
