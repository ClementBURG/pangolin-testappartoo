import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { PaginatedModel } from '../../_models/paginated-model';
import { User } from '../../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  search(username: string, page = 1, limit = 5) {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit))
      .set('username', username);

    return this.http.get<PaginatedModel<User>>(`${environment.apiUrl}/user/search`, {params});
  }

  getById(user_id: string) {
    return this.http.get<User>(`${environment.apiUrl}/user/` + user_id);
  }

  updateById(user_id: string, age?: number, family?: string, race?: string, food?: string) {
    let body = {};

    if (age)
      body['age'] = age;
    if (family)
      body['family'] = family;
    if (race)
      body['race'] = race;
    if (food)
      body['food'] = food;

    return this.http.put<User>(`${environment.apiUrl}/user/` + user_id, body);
  }
}
