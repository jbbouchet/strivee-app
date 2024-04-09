import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FranceTravailAuthConfig } from '@strivee-api/france-travail';
import { AxiosError, AxiosHeaders } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { FranceTravailAuthPayload, FranceTravailAuthResponse } from '../contract';

@Injectable()
export class FranceTravailAuthenticator {
  private readonly url = 'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=partenaire';

  /**
   * A number of milliseconds that must be subtracted from the timer in order to account for the request time.
   * @private
   */
  private readonly timerDelta = 5000;

  /**
   * The auto-renewal timer.
   * @private
   */
  private timer: any;

  /**
   * The current token value.
   * @private
   */
  private token: { type: string; value: string; authorization: string } | undefined;

  constructor(
    private readonly config: FranceTravailAuthConfig,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Get a valid Bearer token that can be used in the francetravail.io requests.
   * */
  public async getToken(): Promise<{ type: string; value: string; authorization: string }> {
    if (this.token) {
      return this.token;
    }

    return this.requestNewToken();
  }

  /**
   * Call the francetravail.io auth A.P.I and
   * @private
   */
  private async requestNewToken(): Promise<{ type: string; value: string; authorization: string }> {
    const { data } = await firstValueFrom(
      this.httpService.post<FranceTravailAuthResponse>(this.url, this.createPayload(), { headers: this.createHeaders() }).pipe(
        catchError((error: AxiosError<{ error: string; error_description: string }>) => {
          throw new Error(`FranceTravail authentification fail (${error.response.data.error}) : ${error.response.data.error_description}.`);
        }),
      ),
    );

    this.token = {
      type: data.token_type,
      value: data.access_token,
      authorization: this.getTokenAuthorization(data.token_type, data.access_token),
    };

    this.setNextRenewalInterval(data.expires_in * 1000);

    return this.token;
  }

  /**
   * Create the payload to pass in the auth request.
   * @private
   */
  private createPayload(): FranceTravailAuthPayload {
    return {
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: 'api_labonneboitev1',
    };
  }

  /**
   * Create Headers to pass in the auth request.
   * @private
   */
  private createHeaders(): AxiosHeaders {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return headers;
  }

  /**
   * Sets the next renewal interval for the token.
   *
   * @param {number} time - The duration (in milliseconds) to wait before renewing the token.
   * @private
   */
  private setNextRenewalInterval(time: number) {
    // Prevent immediate resolution loop
    time = time - this.timerDelta > 0 ? time - this.timerDelta : time;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.token = undefined;
      clearTimeout(this.timer);

      if (this.config.renewStrategy === 'autoRenew') {
        this.requestNewToken();
      }
    }, time);
  }

  /**
   * Create the value to set in the Authorization header.
   * @param type
   * @param token
   * @private
   */
  private getTokenAuthorization(type: string, token: string) {
    switch (type.toLowerCase()) {
      case 'bearer':
        return `Bearer ${token}`;
      default:
        throw new Error(`Unknown token type ${type}.`);
    }
  }
}
