import { ApiProperty } from '@nestjs/swagger';

export class SyncErrorDto {
  @ApiProperty()
  actionLogId: string;

  @ApiProperty()
  entityType: string;

  @ApiProperty()
  actionType: string;

  @ApiProperty()
  message: string;
}

export class SyncResultDto {
  @ApiProperty()
  processed: number;

  @ApiProperty()
  synced: number;

  @ApiProperty()
  failed: number;

  @ApiProperty()
  ignored: number;

  @ApiProperty({ type: [SyncErrorDto] })
  errors: SyncErrorDto[];
}
