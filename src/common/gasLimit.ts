import { abi } from '../common/Utils'
import { getContract } from './Web3'
const web3Contract = require('web3')

export const estimateGas = async (
  contract: string,
  mainWallet: string,
  amount: string,
  walletOperator: string
) => {
  const web3 = getContract(abi, process.env.PROVIDER, contract)
  const gasLimit = await web3.methods
    .transfer(
      mainWallet.toLowerCase(),
      web3Contract.utils.toWei(amount, 'ether')
    )
    .estimateGas({ from: walletOperator.toLowerCase() })
  return web3Contract.utils.fromWei(String(gasLimit), 'ether')
}

export const estimateGasWithdrawNft = async (
  walletOperator: string,
  userWallet: string,
  tokenId: string,
  contractAddress
) => {
  const web3 = getContract(abi, process.env.PROVIDER, contractAddress)
  const gasLimit = await web3.methods
    .transferFrom(walletOperator, userWallet, tokenId)
    .estimateGas({ from: walletOperator })
  return web3Contract.utils.fromWei(String(gasLimit), 'ether')
}
