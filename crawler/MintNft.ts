import { Column } from "typeorm";

import { NFT_LEVEL_UP_STATUS } from "./constants/enum";

const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const fs = require("fs");
const web3 = new Web3(
    new Web3.providers.HttpProvider("https://api.avax-test.network/ext/bc/C/rpc")
);

import { getRandomWithPercent } from "../src/common/LuckyBox";
import { sleep } from "../src/common/Web3";
import {
    ATTRIBUTE_EFFECT,
    BED_TYPE,
    BED_TYPE_IMG_PERCENT,
    BED_TYPE_IMG_PERCENT_GACHA,
    BED_TYPE_PERCENT,
    BED_UNCOMMON_HIGHEST_QUALITY_PERCENT,
    CONTENT_EFFECT,
    GET_EFFECT_BY_LEVEL,
    GET_EFFECT_ITEM_BY_LEVEL,
    IMG_BED_BOX,
    ITEMS_TYPE,
    JEWELS_LEVEL_PERCENT,
    JEWELS_TYPE,
    JEWELS_TYPE_PERCENT,
    PERCENT_RANDOM_QUALITY_BED
} from "./constants/attributes";
import { CATEGORY_TYPE } from "./constants/enum";
import { connectDB } from "./database";
import { Nfts } from "./entities/Nft.entity";
import { NftAttributes } from "./entities/NftAttributes.entity";
import { NftLevelUp } from "./entities/NftLevelUp.entity";
import { NftSales } from "./entities/NftSale.entity";
// abi
const ABI_NFT = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINTER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentTokenId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getRoleMember",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleMemberCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_count",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_start",
                "type": "uint256"
            }
        ],
        "name": "getTokensOfOwner",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_tokenURI",
                "type": "string"
            }
        ],
        "name": "mintTo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

//address
const BED_NFT = "0xe7FbCB18BE9D93a83407f6BE7fD3E6FF901f2758";
const JEWEL_NFT = "0xa5B24dE54046a751c793Aa034802AdF7017e9712"
const ITEM_NFT = "0xFa2d04D317B16b094886e99A46ae22b97944ea8b"

const pkey = "d8d07eb0669bce2965c3bec05fc5d3c7ab998bdc7acd69cc6690d78640cf1439"; // Private Key
const addressWallet = "0x1BaB8030249382A887F967FcAa7FE0be7B390728"; // Public key 0x1BaB8030249382A887F967FcAa7FE0be7B390728

const MAX_RANGE_IMG_BED = 100000;

async function insertNft(categoryId) {
    const nft = new Nfts()
    nft.categoryId = categoryId;
    nft.isLock = 1
    return await nft.save()
}

async function createNftJson(id, categoryId) {
    return {
        id,
        categoryId,
        isLock: 0
    }
}

