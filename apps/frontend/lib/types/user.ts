export interface IUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  leaveRemaining: number;
  jwtVersion: number;
  disabled?: boolean;
  isAdmin?: boolean;
}
