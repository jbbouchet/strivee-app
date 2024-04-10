/**
 * Data to pass in the FranceTravail authentication request.
 * @see [FranceTravail Documentation](https://francetravail.io/data/documentation/utilisation-api-pole-emploi/generer-access-token)
 */
export interface FranceTravailAuthPayload {
  grant_type: 'client_credentials';

  client_id: string;

  client_secret: string;

  scope: string;
}

/**
 * Response received when the authentication request is executed.
 * @see [FranceTravail Documentation](https://francetravail.io/data/documentation/utilisation-api-pole-emploi/generer-access-token)
 */
export interface FranceTravailAuthResponse {
  token_type: string;

  access_token: string;
  
  scope: string;

  expires_in: number;
}