export async function createNftAttributeJson(categoryId, nftId, type: string, user, contract, level) {
    let efficiency = 1, luck = 1, bonus = 1, special = 1, resilience = 1;
    let image, nftName, tokenId, name;
    let nftType = null, itemType = null, jewelType = null, classNft = null, quality = null, effect = null, jewelCorrection = null
    if (categoryId == 1) {
        const nftAttributesMax = await NftAttributes.findOne({
            where: {
                nftType: 'bed'
            },
            order: { tokenId: "DESC" }
        })
        tokenId = nftAttributesMax && nftAttributesMax.tokenId ? Number(nftAttributesMax.tokenId) + 1 : 1;
        const numberImg = await Math.floor(Math.random() * MAX_RANGE_IMG_BED);
        const typeImg = await getRandomWithPercent(BED_TYPE_IMG_PERCENT);
        const pathImg = String(numberImg).padStart(5, "0");
        const pathName = String(tokenId).padStart(5, "0");
        image = `${typeImg}/${pathImg}.png`;
        nftName = `Beds #${pathName}`;
        name = `G${pathName}`;
        nftType = "bed";
        classNft = type;
        quality = await Math.floor(Math.random() * 2) == 0 ? "common" : "uncommon";
        const percentTypeBed = PERCENT_RANDOM_QUALITY_BED[quality];
        efficiency = await getRandomWithPercent(percentTypeBed);
        luck = await getRandomWithPercent(percentTypeBed);
        bonus = await getRandomWithPercent(percentTypeBed);
        special = await getRandomWithPercent(percentTypeBed);
        resilience = await getRandomWithPercent(percentTypeBed);
    } else if (categoryId == 2) {
        const nftAttributesMax = await NftAttributes.findOne({
            where: {
                nftType: 'jewel'
            },
            order: { tokenId: "DESC" }
        })
        jewelType = type;
        tokenId = nftAttributesMax && nftAttributesMax.tokenId ? Number(nftAttributesMax.tokenId) + 1 : 1;
        image = `${jewelType}/${level}.png`;
        nftName = `Jewels #${tokenId}`;
        name = `G${tokenId}`;
        nftType = "jewel";
        type = ATTRIBUTE_EFFECT[jewelType];
        effect = CONTENT_EFFECT[jewelType];
        jewelCorrection = await GET_EFFECT_BY_LEVEL(level);
    }
    else if (categoryId == 3) {
        const nftAttributesMax = await NftAttributes.findOne({
            where: {
                nftType: 'item'
            },
            order: { tokenId: "DESC" }
        })
        itemType = type;
        tokenId = nftAttributesMax && nftAttributesMax.tokenId ? Number(nftAttributesMax.tokenId) + 1 : 1;
        image = `${itemType}/${level}.png`;
        nftName = `Items #${tokenId}`;
        name = `${tokenId}`;
        nftType = "item";
        type = ATTRIBUTE_EFFECT[itemType];
        effect = CONTENT_EFFECT[itemType];
        jewelCorrection = await GET_EFFECT_ITEM_BY_LEVEL(level);
    }

    return {
        image,
        nftName,
        name,
        nftId,
        contractAddress: contract,
        owner: user,
        type: categoryId == 1 ? "bed" : type,
        nftType: nftType,
        itemType: itemType,
        jewelType: jewelType,
        classNft: classNft,
        quality: quality,
        effect: effect,
        time: 1,
        level: level,
        bedMint: 1,
        efficiency: efficiency,
        luck: luck,
        bonus: bonus,
        special: special,
        resilience: resilience,
        tokenId: tokenId,
        correction: jewelCorrection.toString()
    }
}

async function createPushNftSale(nftId) {
    const priceRandom = (Math.floor(Math.random() * (9 - 0.01) + 10) / 10000)
    return {
        nftId,
        price: priceRandom.toString(),
        status: 'ON_SALE',
        symbol: 'AVAX'
    }
}

async function createPushNftLevelUp(bedId) {
    //khi mint để mặc định là bed level 0 nên levelUpTime = 120
    return {
        bedId,
        levelUpTime: 60,
        status: NFT_LEVEL_UP_STATUS.PENDING
    }
}

async function mintNft(contract) {
    const NFT = new web3.eth.Contract(ABI_NFT, contract);
    web3.eth.accounts.wallet.add(pkey);
    const uri = "https://dev.sleefi.com/nft/bed/";
    let i = 2234;
    while (i <= 10000) {
        try {
            const estimaseGas = await NFT.methods
                .mintTo(addressWallet, uri + i)
                .estimateGas({ from: addressWallet });
            console.log(i, estimaseGas);
            // Gọi hàm write
            await NFT.methods.mintTo(addressWallet, uri + i).send({
                from: addressWallet,
                gas: estimaseGas,
            });
            i++;
        } catch (error) {
            console.log(error);
        }
    }
}

export const handleMintNft = async (type, user, categoryId, contract, isSale, level) => {
    try {

        const nft = await insertNft(categoryId);
        const nftAttributeJson = await createNftAttributeJson(categoryId, nft.id, type, user.toLowerCase(), contract, level);
        if (isSale) {
            const nftSaleJson = await createPushNftSale(nft.id)
            await NftSales.insert(nftSaleJson)
        }
        await NftAttributes.insert(nftAttributeJson)
        const nftLevelUp = await createPushNftLevelUp(nft.id)
        await NftLevelUp.insert(nftLevelUp)
    } catch (e) {
        console.log(e)
    }
}

