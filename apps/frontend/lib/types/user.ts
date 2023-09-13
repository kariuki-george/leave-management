export interface IUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  jwtVersion: number;
  disabled?: boolean;
  isAdmin?: boolean;
  gender: 'M' | 'F';
}
