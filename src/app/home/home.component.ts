import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication/authentication.service';
import { User } from '../_models/user';
import { UserService } from '../_services/user/user.service';
import { Friend } from '../_models/friend';
import { FriendService } from '../_services/friend/friend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  friends: Friend[]

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private friendService: FriendService) { }

  ngOnInit() {
    this.userService.getById(this.authenticationService.currentUserValue._id).pipe(first()).subscribe(r => {
      this.user = r;
    });

    this.friendService.getMyFriends().pipe(first()).subscribe(r => {
      this.friends = r.docs;
    });
  }

  removeFriend(friend_id: string) {
    this.friendService.removeById(friend_id).pipe(first()).subscribe(r => {
      this.friends = this.friends.filter(({ _id }) => _id !== friend_id);
    });
  }
}
