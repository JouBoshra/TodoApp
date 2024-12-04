import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  apiEndpoint: string = ''; // 'http://localhost:3000';
  userApiRoot: string = '/api/users';
  constructor(private http: HttpClient) { }

  getUserApi(route) {
    return `${this.apiEndpoint}${this.userApiRoot}${route}`;
  }

  registerUser(user) {
    return this.http.post(this.getUserApi('/register'), user);
  }

  authenticateUser(user) {
    return this.http.post(this.getUserApi('/login'), user);
  }

  loginWithGoogleId(id) {
    return this.http.post(this.getUserApi('/login-with-google'), { id: id });
  }

  storeUserData(data) {
    this.authToken = data.token;
    this.user = data.user;
    const expiresAt = moment().add(data.expiresIn, 'second');
    localStorage.setItem('id_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    return this.http.get(this.getUserApi('/logout'));
  }

  isLoggedIn() {
    const tokenExpired = !(moment().isBefore(this.getExpiration()));
    if (tokenExpired) {
      localStorage.clear();
    }
    return !tokenExpired;
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  callGoogleOauth() {
    return this.http.get('/oauth/google');
  }
}