async function mintBedNftGenesis(numberMint, numberMintUncommon, user: string, contract) {
    try {
        // fs.appendFileSync(
        //     `mintBedNft${numberMint}.csv`,
        //     "image,nftName,tokenId,contractAddress,owner,type,classNft,quality,time,level,bedMint,efficiency,luck,bonus,special,resilience\n",
        //     function (err) {
        //         console.log(err)
        //     }
        //   );
        const nft = await randomBedGenesis(Number(numberMint), Number(numberMintUncommon), contract, user.toLowerCase());
        await NftLevelUp.insert(nft.nftLevelUp)
        await NftAttributes.insert(nft.nftAttributeJson);
        await Nfts.insert(nft.nftJson);
        await NftSales.insert(nft.nftSaleJson)
    } catch (e) {
        console.log(e)
    }
}

async function randomBedGenesis(number: number, numberUncommon: number, collection: string, user: string) {
    const nftAttributesMax = await NftAttributes.findOne({
        where: {
            nftType: 'bed'
        },
        order: { tokenId: "DESC" }
    })
    const nftsMax = await Nfts.findOne({
        order: { id: "DESC" }
    })
    const prefixTokenId = nftAttributesMax && nftAttributesMax.tokenId ? nftAttributesMax.tokenId : 0;
    const prefixNumber = nftsMax && nftsMax.id ? nftsMax.id : 0;
    const ressult = {
        nftJson: [],
        nftAttributeJson: [],
        nftSaleJson: [],
        nftLevelUp: []
    };
    const numberCommon = number - numberUncommon;
    const rangeRandom = await Math.floor(numberCommon / numberUncommon);
    let countUncommon = 0;
    let countUncommonHighest = 0;

    for (let i = 1; i <= number; i++) {
        const tokenId = prefixTokenId + i;
        const nftJson = await createNftJson(prefixNumber + i, 1);
        const nftSaleJson = await createPushNftSale(tokenId)
        const nftLevelUp = await createPushNftLevelUp(tokenId)
        ressult.nftJson.push(nftJson);
        ressult.nftSaleJson.push(nftSaleJson);
        ressult.nftLevelUp.push(nftLevelUp);
        const randomImg = await Math.floor(Math.random() * MAX_RANGE_IMG_BED);
        const pathImg = String(randomImg).padStart(5, "0");
        let quality = "common";
        let checkHishest = false;
        const randomQuality = await Math.floor(Math.random() * rangeRandom);
        if (countUncommon < numberUncommon) { // check random mint uncommon
            if (randomQuality == 0) {
                if (tokenId < 614 && countUncommon == (numberUncommon - 1)) { // check already minted out of uncommon
                    // nothing
                } else {
                    countUncommon++;
                    quality = "uncommon";
                }
            } else {
                if (number - i < numberUncommon - countUncommon) {
                    countUncommon++;
                    quality = "uncommon";
                }
            }
        }
        if (tokenId == 614) {
            countUncommon++;
            ressult.nftAttributeJson.push({
                image: `pod/${pathImg}.png`,
                nftName: `Beds #G00614`,
                name: `G00614`,
                nftId: tokenId,
                tokenId: Number(tokenId),
                contractAddress: collection,
                owner: user,
                type: "bed",
                nftType: "bed",
                classNft: "flexible",
                quality: 'uncommon',
                time: 1,
                level: 0,
                bedMint: 0,
                efficiency: 30,
                luck: 30,
                bonus: 30,
                special: 30,
                resilience: 30,
                isMint: 1
            })
            const dataCsv =
                'pod/00614.png' +
                ',' +
                `Beds #G00614` +
                ',' +
                String(tokenId) +
                ',' +
                collection +
                ',' +
                user +
                ',' +
                "bed" +
                ',' +
                'flexible' +
                ',' +
                'uncommon' +
                ',' +
                '1,0,0,30,30,30,30,30';
            // fs.appendFileSync(
            //     "mintBedNft6k.csv",
            //     `${dataCsv}\n`,
            //     function (err) {
            //         console.log(err)
            //     }
            //   );
            continue;
        }
        let qualityPercent = PERCENT_RANDOM_QUALITY_BED[quality];
        if (quality == "uncommon") {
            if (tokenId <= 6000 && countUncommonHighest < 99) {
                const isHighest = await Math.floor(Math.random() * 6);
                if (isHighest == 0) {
                    countUncommonHighest++;
                    checkHishest = true;
                    qualityPercent = BED_UNCOMMON_HIGHEST_QUALITY_PERCENT;
                } else {
                    if (99 - countUncommonHighest == numberUncommon - countUncommon) {
                        countUncommonHighest++;
                        checkHishest = true;
                        qualityPercent = BED_UNCOMMON_HIGHEST_QUALITY_PERCENT;
                    }
                }
            }
        }
        const efficiency = await getRandomWithPercent(qualityPercent);
        const luck = await getRandomWithPercent(qualityPercent);
        const bonus = await getRandomWithPercent(qualityPercent);
        const special = await getRandomWithPercent(qualityPercent);
        const resilience = await getRandomWithPercent(qualityPercent);
        const bedType = checkHishest ? "flexible" : await getRandomWithPercent(BED_TYPE_PERCENT);
        const pathName = String(tokenId).padStart(5, "0");
        ressult.nftAttributeJson.push({
            image: `pod/${pathImg}.png`,
            nftName: `Beds #G${pathName}`,
            name: `G${pathName}`,
            nftId: tokenId,
            tokenId: Number(tokenId),
            contractAddress: collection,
            owner: user,
            type: "bed",
            nftType: "bed",
            classNft: bedType,
            quality: quality,
            time: 1,
            level: 0,
            bedMint: 0,
            efficiency: efficiency,
            luck: luck,
            bonus: bonus,
            special: special,
            resilience: resilience,
            isMint: 1
        })
        const dataCsv =
            `pod/${pathImg}.png` +
            ',' +
            `Beds #G${pathName}` +
            ',' +
            String(tokenId) +
            ',' +
            collection +
            ',' +
            user +
            ',' +
            "bed" +
            ',' +
            bedType +
            ',' +
            quality +
            ',' +
            '1,0,0,' +
            String(efficiency) +
            ',' +
            String(luck) +
            ',' +
            String(bonus) +
            ',' +
            String(special) +
            ',' +
            String(resilience);
        // fs.appendFileSync(
        //     "mintBedNft6k.csv",
        //     `${dataCsv}\n`,
        //     function (err) {
        //         console.log(err)
        //     }
        //   );
    }

    return ressult;
}

