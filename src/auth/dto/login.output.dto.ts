import { UserDto } from './user.dto';

export class LoginOutput {
  user: UserDto;
  sessionId: string;
}
