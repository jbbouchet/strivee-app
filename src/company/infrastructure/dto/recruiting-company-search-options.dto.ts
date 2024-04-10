import { ApiProperty } from '@nestjs/swagger';
import { RecruitingSearchOptions } from '@strivee-api/company';
import { IsPostalCode, IsString, ValidateIf } from 'class-validator';

export class RecruitingCompanySearchOptionsDto implements RecruitingSearchOptions {
  /**
   * The name of the job sought.
   */
  @IsString()
  @ApiProperty({
    description: 'The name of the job sought.',
    example: 'secrétaire',
  })
  public job: string;

  /**
   * The sought postal code.
   */
  @IsPostalCode('FR')
  @ValidateIf((object: RecruitingCompanySearchOptionsDto, value: any) => {
    return !!value || !object.locality;
  })
  @ApiProperty({
    description: 'The postal code near which the search must be carried out.',
    example: '21000',
  })
  public postalCode?: string;

  /**
   * The sought locality.
   */
  @IsString()
  @ValidateIf((object: RecruitingCompanySearchOptionsDto, value: any) => {
    return !!value || !object.postalCode;
  })
  @ApiProperty({
    description: 'The locality near which the search must be carried out.',
    example: 'dijon',
  })
  public locality?: string;
}