async function mintJewelNftGenesis(numberMint, user: string, contract) {
    try {
        if (Number(numberMint) % 5 == 0) {
            // fs.appendFileSync(
            //     "mintJewelNft.csv",
            //     "image,nftName,tokenId,contractAddress,owner,type,level\n",
            //     function (err) {
            //         console.log(err)
            //     }
            //   );
            const nft = await randomJewelGenesis(Number(numberMint), contract, user.toLowerCase());
            await NftAttributes.insert(nft.nftAttributeJson);
            await Nfts.insert(nft.nftJson);
            await NftSales.insert(nft.nftSaleJson)
        }
    } catch (e) {
        console.log(e)
    }
}

async function batchMintItemNft(numberMint, user: string, contract) {
    try {
        // fs.appendFileSync(
        //     "mintItemNft.csv",
        //     "image,nftName,tokenId,contractAddress,owner,type,level\n",
        //     function (err) {
        //         console.log(err)
        //     }
        //   );
        if (Number(numberMint) % 20 == 0) {
            const nftAttributesMax = await NftAttributes.findOne({
                where: {
                    nftType: 'item'
                },
                order: { tokenId: "DESC" }
            })
            const nft = await randomItemGenesis(Number(numberMint), contract, user.toLowerCase());
            await NftAttributes.insert(nft.nftAttributeJson);
            await Nfts.insert(nft.nftJson);
            await NftSales.insert(nft.nftSaleJson)
        }
    } catch (e) {
        console.log(e)
    }
}

