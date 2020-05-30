import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCogs, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from './_services/authentication/authentication.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faCogs = faCogs;
  faSignOutAlt = faSignOutAlt;

  currentUser: User;

  searchForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      username: ['', null]
    });
  }

  get f() { return this.searchForm.controls; }

  searchSubmit() {
    this.submitted = true;

    if (this.searchForm.invalid) {
      return;
    }

    this.router.navigate(['/user-list'], { queryParams: { q: this.f.username.value }});
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
