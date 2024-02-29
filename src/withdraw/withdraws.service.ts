import { BadRequestException, Injectable } from '@nestjs/common'
import { BigNumber } from 'bignumber.js'
import { BedInformationRepository } from 'src/bed-information/repositories/bed-information.repository'
import { CATEGORY_ID } from 'src/category/constants'
import { estimateGas, estimateGasWithdrawNft } from 'src/common/gasLimit'
import { MESSAGE } from 'src/common/messageError'
import { NftLevelUp } from 'src/databases/entities/nft_level_up.entity'
import { Nfts } from 'src/databases/entities/nfts.entity'
import { Withdraw } from 'src/databases/entities/withdraw.entity'
import { IS_LOCK } from 'src/nft-attributes/constants'
import { NftAttributesRepository } from 'src/nft-attributes/nft-attributes.repository'
import { NFT_LEVEL_UP_STATUS } from 'src/nfts/constants'
import { SpendingBalancesRepository } from 'src/spending_balances/spending_balances.repository'
import { Not } from 'typeorm'

import { abi } from '../common/Utils'
import { NftAttributes } from '../databases/entities/nft_attributes.entity'
import { User } from '../databases/entities/user.entity'
import { NftRepository } from '../nfts/nfts.repository'
import { UserService } from '../user/services/user.service'
import {
  DEFAULT_AMOUNT_WITHDRAW,
  DEFAULT_TOKEN_ID,
  STATUS_GET_WITHDRAW,
  TRANSACTION_TYPE,
  TYPE_GET_GAS,
  TYPE_GET_WITHDRAW,
  WITHDRAW_STATUS,
  WITHDRAW_TYPE
} from './constants'
import { CreateWithdrawDto } from './dto/create-withdraw.dto'
import { CreateWithdrawNftDto } from './dto/create-withdraw-nft.dto'
import { GetEstimateGas } from './dto/get-estimate-gas.dto'
import { GetWithdrawInput } from './dto/get-withdraw.dto'
import { WithdrawRepository } from './withdraw.repository'
import { SpendingBalancesSevice } from 'src/spending_balances/spending_balances.service'

@Injectable()
export class WithdrawSevice {
  constructor(
    private readonly withdrawRepository: WithdrawRepository,
    private readonly spendingBalancesRepository: SpendingBalancesRepository,
    private readonly nftAttributesRepository: NftAttributesRepository,
    private readonly nftRepository: NftRepository,
    private readonly userService: UserService,
    private readonly bedInformationRepository: BedInformationRepository,
    private readonly spendingBalanceService: SpendingBalancesSevice
  ) { }

