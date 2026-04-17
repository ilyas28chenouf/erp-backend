import { PartialType } from '@nestjs/swagger';
import { CreatePlanFactEntryDto } from './create-plan-fact-entry.dto';

export class UpdatePlanFactEntryDto extends PartialType(CreatePlanFactEntryDto) {}
