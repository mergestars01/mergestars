import {
  Body,
  CanActivate,
  Controller,
  Get,
  Headers,
  Injectable,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  ServiceUnavailableException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { RfqService } from './rfq.service';
import {
  ApprovalDto,
  AssignManufacturerDto,
  CancelRfqDto,
  CreateRfqDto,
  OfferDto,
  RfqQueryDto,
  StaffActionDto,
  SubmitRfqDto,
} from './rfq.dto';

@Injectable()
class RfqUploadGuard implements CanActivate {
  constructor(private readonly rfq: RfqService) {}

  canActivate() {
    if (!this.rfq.capabilities().enabled)
      throw new ServiceUnavailableException('RFQ rollout is not enabled');
    return true;
  }
}

@Controller('rfqs')
@UseGuards(JwtAuthGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class RfqController {
  constructor(private readonly service: RfqService) {}
  @Get('capabilities') capabilities() {
    return this.service.capabilities();
  }
  @Get('mine') mine(@CurrentUser() user: User, @Query() query: RfqQueryDto) {
    return this.service.list(
      user,
      'mine',
      query.status,
      Number(query.page ?? 0),
    );
  }
  @Get('staff/inbox')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  inbox(@CurrentUser() user: User, @Query() query: RfqQueryDto) {
    return this.service.list(
      user,
      'staff',
      query.status,
      Number(query.page ?? 0),
    );
  }
  @Get('manufacturer/inbox') manufacturerInbox(
    @CurrentUser() user: User,
    @Query() query: RfqQueryDto,
  ) {
    return this.service.list(
      user,
      'manufacturer',
      query.status,
      Number(query.page ?? 0),
    );
  }
  @Post() create(
    @CurrentUser() user: User,
    @Body() dto: CreateRfqDto,
    @Headers('idempotency-key') key: string,
  ) {
    return this.service.createDraft(user, dto, key);
  }
  @Get(':id') get(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.get(user, id);
  }
  @Post(':id/submit') submit(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitRfqDto,
  ) {
    return this.service.submit(user, id, dto);
  }
  @Post(':id/cancel') cancel(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelRfqDto,
  ) {
    return this.service.cancel(user, id, dto.reason);
  }
  @Get(':id/brief')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  brief(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.brief(user, id);
  }
  @Post(':id/staff-action')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  action(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: StaffActionDto,
  ) {
    return this.service.staffAction(user, id, dto);
  }
  @Post(':id/manufacturer')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  assign(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignManufacturerDto,
  ) {
    return this.service.assign(user, id, dto);
  }
  @Post(':id/approvals')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  approval(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApprovalDto,
  ) {
    return this.service.approve(user, id, dto);
  }
  @Post(':id/offers') offer(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: OfferDto,
  ) {
    return this.service.propose(user, id, dto);
  }
  @Post(':id/offers/:offerId/verify')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  verify(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('offerId', ParseUUIDPipe) offerId: string,
  ) {
    return this.service.verifyOffer(user, id, offerId);
  }
  @Post(':id/offers/:offerId/accept') accept(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('offerId', ParseUUIDPipe) offerId: string,
  ) {
    return this.service.accept(user, id, offerId);
  }
  @Post(':id/files/:kind')
  @UseGuards(RfqUploadGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024, files: 1, fields: 0 },
    }),
  )
  upload(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('kind') kind: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.upload(user, id, kind, file);
  }
  @Get(':id/files/:fileId')
  async file(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @Res() response: Response,
  ) {
    const file = await this.service.download(user, id, fileId);
    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    );
    response.setHeader('Cache-Control', 'private, no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; sandbox",
    );
    response.send(file.bytes);
  }
}
