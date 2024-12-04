import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  authenticatedRoutes: Array<string> = ['dashboard'];
  unauthenticatedRoutes: Array<string> = ['', 'login', 'register'];
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route) {
    if (this.auth.isLoggedIn()) {
      if (this.unauthenticatedRoutes.includes(route.routeConfig.path)) {
        this.router.navigate(['dashboard']);
        return false;
      }
      return true;
    }
    if (this.authenticatedRoutes.includes(route.routeConfig.path)) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}