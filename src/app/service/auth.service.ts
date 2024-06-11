import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  constructor() {
    const storedStatus = localStorage.getItem('loggedIn');
    if (storedStatus !== null) {
      this.loggedIn = JSON.parse(storedStatus);
    }
  }

  setLoggedIn(status: boolean): void {
    this.loggedIn = status;
    localStorage.setItem('loggedIn', JSON.stringify(status));
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

}