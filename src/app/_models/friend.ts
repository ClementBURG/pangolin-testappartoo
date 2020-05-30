import { User } from './user';

export class Friend {
  _id: string;
  user_id: string;
  _friend?: User;
}
