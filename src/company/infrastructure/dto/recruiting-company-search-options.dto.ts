import { RecruitingSearchOptions } from '@strivee-api/company';
import { IsPostalCode, IsString, ValidateIf } from 'class-validator';

export class RecruitingCompanySearchOptionsDto implements RecruitingSearchOptions {
  /**
   * The sought business category.
   */
  @IsString()
  public job: string;

  /**
   * The sought postal code.
   */
  @IsPostalCode('FR')
  @ValidateIf((object: RecruitingCompanySearchOptionsDto, value: any) => {
    return !!value || !object.locality;
  })
  public postalCode?: string;

  /**
   * The sought locality.
   */
  @IsString()
  @ValidateIf((object: RecruitingCompanySearchOptionsDto, value: any) => {
    return !!value || !object.postalCode;
  })
  public locality?: string;
}
