import { ethers } from 'ethers'
import Web3 from 'web3'

export const getWeb3 = (provider: string) => {
  return new Web3(provider)
}

export const getContract = (abi: any, provider: string, contract: string) => {
  const web3: Web3 = getWeb3(provider)
  return new web3.eth.Contract(abi, contract)
}

export const getBlockNumber = (provider: string) => {
  const web3: Web3 = getWeb3(provider)
  return web3.eth.getBlockNumber()
}

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const delayTime = 3000

export const timeOut = async (fn: any) => {
  // await fn()
  // await sleep(delayTime)
  // await timeOut(fn)

  setInterval(fn, delayTime)
}

export const convertWeiToEther = async (wei) => {
  return ethers.utils.formatEther(wei)
}

export const convertEtherToWei = (web3, amount) => {
  return web3.utils.toWei(amount, 'ether')
}