  async withdrawTokenToMainWallet(
    createWithdrawDto: CreateWithdrawDto,
    user: User
  ) {
    try {
      const { tokenAddress, amount, signedMessage, signer } = createWithdrawDto
      const userLogin = await this.getUserById(user.id)
      await this.userService.verifyWalletAddress(
        userLogin,
        signedMessage,
        signer.toLowerCase()
      )
      const avaxBalance = await this.spendingBalancesRepository.findOne({
        where: {
          userId: user.id,
          tokenAddress: process.env.AVAX_ADDRESS
        }
      })
      if (!avaxBalance) throw new BadRequestException(' AVAX balance is 0')
      const availableBalance = await this.spendingBalancesRepository.findOne({
        where: { userId: user.id, tokenAddress }
      })
      const amountWithdraw = new BigNumber(amount)
      const availableAmountBalances = new BigNumber(
        availableBalance.availableAmount
      )

      if (!amountWithdraw || amountWithdraw.isLessThanOrEqualTo(0)) {
        throw new BadRequestException('amount_input_can_not_be_zero')
      }

      if (availableAmountBalances.isLessThan(amountWithdraw)) {
        throw new BadRequestException(`insufficient_balance`)
      }

      const gas = await estimateGas(
        process.env.AVAX_ADDRESS,
        process.env.ADMIN_MAIN_WALLET.toLowerCase(),
        amountWithdraw.toString(),
        availableBalance.wallet
      )
      const gasLimit = new BigNumber(gas)

      if (gasLimit.isGreaterThan(avaxBalance.availableAmount)) {
        throw new BadRequestException(`not_enough_avax`)
      }
      
      let minusAmount = new BigNumber(avaxBalance.amount);
      let minusAvailableAmount = new BigNumber(avaxBalance.availableAmount);
      let feeAmount, feeAvailableAmount;
      
      if (
        tokenAddress.toLowerCase() == process.env.AVAX_ADDRESS.toLowerCase()
      ) {
        feeAmount = new BigNumber(gasLimit);
        feeAvailableAmount = new BigNumber(gasLimit).plus(amountWithdraw);
        await this.spendingBalanceService.minusSpendingBalanceWithTokenAddress(availableBalance.wallet, process.env.AVAX_ADDRESS, minusAmount.toString(), minusAvailableAmount.toString(), feeAmount.toString(), feeAvailableAmount.toString());
        // await this.spendingBalancesRepository.update(
        //   {
        //     wallet: availableBalance.wallet,
        //     tokenAddress: process.env.AVAX_ADDRESS
        //   },
        //   {
        //     amount: new BigNumber(avaxBalance.amount)
        //       .minus(gasLimit)
        //       .toString(),
        //     availableAmount: new BigNumber(avaxBalance.availableAmount)
        //       .minus(gasLimit)
        //       .minus(amountWithdraw)
        //       .toString()
        //   }
        // )
      } else {
        feeAmount = new BigNumber(gasLimit);
        feeAvailableAmount = new BigNumber(gasLimit);
        await this.spendingBalanceService.minusSpendingBalanceWithTokenAddress(availableBalance.wallet, process.env.AVAX_ADDRESS, minusAmount.toString(), minusAvailableAmount.toString(), feeAmount.toString(), feeAvailableAmount.toString());
        // await this.spendingBalancesRepository.update(
        //   {
        //     wallet: availableBalance.wallet,
        //     tokenAddress: process.env.AVAX_ADDRESS
        //   },
        //   {
        //     availableAmount: new BigNumber(avaxBalance.availableAmount)
        //       .minus(gasLimit)
        //       .toString(),
        //     amount: new BigNumber(avaxBalance.amount).minus(gasLimit).toString()
        //   }
        // )

        let feeWithdraw = new BigNumber(amountWithdraw);
        await this.spendingBalanceService.minusAvailableBalanceWithTokenAddress(availableBalance.wallet, tokenAddress, availableAmountBalances.toString(), feeWithdraw.toString());
        // await this.spendingBalancesRepository.update(
        //   { wallet: availableBalance.wallet, tokenAddress },
        //   {
        //     availableAmount: new BigNumber(availableAmountBalances)
        //       .minus(amountWithdraw)
        //       .toString()
        //   }
        // )
      }

      return await this.createWithdrawTokenRecord(
        tokenAddress,
        amountWithdraw,
        user.id,
        availableBalance.wallet
      )
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async withdrawNftToMainWallet(
    createWithdrawNftDto: CreateWithdrawNftDto,
    user: User
  ) {
    try {
      const { contractAddress, tokenId, signedMessage, signer } =
        createWithdrawNftDto
      const userLogin = await this.getUserById(user.id)
      await this.userService.verifyWalletAddress(
        userLogin,
        signedMessage,
        signer.toLowerCase()
      )
      const findNftByUser = await NftAttributes.findOne({
        where: { owner: userLogin.wallet, tokenId, contractAddress }
      })

      if (!findNftByUser) {
        throw new BadRequestException('You are not the owner of the NFT!')
      }
      const checkStatusLevelUp = await NftLevelUp.findOne({
        where: {
          bedId: findNftByUser.nftId,
          status: NFT_LEVEL_UP_STATUS.PROCESSING
        }
      })
      if (checkStatusLevelUp) {
        throw new BadRequestException(MESSAGE.nft_can_not_withdraw)
      }
      const checkJewel = await Nfts.findOne({
        where: {
          id: findNftByUser.nftId,
          categoryId: CATEGORY_ID.Jewel,
          isLock: IS_LOCK.USED
        }
      })
      if(checkJewel) throw new BadRequestException(MESSAGE.take_off_jewel_from_bed_to_transfer)
      const checkJewelForBed = await this.bedInformationRepository.findOne({
        where: {
          bedId: findNftByUser.nftId,
          enableJewel: true
        }
      })
      if (checkJewelForBed) throw new BadRequestException(MESSAGE.bed_has_jewel)
      const findAvailableAmount = await this.spendingBalancesRepository
        .createQueryBuilder('sb')
        .select(['sb.*'])
        .where('sb.user_id = :userId', { userId: user.id })
        .andWhere('sb.token_address = :tokenAddress', {
          tokenAddress: process.env.AVAX_ADDRESS
        })
        .getRawOne()

      const gas = await estimateGasWithdrawNft(
        process.env.OWNER_NFT_WALLET,
        userLogin.wallet,
        tokenId,
        contractAddress
      )
      const gasLimit = new BigNumber(gas)
      const availableAmountBalances = new BigNumber(
        findAvailableAmount.available_amount
      )
      const amountBalances = new BigNumber(findAvailableAmount.amount)
      if (gasLimit.isGreaterThan(availableAmountBalances)) {
        throw new BadRequestException(
          `You don't have enough money to make the transaction!`
        )
      }
      const checkNftWithdraw = await this.withdrawRepository.findOne({
        where: {
          tokenId,
          contractAddress,
          status: WITHDRAW_STATUS.PENDING
        }
      })
      if (checkNftWithdraw) {
        throw new BadRequestException(`You cannot withdraw this NFT!`)
      }

      let minusAmount = new BigNumber(availableAmountBalances)
      let minusAvailableAmount = new BigNumber(amountBalances);
      let feeAmount = new BigNumber(gasLimit);
      let feeAvailableAmount = new BigNumber(gasLimit);
      await this.spendingBalanceService.minusSpendingBalanceWithTokenAddress(userLogin.wallet, process.env.AVAX_ADDRESS, minusAmount.toString(), minusAvailableAmount.toString(), feeAmount.toString(), feeAvailableAmount.toString());
      // await this.spendingBalancesRepository.update(
      //   { wallet: userLogin.wallet, tokenAddress: process.env.AVAX_ADDRESS },
      //   {
      //     availableAmount: new BigNumber(availableAmountBalances)
      //       .minus(gasLimit)
      //       .toString(),
      //     amount: new BigNumber(amountBalances).minus(gasLimit).toString()
      //   }
      // )
      const withdraw = await this.createWithdrawNFTRecord(
        tokenId,
        contractAddress,
        userLogin
      )
      await this.lockNft(findNftByUser.nftId)
      await this.nftAttributesRepository.update(
        { nftId: findNftByUser.nftId },
        { owner: process.env.OWNER_NFT_WALLET }
      )
      return withdraw
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async createWithdrawNFTRecord(tokenId, contractAddress, user) {
    const withdraw = new Withdraw()
    withdraw.userId = user.id
    withdraw.type = WITHDRAW_TYPE.NFT
    withdraw.tokenId = tokenId
    withdraw.contractAddress = contractAddress
    withdraw.mainWallet = user.wallet
    withdraw.status = WITHDRAW_STATUS.PENDING
    return withdraw.save()
  }

  async createWithdrawTokenRecord(
    tokenAddress,
    amountWithdraw,
    userId,
    wallet
  ) {
    const withdraw = new Withdraw()
    withdraw.type = WITHDRAW_TYPE.TOKEN
    withdraw.tokenAddress = tokenAddress
    withdraw.amount = new BigNumber(amountWithdraw).toString()
    withdraw.mainWallet = wallet.toLowerCase()
    withdraw.status = WITHDRAW_STATUS.PENDING
    withdraw.userId = userId
    return withdraw.save()
  }

  async lockNft(nftId) {
    return await this.nftRepository.update({ id: nftId }, { isLock: 1 })
  }

  async getWithdrawByStatus(user: User, input: GetWithdrawInput) {
    const { status, page, limit, type } = input
    const query =
      status == STATUS_GET_WITHDRAW.PENDING
        ? { status: Not(WITHDRAW_STATUS.SUCCESS) }
        : { status: WITHDRAW_STATUS.SUCCESS }
    const queryType =
      type == TYPE_GET_WITHDRAW.NFT
        ? { type: TYPE_GET_WITHDRAW.NFT }
        : { type: TYPE_GET_WITHDRAW.TOKEN }
    const condition = { ...query, ...queryType, userId: user.id }
    const [withdraw, total] = await this.withdrawRepository.findAndCount({
      where: condition,
      skip: limit * (page - 1),
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    })
    return { data: withdraw, page: page, totalItem: total }
  }

  async getEstimateGas(input: GetEstimateGas, user: User) {
    const { type, contractAddress, tokenId } = input
    const userOperator = await User.findOne({ id: user.id })
    const walletOperator = userOperator.wallet
    let estimateGasValue = 0
    if (type === TYPE_GET_GAS.TOKEN) {
      estimateGasValue = await estimateGas(
        process.env.AVAX_ADDRESS,
        process.env.ADMIN_MAIN_WALLET.toLowerCase(),
        DEFAULT_AMOUNT_WITHDRAW,
        walletOperator
      )
    } else {
      estimateGasValue = await estimateGasWithdrawNft(
        process.env.OWNER_NFT_WALLET,
        walletOperator,
        tokenId,
        contractAddress
      )
    }
    return estimateGasValue
  }

  async getUserById(userId: number) {
    return User.findOne({ where: { id: userId } })
  }
}