async function randomJewelGenesis(number: number, collection: string, user: string) {
    const nftAttributesMax = await NftAttributes.findOne({
        where: {
            nftType: 'jewel'
        },
        order: { tokenId: "DESC" }
    })
    const nftsMax = await Nfts.findOne({
        order: { id: "DESC" }
    })
    const prefixTokenId = nftAttributesMax && nftAttributesMax.tokenId ? nftAttributesMax.tokenId : 0;
    const prefixNumber = nftsMax && nftsMax.id ? nftsMax.id : 0;
    const ressult = {
        nftJson: [],
        nftAttributeJson: [],
        nftSaleJson: []
    };
    const numberMintType = number / 5;
    let cRuby = 0;
    let cSapphire = 0;
    let cEmerald = 0;
    let cDiamond = 0;
    let cAmethyst = 0;
    for (let i = 1; i <= number; i++) {
        const tokenId = prefixTokenId + i;
        const nftId = prefixNumber + i;
        const nftJson = await createNftJson(nftId, 2);
        const nftSaleJson = await createPushNftSale(nftId)
        ressult.nftJson.push(nftJson);
        ressult.nftSaleJson.push(nftSaleJson);

        const level = await getRandomWithPercent(JEWELS_LEVEL_PERCENT);
        let jewelType = JEWELS_TYPE.Ruby;
        let loop = true;
        while (loop) {
            jewelType = await getRandomWithPercent(JEWELS_TYPE_PERCENT);
            switch (jewelType) {
                case JEWELS_TYPE.Ruby:
                    if (cRuby < numberMintType) {
                        cRuby++;
                        loop = false;
                    }
                    break;
                case JEWELS_TYPE.Sapphire:
                    if (cSapphire < numberMintType) {
                        cSapphire++;
                        loop = false;
                    }
                    break;
                case JEWELS_TYPE.Emerald:
                    if (cEmerald < numberMintType) {
                        cEmerald++;
                        loop = false;
                    }
                    break;
                case JEWELS_TYPE.Diamond:
                    if (cDiamond < numberMintType) {
                        cDiamond++;
                        loop = false;
                    }
                    break;
                case JEWELS_TYPE.Amethyst:
                    if (cAmethyst < numberMintType) {
                        cAmethyst++;
                        loop = false;
                    }
                    break;
            }
        }

        const pathName = String(tokenId).padStart(5, "0");

        ressult.nftAttributeJson.push({
            image: `${jewelType}/${level}.png`,
            nftName: `Jewels #G${pathName}`,
            name: `G${pathName}`,
            nftId: nftId,
            tokenId: Number(tokenId),
            contractAddress: collection,
            owner: user,
            type: ATTRIBUTE_EFFECT[jewelType],
            nftType: "jewel",
            jewelType: jewelType,
            classNft: "",
            quality: "",
            effect: CONTENT_EFFECT[jewelType],
            time: 1,
            level: level,
            bedMint: 1,
            efficiency: 1,
            luck: 1,
            bonus: 1,
            special: 1,
            resilience: 1,
            isMint: 1,
            correction: await GET_EFFECT_BY_LEVEL(level)
        })
        const dataCsv =
            `${jewelType}/${level}.png` +
            ',' +
            `Jewels #G${tokenId}` +
            ',' +
            String(tokenId) +
            ',' +
            collection +
            ',' +
            user +
            ',' +
            `${ATTRIBUTE_EFFECT[jewelType]}` +
            ',' +
            String(level);
        // fs.appendFileSync(
        //     "mintJewelNft.csv",
        //     `${dataCsv}\n`,
        //     function (err) {
        //         console.log(err)
        //     }
        //   );
    }
    return ressult;
}

