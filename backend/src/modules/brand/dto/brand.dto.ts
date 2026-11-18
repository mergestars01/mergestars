import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBrandLineDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE'])
  visibility?: 'PUBLIC' | 'PRIVATE';
}
