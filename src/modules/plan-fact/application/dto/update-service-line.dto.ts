import { PartialType } from '@nestjs/swagger';
import { CreateServiceLineDto } from './create-service-line.dto';

export class UpdateServiceLineDto extends PartialType(CreateServiceLineDto) {}
