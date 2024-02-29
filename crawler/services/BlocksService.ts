import { Block } from "../entities/Block.entity";

class BlockService {
    public async createBlock(contract: string, fromBlock: number, blockNumber: number) {
        const blockId = `${contract}${fromBlock}`
        const data = Block.create({
            blockId,
            block: blockNumber,
            contract,
            fromBlock

        })
        return data.save()
    }

    public async getBlock(contract: string) {
        return await Block.findOne({
            where: {
                contract: contract
            },
            order: {
                block: 'DESC'
            }
        })
    }
}

export default new BlockService()
