import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { ROLE } from '../../auth/constants/role.constant'
import { Roles } from '../../auth/decorators/role.decorator'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { SettingActiveCodeDto } from '../dtos/setting-active-code.dto'
import { SettingsService } from '../services/settings.service'

@Controller('setting')
@ApiTags('Admin Setting')
@ApiGlobalHeaders()
export class SettingController {
  constructor(private readonly settingService: SettingsService) {}

  @Post('active-code')
  @ApiOperation({
    summary: 'Setting active code for sign up'
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async createUserOtpByType(@Body() dto: SettingActiveCodeDto): Promise<any> {
    const message = await this.settingService.setActiveCode(dto)
    return {
      message
    }
  }
}
