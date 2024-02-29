require('dotenv').config()
import {getNFTAdminPrv, NFT_CONTRACT, NFT_TYPE_SUPPORT} from "../common/Utils";
import {ERC721} from '../constants/abi';
import {NftAttributes} from "../entities/NftAttributes.entity";

const Web3 = require("web3");
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.PROVIDER)
);
const addressNull = process.env.NULL_ADDRESS;
export default class NftService {
    private static instance: NftService

    public static getInstance(): NftService {
        if (!NftService.instance) {
            NftService.instance = new NftService();
        }

        return NftService.instance;
    }

    async getNftOffChain(nftType) {
        const [nftNotMint, count] = await NftAttributes.findAndCount({
            where: {
                isMint: 0,
                nftType
            },
            take: 100
        })
        return {nftNotMint, count}
    }

    async updateNftOnChain(nftType) {
        const nftOff = await this.getNftOffChain(nftType)
        const mintNft = await this.handleMintNft(nftOff.count, nftType)
        if (!mintNft) return
        if (mintNft.status) {
            const nfts = nftOff.nftNotMint
            await Promise.all(nfts.map((item) => {
                NftAttributes.update({tokenId: item.tokenId, nftType}, {isMint: 1})
            }))
        }
    }

    async handleMintNft(number, nftType) {
        const contract = NFT_CONTRACT[nftType]
        console.log('mint collection:', contract);
        const admin = process.env.OWNER_NFT_WALLET
        const nft = new web3.eth.Contract(ERC721, contract);
        const nftPrvk = await getNFTAdminPrv()
        if (!nftPrvk) return
        web3.eth.accounts.wallet.add(nftPrvk);
        number = await (await this.getNftOffChain(nftType)).count
        console.log("number: ", number);
        
        if (!number) return
        const estimaseGas = await nft.methods
            .batchMint(admin, number)
            .estimateGas({from: admin});

        const minNft = await nft.methods.batchMint(admin, number).send({
            from: admin,
            gas: estimaseGas,
        });

        console.log('===============minNft===========:', minNft);
        return minNft
    }

    async mintNft() {
        for (let i = 0; i < NFT_TYPE_SUPPORT.length; i++) {
            await this.updateNftOnChain(NFT_TYPE_SUPPORT[i])
        }
    }

    async handleEventMintNft(event: any, nftType: string) {
        const { from, to, tokenId } = event['returnValues'];
        if (addressNull.toLocaleLowerCase() == from.toLocaleLowerCase()) {
            const nftAttri = await NftAttributes.findOne({
                tokenId: tokenId,
                nftType: nftType
            })
            if (!nftAttri) return;
            nftAttri.owner = to;
            nftAttri.isMint = 1;
            await nftAttri.save();
        }
    }
}
