import { Module } from '@nestjs/common'

import { MasterDataService } from './master-data.service'

@Module({
  providers: [MasterDataService],
  exports: [MasterDataService]
})
export class MasterDataModule {}
