import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  user: any;

  constructor() { }

  setUser(user) {
    // this.user = user;
    localStorage.setItem('currentUserId', user.uid)
  }

  getUser() {
    return localStorage.getItem('currentUserId');
  }
}
