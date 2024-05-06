import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthenticationGuard } from '../guards/authentication.guard';

export function Authenticate() {
  return applyDecorators(UseGuards(AuthenticationGuard));
}
