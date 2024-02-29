import { Test, TestingModule } from '@nestjs/testing'

import { MasterdataService } from './masterdata.service'

describe('MasterdataService', () => {
  let service: MasterdataService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterdataService]
    }).compile()

    service = module.get<MasterdataService>(MasterdataService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
