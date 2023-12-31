import { Gender } from '@prisma/client';

export class IUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  jwtVersion: number;
  isAdmin: boolean;
  disabled: boolean;
  gender: Gender;
}
