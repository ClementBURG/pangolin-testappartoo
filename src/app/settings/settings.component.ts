import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication/authentication.service';
import { User } from '../_models/user';
import { UserService } from '../_services/user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user: User;
  successMessage: string;

  infoForm: FormGroup;
  infoLoading = false;
  infoSubmitted = false;
  infoError = '';

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
    this.infoForm = this.formBuilder.group({
      age: ['', null],
      family: ['', null],
      race: ['', null],
      food: ['', null]
    });

    this.userService.getById(this.authenticationService.currentUserValue._id).pipe(first()).subscribe(r => {
      this.user = r;
      this.infoForm.controls.age.patchValue(this.user.age);
      this.infoForm.controls.family.patchValue(this.user.family);
      this.infoForm.controls.race.patchValue(this.user.race);
      this.infoForm.controls.food.patchValue(this.user.food);
    });
  }

  get if() { return this.infoForm.controls; }

  onInfoSubmit() {
    this.infoSubmitted = true;
    this.infoError = '';

    if (this.infoForm.invalid) {
      return;
    }

    this.infoLoading = true;
    this.userService.updateById(this.user._id, this.if.age.value, this.if.family.value,
      this.if.race.value, this.if.food.value)
      .pipe(first())
      .subscribe(
        data => {
          this.successMessage = "Your contact information has been updated";
          this.infoLoading = false;
        },
        error => {
          this.infoError = error;
          this.infoLoading = false;
        }
      );
  }
}
