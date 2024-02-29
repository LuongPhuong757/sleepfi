import BigNumber from 'bignumber.js';
BigNumber.config({ DECIMAL_PLACES: 8 })
import { ethers } from 'ethers';

import {convertEtherToWei} from "../../src/common/Web3";
import {LOG_WITHDRAW_EVENTS,WITHDRAW_STATUS, WITHDRAW_TYPE} from "../../src/withdraw/constants";
import {getNFTAdminPrv} from "../common/Utils";
import {ERC20, ERC721, MULTISENDER } from '../constants/abi'
import {PAYMENT_USER_STATUS} from "../constants/enum";
import {NftAttributes} from "../entities/NftAttributes.entity";
import {PaymentUserInfo} from "../entities/PayMentUser.entity";
import {SpendingBalances} from "../entities/SpendingBalance.entity";
import {Withdraw} from "../entities/Withdraw.entity";
require('dotenv').config()
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.PROVIDER)
);
const MaxUint256: ethers.BigNumber = (/*#__PURE__*/ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
export default class WithdrawService {

    private adminWallet
    private privateKey
    private multiSenderContract
    private static instance: WithdrawService
    private flagWithdraw
    private flagUpdate
    private flagSendAvax

    constructor() {
        this.adminWallet = process.env.OWNER_NFT_WALLET;
        this.privateKey = getNFTAdminPrv();
        this.multiSenderContract = process.env.MULTISENDER
        this.flagWithdraw = false;
        this.flagUpdate = false;
        this.flagSendAvax = false;
    }

    public static getInstance(): WithdrawService {
        if (!WithdrawService.instance) {
            WithdrawService.instance = new WithdrawService();
        }

        return WithdrawService.instance;
    }

    async handleWithdraw() {
      console.log("this.flagWithdraw: ", this.flagWithdraw);
      
      if (this.flagWithdraw) return;
      if (!this.privateKey) return;
      console.log('====================== run withdraw ========================');
      this.flagWithdraw = true;
      try {
        const arrWithdraw = [];
        const iface = new ethers.utils.Interface(MULTISENDER);
    
        const tokenAvaxEndcodeParams = await this.getEndcodeParamsToken(
          process.env.AVAX_ADDRESS,
          arrWithdraw
        );
        const tokenSLGTEndcodeParams = await this.getEndcodeParamsToken(
          process.env.SLGT_ADDRESS,
          arrWithdraw
        );
        const tokenSLFTEndcodeParams = await this.getEndcodeParamsToken(
          process.env.SLFT_ADDRESS,
          arrWithdraw
        );
        const nftBedEndcodeParams = await this.getEndcodeParamsNft(
          process.env.BED_CONTRACT,
          arrWithdraw
        );
        const nftBedBoxEndcodeParams = await this.getEndcodeParamsNft(
          process.env.BED_BOX_CONTRACT,
          arrWithdraw
        );
        const nftJewelEndcodeParams = await this.getEndcodeParamsNft(
          process.env.JEWEL_CONTRACT,
          arrWithdraw
        );
        const nftItemEndcodeParams = await this.getEndcodeParamsNft(
          process.env.ITEM_CONTRACT,
          arrWithdraw
        );
        try {
          const arrUpdateUpdates = [];
          for (const row of arrWithdraw) {
            arrUpdateUpdates.push(this.updateWithdrawStatusUpdating(row));
          }
          await Promise.all(arrUpdateUpdates);

          const dataEndcodeTokenAvax = tokenAvaxEndcodeParams
          ? iface.encodeFunctionData('multiSenderToken', tokenAvaxEndcodeParams)
          : 0;
          const dataEndcodeTokenSLGT = tokenSLGTEndcodeParams
            ? iface.encodeFunctionData('multiSenderToken', tokenSLGTEndcodeParams)
            : 0;
          const dataEndcodeTokenSLFT = tokenSLFTEndcodeParams
            ? iface.encodeFunctionData('multiSenderToken', tokenSLFTEndcodeParams)
            : 0;
          const dataEndcodeNftBed = nftBedEndcodeParams
            ? iface.encodeFunctionData('multiSenderNFTs', nftBedEndcodeParams)
            : 0;
          const dataEndcodeNftBedBox = nftBedBoxEndcodeParams
            ? iface.encodeFunctionData('multiSenderNFTs', nftBedBoxEndcodeParams)
            : 0;
          const dataEndcodeNftJewel = nftJewelEndcodeParams
            ? iface.encodeFunctionData('multiSenderNFTs', nftJewelEndcodeParams)
            : 0;
          const dataEndcodeNftItem = nftItemEndcodeParams
            ? iface.encodeFunctionData('multiSenderNFTs', nftItemEndcodeParams)
            : 0;
          const arrEncode = [dataEndcodeTokenAvax, dataEndcodeNftBed, dataEndcodeNftBedBox,dataEndcodeNftItem, dataEndcodeTokenSLGT, dataEndcodeTokenSLFT, dataEndcodeNftJewel].filter(item => item !== 0);
          
          if (arrEncode.length > 0) {
            const multiSender = new web3.eth.Contract(MULTISENDER, this.multiSenderContract);
            const swapOptions = {}
            if (tokenAvaxEndcodeParams) {
                swapOptions["value"] = tokenAvaxEndcodeParams[1];
            }
            console.log("arrEncode: ", arrEncode);
            
            swapOptions["from"] = this.adminWallet;
            const estimateGas = await multiSender.methods.multicall(arrEncode).estimateGas(swapOptions);
            
            swapOptions["gas"] = new BigNumber(estimateGas).times(1.3).toFixed(0);
            web3.eth.accounts.wallet.add(this.privateKey);
            const arrUpdatePros = [];
            const resultTransaction = await multiSender.methods
              .multicall(arrEncode)
              .send(swapOptions);
            if (resultTransaction) {
              for (const row of arrWithdraw) {
                arrUpdatePros.push(this.updateWithdrawStatusProcessing(row, resultTransaction.transactionHash));
              }
              await Promise.all(arrUpdatePros);
            }
            this.flagWithdraw = false;
          }
        } catch (error) {
          const arrUpdateUpdates = [];
          for (const row of arrWithdraw) {
            arrUpdateUpdates.push(this.updateWithdrawStatusPending(row));
          }
          await Promise.all(arrUpdateUpdates);
          this.flagWithdraw = false;
          throw error;
        }
      } catch (error) {
        this.flagWithdraw = false;
        throw error;
      }
      this.flagWithdraw = false;
    }

    async handlUpdateWithdraw() {
      if (this.flagUpdate) return;
      console.log('====================== run update withdraw ========================');
      try {
        this.flagUpdate = true;
        const findWithdrawToken = await Withdraw.find({
          where: {
              status: WITHDRAW_STATUS.PROCESSING,
              type: WITHDRAW_TYPE.TOKEN
          }
        })

        const findWithdrawNft = await Withdraw.find({
          where: {
              status: WITHDRAW_STATUS.PROCESSING,
              type: WITHDRAW_TYPE.NFT
          }
        })
        await this.handlUpdateBalanceWithdrawToken(findWithdrawToken);
        await this.handlUpdateOwnerWithdrawNft(findWithdrawNft);
        this.flagUpdate = false;
      } catch (error) {
        console.log("handlUpdateWithdraw error: ", error);
        this.flagUpdate = false;
        throw error;
      }
      this.flagUpdate = false;
    }

    async handlUpdateBalanceWithdrawToken(withdraws: Withdraw[]) {
      try {
          await Promise.all(withdraws.map( async (withdraw) => {
              const spendingBalances = await this.findSpendingBalance(withdraw.userId, withdraw.tokenAddress);
              spendingBalances.amount = new BigNumber(spendingBalances.amount).minus(withdraw.amount).toString();
              await spendingBalances.save();
              withdraw.status = WITHDRAW_STATUS.SUCCESS;
              await withdraw.save();
          }))
      } catch (error) {
        throw error;
      }
    }

    async handlUpdateOwnerWithdrawNft(withdraws: Withdraw[]) {
      try {
        await Promise.all(withdraws.map( async (withdraw) => {
            await this.changeOwnerNft(withdraw.tokenId, withdraw.contractAddress)
            withdraw.status = WITHDRAW_STATUS.SUCCESS;
            await withdraw.save();
        }))
      } catch (error) {
        throw error;
      }
    }

    async findSpendingBalance(userId: number, tokenAddress: string) {
        const spendingBalances = await SpendingBalances.findOne({
            userId, tokenAddress
        })
        return spendingBalances
    }

    async updateWithdrawStatusProcessing(id: number, txHash: string) {
        await Withdraw.update({
            status: WITHDRAW_STATUS.UPDATING,
            id
        }, {status: WITHDRAW_STATUS.PROCESSING, txHash: txHash})
    }

    async updateWithdrawStatusUpdating(id: number) {
      await Withdraw.update({
          status: WITHDRAW_STATUS.PENDING,
          id
      }, {status: WITHDRAW_STATUS.UPDATING})
    }

    async updateWithdrawStatusPending(id: number) {
      await Withdraw.update({
          status: WITHDRAW_STATUS.UPDATING,
          id
      }, {status: WITHDRAW_STATUS.PENDING})
    }

    async updatePaymentStatusSuccess(hashId: string, txHash: string) {
      await PaymentUserInfo.update({
          status: PAYMENT_USER_STATUS.NEW,
          hashId
      }, {status: PAYMENT_USER_STATUS.SUCCESS, tx: txHash})
  }

    async changeOwnerNft(tokenId, contractAddress) {
        await NftAttributes.update({tokenId, contractAddress}, {owner: this.adminWallet})
    }

    async getEndcodeParamsToken(contract: string, arrWithdraw: number[]) {
        let amount = 0;
        const data = [];
        contract = contract.toLowerCase();
        const findWithdrawToken = await Withdraw.find({
            where: {
                status: WITHDRAW_STATUS.PENDING,
                type: WITHDRAW_TYPE.TOKEN,
                tokenAddress: contract
            }
        })
        if (findWithdrawToken && findWithdrawToken.length > 0) {
            for (const e of findWithdrawToken) {
                amount = new BigNumber(amount).plus(e.amount).toNumber();
                data.push({
                    reiciver: e.mainWallet,
                    value: convertEtherToWei(web3, e.amount),
                    id: e.id
                })
                arrWithdraw.push(e.id);
            }
        }
        
        if (amount ===  0 || data.length == 0) return null;
        
        return [
            contract,
            convertEtherToWei(web3, amount.toString()),
            data
        ];
    }

    async getEndcodeParamsNft(contract: string, arrWithdraw: number[]) {
        const data = [];        
        contract = contract.toLowerCase();
        const findWithdrawNft = await Withdraw.find({
            where: {
                status: WITHDRAW_STATUS.PENDING,
                type: WITHDRAW_TYPE.NFT,
                contractAddress: contract
            }
        })
        if (findWithdrawNft && findWithdrawNft.length > 0) {
            for (const e of findWithdrawNft) {
                data.push({
                    reiciver: e.mainWallet,
                    value: e.tokenId,
                    id: e.id
                })
                arrWithdraw.push(e.id);
            }
        }
        if (data.length == 0) return null;
        return [
            contract,
            data
        ];
    }

    async handleApprove(){
      await this.approveToken(process.env.SLGT_ADDRESS);
      await this.approveToken(process.env.SLFT_ADDRESS);
      await this.approveNft(process.env.BED_CONTRACT);
      await this.approveNft(process.env.BED_BOX_CONTRACT);
      await this.approveNft(process.env.JEWEL_CONTRACT);
      await this.approveNft(process.env.ITEM_CONTRACT);
    }

    async approveToken(contract: string) {
      const erc20 = new web3.eth.Contract(ERC20, contract);
      const estimaseGas = await erc20.methods
        .approve(this.multiSenderContract, MaxUint256)
        .estimateGas({ from: this.adminWallet });
      web3.eth.accounts.wallet.add(this.privateKey);
      await erc20.methods
        .approve(this.multiSenderContract, MaxUint256)
        .send({ from: this.adminWallet, gas: estimaseGas });
    }

    async approveNft(contract: string) {
      const erc721 = new web3.eth.Contract(ERC721, contract);
      const estimaseGas = await erc721.methods
        .setApprovalForAll(this.multiSenderContract, true)
        .estimateGas({ from: this.adminWallet });
      await web3.eth.accounts.wallet.add(this.privateKey);
      await erc721.methods
        .setApprovalForAll(this.multiSenderContract, true)
        .send({ from: this.adminWallet, gas: estimaseGas });
    }

    async getPriceAvaxFromCoingecko() {
        const Coingecko = require('coingecko-api')
        const coingeckoApi = new Coingecko()

        const data = await coingeckoApi.simple.price({
            ids: ['avalanche-2'],
            vs_currencies: 'usd',
        });
        return data.data['avalanche-2'].usd
    }

    async getOneUsdToAvax() {
        const avaxUsdPrice = await this.getPriceAvaxFromCoingecko()
        if (!avaxUsdPrice) return 0
        return new BigNumber(1).div(avaxUsdPrice).toNumber()
    }

    async sendAvax() {
      if (this.flagSendAvax) return;
      console.log('====================== run sendAvax ========================');
      this.flagSendAvax = true;
      try {
        const payments = await PaymentUserInfo.find({
          where: {
              status: PAYMENT_USER_STATUS.NEW
          }
        })
        console.log("payments", payments);
        
        if (payments && payments.length > 0) {
          const avax = await this.getOneUsdToAvax();
          const {token, amount, data}= await this.getEndcodeAvax(
            payments,
            avax
          );
          if (amount > 0 && data.length > 0) {
            const multiSender = new web3.eth.Contract(MULTISENDER, this.multiSenderContract);
            const estimateGas = await multiSender.methods.multiSenderToken(token, amount, data).estimateGas({
              value: amount,
              from: this.adminWallet
            });
            web3.eth.accounts.wallet.add(this.privateKey);
            const resultTransaction = await multiSender.methods
              .multiSenderToken(token, amount, data)
              .send({
                value: amount,
                from: this.adminWallet,
                gas: new BigNumber(estimateGas).times(1.3).toFixed(0)
              });
            const updateStatusPayment = [];
            for (const payment of payments) {
              updateStatusPayment.push(this.updatePaymentStatusSuccess(payment.hashId, resultTransaction.transactionHash));
            }
            await Promise.all(updateStatusPayment);
          }
          this.flagSendAvax = false; 
        }
      } catch (error) {
        this.flagSendAvax = false;
        throw error;
      }
      this.flagSendAvax = false;
    }

    async getEndcodeAvax(payments: PaymentUserInfo[], amount: number) {
        const data = [];
        let totalValue = new BigNumber(0).toNumber();
        if (payments && payments.length > 0) {
            for (const e of payments) {
              data.push({
                    reiciver: e.wallet,
                    value: convertEtherToWei(web3, amount.toString()),
                    id: e.userId
                })
                totalValue = new BigNumber(totalValue).plus(amount).toNumber();
            }
        }
        totalValue = convertEtherToWei(web3, totalValue.toString());
        return {
            token: process.env.AVAX_ADDRESS,
            amount: totalValue,
            data: data
        }
    }
}
