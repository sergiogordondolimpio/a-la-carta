import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(this.authService.host)) {
      return httpHandler.handle(httpRequest);
    }
    this.authService.loadToken();
    const token = this.authService.getToken();
    const request = httpRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return httpHandler.handle(request);
  }
}
