import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthService } from '../service/auth/auth.service';
import { NotificationService } from '../service/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authSerivce: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.authSerivce.isUserLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, 'Necesitas loguearte para acceder a esta página'.toUpperCase())
    return false;
  }
  
}
