export const TYPE_CONTRACT = {
    BED: 'bed',
    JEWEL: 'jewel',
    ITEM: 'item',
    BED_BOX: 'bedbox'
}

export const NFT_CONTRACT = {
    [TYPE_CONTRACT.BED]: process.env.BED_CONTRACT,
    [TYPE_CONTRACT.BED_BOX]: process.env.BED_BOX_CONTRACT,
    [TYPE_CONTRACT.JEWEL]: process.env.JEWEL_CONTRACT,
    [TYPE_CONTRACT.ITEM]: process.env.ITEM_CONTRACT,
}

export const NFT_TYPE_SUPPORT = [
    TYPE_CONTRACT.BED,
    TYPE_CONTRACT.BED_BOX,
    TYPE_CONTRACT.JEWEL,
    TYPE_CONTRACT.ITEM
]

export const getPrvKey = async () => {
    const AWS = require('aws-sdk')
    const region = "ap-northeast-1"
    const secretName = "prod-sleefi-secret-key"

    const client = new AWS.SecretsManager({
        region: region
    });

    const pvks = await new Promise<any>((resolve, reject) => {
        client.getSecretValue({SecretId: secretName}, (err, data) => {
            if (err) {
                reject(`get key err: ${err}`,)
            } else {
                if ('SecretString' in data) {
                    resolve(data.SecretString);
                }
            }
        })
    })

    return JSON.parse(pvks)
}

export const getAdminPrv = async () => {
    const secretKey = await getPrvKey()
    if (!secretKey) return null
    return secretKey.ADMIN_PRIVATE_KEY
}

export const getNFTAdminPrv = async () => {
    const secretKey = await getPrvKey()
    if (!secretKey) return null
    return secretKey.OWNER_NFT_PVK
}