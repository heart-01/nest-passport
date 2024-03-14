import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'test@admin.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({ example: 'password', description: 'The password of the user' })
  password: string;
}
