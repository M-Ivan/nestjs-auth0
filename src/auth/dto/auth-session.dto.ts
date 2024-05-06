import { GetUsers200ResponseOneOfInner } from 'auth0';

export class AuthSession {
  session_id: string;
  access_token: string;
  refresh_token: string;
  user_profile: GetUsers200ResponseOneOfInner;
  exp: number;
  iss: number;
}
