import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Friend } from '../../_models/friend';
import { PaginatedModel } from '../../_models/paginated-model';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient) { }

  getMyFriends() {
    return this.http.get<PaginatedModel<Friend>>(`${environment.apiUrl}/friend/`);
  }

  addById(friend_user_id: string) {
    let body = {};

    if (friend_user_id)
      body['_friend'] = friend_user_id;

    return this.http.post<Friend>(`${environment.apiUrl}/friend/`, body);
  }

  removeById(friend_id: string) {
    return this.http.delete<Friend>(`${environment.apiUrl}/friend/` + friend_id);
  }
}
