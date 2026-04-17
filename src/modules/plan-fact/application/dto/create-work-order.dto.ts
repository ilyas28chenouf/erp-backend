import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateWorkOrderDto {
  @ApiProperty()
  @IsUUID()
  serviceLineId: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsInt()
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  weekLabel?: string | null;
}
