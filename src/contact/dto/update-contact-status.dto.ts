import { IsIn } from 'class-validator';

export class UpdateContactStatusDto {
  @IsIn(['pending', 'following', 'success', 'fail', 'no-reply', 'feature-dev'])
  status!: string;
}
