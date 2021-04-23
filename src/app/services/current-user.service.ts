import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  user: any;

  constructor() { }

  setUser(user) {
    // this.user = user;
    sessionStorage.setItem('currentUserId', user.uid)
  }

  getUser() {
    return sessionStorage.getItem('currentUserId');
  }
}
