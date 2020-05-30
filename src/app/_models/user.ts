import { Friend } from './friend';

export class User {
  _id: string;
  username: string;
  age?: number;
  family?: string;
  race?: string;
  food?: string;
  friend?: Friend;
  jwt?: string;
}
