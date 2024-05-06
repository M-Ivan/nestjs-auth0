import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
