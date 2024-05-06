import { Injectable } from '@nestjs/common';
import { GetUsers200ResponseOneOfInner } from 'auth0';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserMapper {
  mapAuth0UserToUserDto(user: GetUsers200ResponseOneOfInner): UserDto {
    return {
      userId: user.user_id,
      email: user.email,
      username: user.username,
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatar: user.picture,
    };
  }
}
