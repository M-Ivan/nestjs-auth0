import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationClient,
  GetUsers200ResponseOneOfInner,
  ManagementClient,
  TokenSet,
} from 'auth0';

@Injectable()
export class Auth0Service {
  private readonly authenticationClient: AuthenticationClient;
  private readonly managementClient: ManagementClient;

  constructor(private readonly configService: ConfigService) {
    const auth0cfg = {
      domain: this.configService.get('auth0.domain'),
      clientId: this.configService.get('auth0.clientId'),
      clientSecret: this.configService.get('auth0.clientSecret'),
    };

    this.authenticationClient = new AuthenticationClient(auth0cfg);
    this.managementClient = new ManagementClient({
      ...auth0cfg,
      audience: this.configService.get('auth0.management_audience'),
    });
  }

  async getUserTokens(username: string, password: string): Promise<TokenSet> {
    try {
      const response = await this.authenticationClient.oauth.passwordGrant({
        username,
        password,
        audience: this.configService.get('auth0.auth_audience'),
        scope: 'openid profile email offline_access',
      });

      return response.data;
    } catch (error) {
      if (error.statusCode === HttpStatus.FORBIDDEN) {
        throw new HttpException(
          {
            code: HttpStatus.FORBIDDEN, // You can use a custom error code here for error handling on client side.
            message: 'Invalid credentials',
            statusCode: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      }
      throw error;
    }
  }

  async refreshTokens(refresh_token: string): Promise<TokenSet> {
    const response = await this.authenticationClient.oauth.refreshTokenGrant({
      refresh_token,
      audience: this.configService.get('auth0.auth_audience'),
      scope: 'openid profile email offline_access',
    });

    return response.data;
  }

  async getUser(sub: string): Promise<GetUsers200ResponseOneOfInner> {
    const response = await this.managementClient.users.get({ id: sub });

    return response.data;
  }
}
