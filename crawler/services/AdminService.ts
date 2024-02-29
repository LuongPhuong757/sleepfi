import BigNumber from 'bignumber.js';
BigNumber.config({ DECIMAL_PLACES: 8 })
import { ethers } from 'ethers';

import {convertEtherToWei} from "../../src/common/Web3";
import {WITHDRAW_STATUS} from "../../src/withdraw/constants";
import {ERC20} from '../constants/abi'
import { SYMBOL_TOKEN } from '../constants/enum';
import { TRANSACTION_TYPE } from "../constants/enum";
import {ProfitWallet} from "../entities/ProfitWallet.entity";
import { TxHistories } from "../entities/TxHistories.entity";
require('dotenv').config()
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.PROVIDER)
);
const MINIMUMAVAX = 5;
const MINIMUMSLGT = 2000;
const MINIMUMSLFT = 2000;

export default class AdminService {

    private adminWallet
    private profitWallet
    private privateKey
    private static instance: AdminService
    private flagWithdraw

    constructor() {
        this.adminWallet = process.env.OWNER_NFT_WALLET;
        this.profitWallet = process.env.PROFIT_MAIN_WALLET;
        this.privateKey = process.env.OWNER_NFT_PVK;
        this.flagWithdraw = false;
    }

    public static getInstance(): AdminService {
        if (!AdminService.instance) {
          AdminService.instance = new AdminService();
        }

        return AdminService.instance;
    }

    async handleAdminWithdraw () {
      console.log("this.flagWithdraw: ", this.flagWithdraw);
      if (this.flagWithdraw) return;
      console.log('====================== run admin withdraw Avax ========================');
      this.flagWithdraw = true;
      try {
        await this.handleAdminWithdrawAvax();
        await this.handleAdminWithdrawSLFT();
        await this.handleAdminWithdrawSLGT();
        this.flagWithdraw = false;
      } catch (error) {
        this.flagWithdraw = false;
        throw error;
      }
      this.flagWithdraw = false;
    }

    async handleAdminWithdrawAvax() {
      console.log('====================== run admin withdraw AVAX ========================');
      try {
        const avaxProfit = await this.findProfitWallet(SYMBOL_TOKEN.AVAX);
        const avaxAmount = avaxProfit.amount;
        if (new BigNumber(avaxAmount).isGreaterThanOrEqualTo(MINIMUMAVAX)) {
          web3.eth.accounts.wallet.add(this.privateKey);
          const res = await web3.eth.sendTransaction({
            from: this.adminWallet,
            gas: "21000",
            to: this.profitWallet,
            value: convertEtherToWei(web3, avaxAmount),
            data: ""
          });
          if (res && res.status) {
            await this.handlUpdateAmountProfitWallet(SYMBOL_TOKEN.AVAX, avaxAmount);
            await this.insertTxHistories(res.transactionHash, process.env.AVAX_ADDRESS, avaxAmount, SYMBOL_TOKEN.AVAX);
          }
        }
      } catch (error) {
        throw error;
      }
    }

    async handleAdminWithdrawSLFT() {
      console.log('====================== run admin withdraw SLFT ========================');
      try {
        const slftProfit = await this.findProfitWallet(SYMBOL_TOKEN.SLFT);
        const slftAmount = slftProfit.amount;
        if (new BigNumber(slftAmount).isGreaterThanOrEqualTo(MINIMUMSLFT)) {
          const slftContract = new web3.eth.Contract(ERC20, process.env.SLFT_ADDRESS);
          const estimaseGas = await slftContract.methods
            .transfer(this.profitWallet, convertEtherToWei(web3, slftAmount))
            .estimateGas({ from: this.adminWallet });
          
          web3.eth.accounts.wallet.add(this.privateKey);
          const res = await slftContract.methods
            .transfer(this.profitWallet, convertEtherToWei(web3, slftAmount))
            .send({ from: this.adminWallet, gas: estimaseGas });
         
          if (res && res.status) {
            await this.handlUpdateAmountProfitWallet(SYMBOL_TOKEN.SLFT, slftAmount);
            await this.insertTxHistories(res.transactionHash, process.env.SLFT_ADDRESS, slftAmount, SYMBOL_TOKEN.SLFT);
          }
        }
      } catch (error) {
        throw error;
      }
    }

    async handleAdminWithdrawSLGT() {
      console.log('====================== run admin withdraw SLGT ========================');
      try {
        const slgtProfit = await this.findProfitWallet(SYMBOL_TOKEN.SLGT);
        const slgtAmount = slgtProfit.amount;
        if (new BigNumber(slgtAmount).isGreaterThanOrEqualTo(MINIMUMSLGT)) {
          const slgtContract = new web3.eth.Contract(ERC20, process.env.SLGT_ADDRESS);
          const estimaseGas = await slgtContract.methods
            .transfer(this.profitWallet, convertEtherToWei(web3, slgtAmount))
            .estimateGas({ from: this.adminWallet });
          
          web3.eth.accounts.wallet.add(this.privateKey);
          const res = await slgtContract.methods
            .transfer(this.profitWallet, convertEtherToWei(web3, slgtAmount))
            .send({ from: this.adminWallet, gas: estimaseGas });
          if (res && res.status) {
            await this.handlUpdateAmountProfitWallet(SYMBOL_TOKEN.SLGT, slgtAmount);
            await this.insertTxHistories(res.transactionHash, process.env.SLGT_ADDRESS, slgtAmount, SYMBOL_TOKEN.SLGT);
          }
        }
      } catch (error) {
        throw error;
      }
    }

    private async handlUpdateAmountProfitWallet(symbol, amount) {
      try {
          const profitWallet = await this.findProfitWallet(symbol);
          profitWallet.amount = new BigNumber(profitWallet.amount).minus(amount).toString();
          await profitWallet.save();
      } catch (error) {
        throw error;
      }
    }

    private async findProfitWallet(symbol) {
      return await ProfitWallet.findOne({symbol})
    }

    private async insertTxHistories(tx, token, amount, symbol) {
      const txHistories = new TxHistories();
      txHistories.userId = 1
      txHistories.symbol = symbol
      txHistories.tokenAddress = token
      txHistories.amount = amount
      txHistories.type = TRANSACTION_TYPE.ADMIN_WITHDRAW_TOKEN
      txHistories.tx = tx
      txHistories.status = WITHDRAW_STATUS.SUCCESS
      return await txHistories.save()
    }
}
