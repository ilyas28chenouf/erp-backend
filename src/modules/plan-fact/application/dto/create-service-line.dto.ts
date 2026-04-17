import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateServiceLineDto {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ required: false, nullable: true, example: '100000.00' })
  @IsOptional()
  @IsNumberString()
  plannedAmountYear?: string | null;

  @ApiProperty({ required: false, nullable: true, example: '15000.00' })
  @IsOptional()
  @IsNumberString()
  receivedAdvance?: string | null;

  @ApiProperty({ required: false, nullable: true, example: '32000.00' })
  @IsOptional()
  @IsNumberString()
  unclosedVolumeAmount?: string | null;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isActive?: boolean;
}
