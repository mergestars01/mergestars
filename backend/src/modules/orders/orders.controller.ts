import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@CurrentUser() user: User) {
    return this.orders.listForUser(user.id);
  }

  @Get('delivery/latest')
  @UseGuards(JwtAuthGuard)
  latestDelivery(@CurrentUser() user: User) {
    return this.orders.getLatestDelivery(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(): never {
    throw new BadRequestException(
      'Verified Brand House offer and locked CORE pricing snapshot required before payment.',
    );
  }
}
