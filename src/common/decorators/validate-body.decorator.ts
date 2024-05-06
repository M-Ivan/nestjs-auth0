import { UsePipes, ValidationPipe, applyDecorators } from '@nestjs/common';

export function ValidateBody() {
  return applyDecorators(UsePipes(new ValidationPipe({ transform: true })));
}
