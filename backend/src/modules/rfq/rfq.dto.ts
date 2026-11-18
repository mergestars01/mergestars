import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { industries, rfqStatuses } from './rfq.domain';
export class CreateRfqDto {
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsUUID() designId?: string;
  @IsIn(industries) industry: string;
  @IsString() @Matches(/\S/) @MaxLength(100) category: string;
  @IsString() @Matches(/\S/) @MaxLength(160) title: string;
  @IsOptional() @IsString() @MaxLength(100) requestedBrand?: string;
  @IsOptional() @IsString() @MaxLength(160) referenceProduct?: string;
  @IsOptional() @IsString() @MaxLength(1000) referenceUrl?: string;
  @IsString() @Matches(/\S/) @MaxLength(1000) material: string;
  @IsOptional() @IsString() @MaxLength(500) finishes?: string;
  @IsOptional() @IsString() @MaxLength(500) mosaic?: string;
  @IsOptional() @IsString() @MaxLength(500) dimensions?: string;
  @IsInt() @Min(1) @Max(10000) quantity: number;
  @Matches(/^[A-Z]{2}$/) countryCode: string;
  @IsString() @Matches(/\S/) @MaxLength(100) city: string;
  @IsOptional() @IsString() @MaxLength(200) preferredTimeframe?: string;
  @IsObject() specifications: Record<string, string>;
}
export class SubmitRfqDto {
  @IsBoolean() rightsDeclaration: boolean;
  @IsBoolean() sharingConsent: boolean;
}
export class RfqQueryDto {
  @IsOptional() @IsIn(rfqStatuses) status?: string;
  @IsOptional() @Matches(/^\d{1,4}$/) page?: string;
}
export class StaffActionDto {
  @IsIn(['START_REVIEW', 'CONTACT_RECORDED', 'AWAIT_APPROVAL', 'REJECT'])
  action: string;
  @IsString() @Matches(/\S/) @MaxLength(1000) reason: string;
  @IsOptional() @IsUUID() evidenceFileId?: string;
}
export class AssignManufacturerDto {
  @IsUUID() userId: string;
  @IsUUID() evidenceFileId: string;
}
export class ApprovalDto {
  @IsIn(['BRAND', 'TECHNICAL', 'COMMERCIAL']) kind:
    | 'BRAND'
    | 'TECHNICAL'
    | 'COMMERCIAL';
  @IsIn(['APPROVED', 'REJECTED', 'NOT_REQUIRED']) decision:
    | 'APPROVED'
    | 'REJECTED'
    | 'NOT_REQUIRED';
  @IsOptional() @IsUUID() evidenceFileId?: string;
  @IsOptional() @IsUUID() offerId?: string;
  @IsString() @Matches(/\S/) @MaxLength(1000) reason: string;
}
export class OfferDto {
  @IsInt() @Min(1) @Max(9000000000000) amountMinor: number;
  @Matches(/^[A-Z]{3}$/) currency: string;
  @IsInt() @Min(0) @Max(3) currencyExponent: number;
  @IsInt() @Min(1) @Max(10000) quantity: number;
  @IsString() @Matches(/\S/) @MaxLength(1000) materials: string;
  @IsInt() @Min(1) @Max(1460) deliveryDays: number;
  @IsDateString() validUntil: string;
  @IsString() @Matches(/\S/) @MaxLength(2000) terms: string;
  @IsString() @Matches(/\S/) @MaxLength(1000) taxTreatment: string;
  @IsString() @Matches(/\S/) @MaxLength(1000) shippingTerms: string;
  @IsString() @Matches(/\S/) @MaxLength(160) manufacturerReference: string;
  @IsUUID() responseFileId: string;
}
export class CancelRfqDto {
  @IsString() @Matches(/\S/) @MaxLength(1000) reason: string;
}
