// dto/update-setting.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @IsOptional()
  value?: string;
}
