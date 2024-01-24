import { IsString, MaxLength, MinLength } from 'class-validator';

export interface IDatabase {
  data: string
}

export class DataCreateAPI {
  @IsString()
  @MinLength(5, { message: 'Data must be longer than or equal to 5 characters' })
  @MaxLength(50, { message: 'Data must be shorter than or equal to 50 characters' })
  data: string;
}