import 'dotenv/config'

import { NFT_TYPE_OF_CATEGORY } from 'src/nfts/constants'

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER))

export const TYPE_CONTRACT = {
  BED: 'bed',
  JEWEL: 'jewel',
  ITEM: 'item',
  BED_BOX: 'bedbox'
}

const NFT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'string',
        name: '_tokenURI',
        type: 'string'
      }
    ],
    name: 'mintTo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCurrentTokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'tokensOfOwner',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'start',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'stop',
        type: 'uint256'
      }
    ],
    name: 'tokensOfOwnerIn',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

const ADMIN_WALLET = process.env.ADMIN_MAIN_WALLET
const OWNER_NFT_WALLET = process.env.OWNER_NFT_WALLET

export const NFT_CONTRACT = {
  [TYPE_CONTRACT.BED]: process.env.BED_CONTRACT,
  [TYPE_CONTRACT.BED_BOX]: process.env.BED_BOX_CONTRACT,
  [TYPE_CONTRACT.JEWEL]: process.env.JEWEL_CONTRACT,
  [TYPE_CONTRACT.ITEM]: process.env.ITEM_CONTRACT
}

export const mintNft = async (nftType: string, tokenId: number) => {
  const url = process.env.BASE_URL
  const uri = `${url}/${tokenId}`
  const contract = NFT_CONTRACT[nftType]

  const nftContract = new web3.eth.Contract(NFT_ABI, contract)
  web3.eth.accounts.wallet.add(process.env.OWNER_NFT_PVK)

  const estimateGas = await nftContract.methods
    .mintTo(ADMIN_WALLET, uri)
    .estimateGas({ from: OWNER_NFT_WALLET })

  return await nftContract.methods.mintTo(ADMIN_WALLET, uri).send({
    from: OWNER_NFT_WALLET,
    gas: estimateGas * 2
  })
}

export const getCurrentNftId = async (nftType: string) => {
  const contract = NFT_CONTRACT[nftType]
  const nftContract = new web3.eth.Contract(NFT_ABI, contract)
  return nftContract.methods.getCurrentTokenId().call()
}

export const getLinkImage = async (
  category: NFT_TYPE_OF_CATEGORY,
  type: string
) => {
  let number = 0
  switch (category) {
    case NFT_TYPE_OF_CATEGORY.JEWELS:
      number = Math.ceil(Math.random() * 4)
      return `${type}/${number}`
    case NFT_TYPE_OF_CATEGORY.ITEMS:
      number = Math.ceil(Math.random() * 5)
      return `${type}/${number}`
    default:
      number = Math.ceil(Math.random() * 10000)
      return `${category}/${number}`
  }
}
