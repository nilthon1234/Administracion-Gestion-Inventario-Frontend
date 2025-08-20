import { inject, Injectable } from "@angular/core";
import { CanActivate, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

  @Injectable({
  providedIn: 'root'
})

export class authAdminGuard implements CanActivate {

    constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    }
    
    this.router.navigate(['/login-admin']);
    return false;
  }
  
}
    
