import { IsIn } from 'class-validator';

export class UpdatePlanDto {
  @IsIn(['free', 'basic', 'standard', 'plus'])
  plan!: string;
}
