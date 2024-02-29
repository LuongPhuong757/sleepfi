import {In} from "typeorm";

import {connectDB} from "./database";
import {Nfts} from "./entities/Nft.entity";
import {NftAttributes} from "./entities/NftAttributes.entity";
import {NftSales} from "./entities/NftSale.entity";

const randomNft = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const listNft = () => {
    const nfts = []
    let i = 5801
    while (i <= 6000) {
        // const nft = randomNft(5801, 6000)
        // if (nfts.includes(i)) continue
        nfts.push(i)
        i = i+1
    }
    return nfts
}

async function saleNft(type) {
    const nfts = listNft()
    const nftSale: any = nfts.map((item) => {
        return {
            nftId: item,
            price: 1.9,
            status: 'ON_SALE',
            symbol: 'AVAX'
        }
    })
    console.log(nfts)
    await NftSales.insert(nftSale)
    await lockNft(nfts, type)
    console.log('done sale')
}

async function lockNft(ids, type) {
    const nfts = await NftAttributes.find({where: {nftId: In(ids), nftType: type}})
    await Promise.all(
        nfts.map((item) => {
            Nfts.update({id: item.nftId}, {isLock: 1})
        })
    )
}

async function saleItem(type, itemType) {
    const nfts: any = await NftAttributes.find(
        {
            select: ['nftId'],
            where: {level: 1, itemType},
            take: 100
        })

    const nftSale = nfts.map((item) => {
        return {
            nftId: item.nftId,
            price: 0.1,
            status: 'ON_SALE',
            symbol: 'AVAX'
        }
    })

    const nftIds = []

    await nfts.map((item) => {
        nftIds.push(item.nftId)
    })

    await NftSales.insert(nftSale)
    await lockNft(nftIds, type)
}

async function saleJewel(type, jewelType) {
    const nfts: any = await NftAttributes.find(
        {
            select: ['nftId'],
            where: {level: 1, jewelType},
            take: 80
        })

    const nftSale = nfts.map((item) => {
        return {
            nftId: item.nftId,
            price: 0.2,
            status: 'ON_SALE',
            symbol: 'AVAX'
        }
    })

    const nftIds = []

    await nfts.map((item) => {
        nftIds.push(item.nftId)
    })
    await NftSales.insert(nftSale)
    await lockNft(nftIds, type)
}

(async () => {
    await connectDB();
    await saleItem('item', 'red')
    await saleItem('item', 'blue')
    await saleItem('item', 'white')
    await saleItem('item', 'purple')
    await saleJewel('jewel', 'ruby')
    await saleJewel('jewel', 'sapphire')
    await saleJewel('jewel', 'emerald')
    await saleJewel('jewel', 'diamond')
    await saleJewel('jewel', 'amethyst')
    await saleNft('bed')
    console.log('sale success')
})()