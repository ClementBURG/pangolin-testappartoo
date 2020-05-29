import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  register(username: string, password: string) {
    let body = {username, password};

    return this.http.post<any>(`${environment.apiUrl}/auth/register`, body);
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, {username, password})
      .pipe(map(r => {
        r.user.jwt = r.jwt;
        localStorage.setItem('currentUser', JSON.stringify(r.user));
        this.currentUserSubject.next(r.user);
        return r.user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
