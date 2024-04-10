import { ApiProperty } from '@nestjs/swagger';
import { RecruitingCompany } from '@strivee-api/company';

export class CompanyListResponse {
  /**
   * Determine if the search was successful.
   */
  @ApiProperty({
    description: 'Determine if the search was successful.',
  })
  public success: boolean;

  /**
   * The number of remaining tokens.
   */
  @ApiProperty({
    description: 'The number of remaining tokens.',
  })
  public availableToken: number;

  /**
   * The list of companies likely to recruit.
   */
  @ApiProperty({
    description: 'The list of companies likely to recruit.',
    type: 'array',
    items: { type: 'object' },
  })
  public companies: RecruitingCompany[];

  /**
   * A message providing details when the request does not succeed.
   */
  @ApiProperty({
    description: 'A message providing details when the request does not succeed.',
  })
  public message?: string | undefined;
}
