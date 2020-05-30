import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication/authentication.service';
import { User } from '../_models/user';
import { UserService } from '../_services/user/user.service';
import { FriendService } from '../_services/friend/friend.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  loading = false;
  submitted = false;
  users: User[];
  error = '';

  query: string;
  currentPage: number;
  totalPages: number;
  displayedPages = [];

  currentUser: User;

  constructor(private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private friendService: FriendService)
  {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => {
      this.query = x.q;
      this.loadPage(x.q, x.page || 1);
    });
  }

  private loadPage(query, page) {
    this.loading = true;
    this.userService.search(query, page)
      .pipe(first())
      .subscribe(r => {
        this.users = r.docs;
        this.currentPage = r.page;
        this.totalPages = r.pages;
        this.displayedPages = [];
        for (let i = ((r.page - 5) > 1 ? (r.page - 5) : 1);
             i <= ((r.page + 5) < r.pages ? (r.page + 5) : r.pages);
             i++)
          this.displayedPages.push(i);
        this.loading = false;
      },
      error => {
        this.error = "An error occured. Please retry later.";
        this.loading = false;
      });
  }

  addFriend(user: User) {
    this.friendService.addById(user._id).pipe(first()).subscribe(r => {
      user.friend = r;
    });
  }

  removeFriend(user: User) {
    this.friendService.removeById(user.friend._id).pipe(first()).subscribe(r => {
      user.friend = null;
    });
  }
}