async function randomItemGenesis(number: number, collection: string, user: string) {
    const nftAttributesMax = await NftAttributes.findOne({
        where: {
            nftType: 'item'
        },
        order: { tokenId: "DESC" }
    })
    const nftsMax = await Nfts.findOne({
        order: { id: "DESC" }
    })
    const prefixTokenId = nftAttributesMax && nftAttributesMax.tokenId ? nftAttributesMax.tokenId : 0;
    const prefixNumber = nftsMax && nftsMax.id ? nftsMax.id : 0;
    const ressult = {
        nftJson: [],
        nftAttributeJson: [],
        nftSaleJson: []
    };
    const ITEM_TYPE = ["red", "blue", "white", "purple"];
    const ITEM_LEVEL = [1, 2, 3, 4, 5];

    const numberMintType = number / 4;
    const numberMintLevel = numberMintType / 5;

    let typeKey = 0;
    let levelKey = 0;
    let countType = 0;
    let countLevel = 0;
    for (let i = 1; i <= number; i++) {
        if (countType == numberMintType) {
            typeKey++;
            countType = 0;
        }
        if (countLevel == numberMintLevel) {
            levelKey++;
            if (levelKey == 5) {
                levelKey = 0;
            }
            countLevel = 0;
        }
        const tokenId = prefixTokenId + i;
        const nftId = prefixNumber + i;
        const nftJson = await createNftJson(nftId, 3);
        const nftSaleJson = await createPushNftSale(nftId)
        ressult.nftJson.push(nftJson);
        ressult.nftSaleJson.push(nftSaleJson);

        const level = ITEM_LEVEL[levelKey];
        const itemType = ITEM_TYPE[typeKey];
        const jewelCorrection = await GET_EFFECT_BY_LEVEL(level);
        ressult.nftAttributeJson.push({
            image: `${itemType}/${level}.png`,
            nftName: `Items #${tokenId}`,
            name: `${tokenId}`,
            nftId: nftId,
            tokenId: Number(tokenId),
            contractAddress: collection,
            owner: user,
            type: ATTRIBUTE_EFFECT[itemType],
            nftType: "item",
            itemType: itemType,
            classNft: "",
            quality: "",
            effect: CONTENT_EFFECT[itemType],
            time: 1,
            level: level,
            bedMint: 1,
            efficiency: 1,
            luck: 1,
            bonus: 1,
            special: 1,
            resilience: 1,
            isMint: 1,
            correction: jewelCorrection.toString()
        })
        countType++;
        countLevel++;

        const dataCsv =
            `${itemType}/${level}.png` +
            ',' +
            `Items #${tokenId}` +
            ',' +
            String(tokenId) +
            ',' +
            collection +
            ',' +
            user +
            ',' +
            `${ATTRIBUTE_EFFECT[itemType]}` +
            ',' +
            String(level);
        // fs.appendFileSync(
        //     "mintItemNft.csv",
        //     `${dataCsv}\n`,
        //     function (err) {
        //         console.log(err)
        //     }
        //   );
    }
    return ressult;
}

