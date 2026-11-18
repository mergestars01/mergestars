import {
  Controller,
  Get,
  GoneException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { WalletService } from './wallet.service';

@Controller()
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  @Get('wallet/me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.wallet.getMe(user.id, limit ? Number(limit) : 30);
  }

  @Post('admin/wallet/credit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  adminCredit(): never {
    throw new GoneException('The legacy wallet is read-only.');
  }
}