export const genNftAttributeJson = async (categoryId, nftId, type: string, user, contract, tokenId, levelItem = 0, qualityBed = '') => {
    let efficiency = 1, luck = 1, bonus = 1, special = 1, resilience = 1;
    let image, nftName, jewelCorrection, name;
    let nftType = null, itemType = null, jewelType = null, classNft = null, quality = null, effect = null
    const pathName = String(tokenId).padStart(5, "0");
    if (categoryId == 1) {
        const numberImg = await Math.floor(Math.random() * MAX_RANGE_IMG_BED);
        const typeImg = await getRandomWithPercent(BED_TYPE_IMG_PERCENT);
        const pathImg = String(numberImg).padStart(5, "0");
        image = `${typeImg}/${pathImg}.png`;
        nftName = `Beds #${pathName}`;
        name = `${pathName}`;
        nftType = "bed";
        classNft = type;
        quality = qualityBed ? qualityBed : await Math.floor(Math.random() * 2) == 0 ? "common" : "uncommon";
        const percentTypeBed = PERCENT_RANDOM_QUALITY_BED[quality];
        efficiency = await getRandomWithPercent(percentTypeBed);
        luck = await getRandomWithPercent(percentTypeBed);
        bonus = await getRandomWithPercent(percentTypeBed);
        special = await getRandomWithPercent(percentTypeBed);
        resilience = await getRandomWithPercent(percentTypeBed);
    } else if (categoryId == 2) {
        jewelType = type;
        image = `${jewelType}/${levelItem}.png`;
        nftName = `Jewels #${pathName}`;
        name = `${pathName}`;
        nftType = "jewel";
        effect = CONTENT_EFFECT[type];
        type = ATTRIBUTE_EFFECT[type];
        jewelCorrection = await GET_EFFECT_BY_LEVEL(levelItem);
    }
    else if (categoryId == 3) {
        itemType = type;
        image = `${itemType}/${levelItem}.png`;
        nftName = `Items #${pathName}`;
        name = `${pathName}`;
        nftType = "item";
        effect = CONTENT_EFFECT[itemType];
        type = ATTRIBUTE_EFFECT[itemType];
        jewelCorrection = await GET_EFFECT_ITEM_BY_LEVEL(levelItem);
    }
    else if (categoryId == 4) {
        const numberImg = await Math.floor(Math.random() * 5) + 1;
        const qualityRandom = await Math.floor(Math.random() * 2) == 0 ? "common" : "uncommon"
        type = 'bedbox';
        nftType = "bedbox";
        nftName = `Bedbox #${pathName}`;
        name = `${pathName}`;
        quality = qualityRandom;
        image = `/${IMG_BED_BOX[qualityRandom]}.png`;
    }

    return {
        image,
        nftName,
        name,
        nftId,
        contractAddress: contract,
        owner: user,
        type: categoryId == 1 ? "bed" : type,
        nftType: nftType,
        itemType: itemType,
        jewelType: jewelType,
        classNft: classNft,
        quality: quality,
        effect: effect,
        time: 0,
        level: levelItem,
        bedMint: 0,
        efficiency: efficiency,
        luck: luck,
        bonus: bonus,
        special: special,
        resilience: resilience,
        tokenId: tokenId,
        correction: jewelCorrection
    }
}

(async () => {
    await connectDB();

    await mintBedNftGenesis(6000, 600, "0x1bab8030249382a887f967fcaa7fe0be7b390728", BED_NFT);
    await mintBedNftGenesis(3000, 300, "0x1bab8030249382a887f967fcaa7fe0be7b390728", BED_NFT)
    await mintBedNftGenesis(1000, 100, "0x1bab8030249382a887f967fcaa7fe0be7b390728", BED_NFT)

    await mintJewelNftGenesis(10000, "0x1bab8030249382a887f967fcaa7fe0be7b390728", JEWEL_NFT)

    await batchMintItemNft(10000, "0x1bab8030249382a887f967fcaa7fe0be7b390728", ITEM_NFT)

    // number, type, user, categoryId, contract, isSale
    // mint BED
    // await handleMintNft(BED_TYPE.Short, '0x1BaB8030249382A887F967FcAa7FE0be7B390728', CATEGORY_TYPE.BED, BED_NFT, true, 0)
    //
    // // mint JEWEL
    // await handleMintNft(JEWELS_TYPE.Ruby, '0x1BaB8030249382A887F967FcAa7FE0be7B390728', CATEGORY_TYPE.JEWEL, JEWEL_NFT, true, 1)
    //
    // // mint ITEM
    // await handleMintNft(ITEMS_TYPE.White, '0x1BaB8030249382A887F967FcAa7FE0be7B390728', CATEGORY_TYPE.ITEM, ITEM_NFT, true, 1)

    // await mintNft(BED_NFT);
    console.log('end');
})();
