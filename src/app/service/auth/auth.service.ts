import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public host = environment.apiUrlLogin;
  private token: string | null =  null;
  private loggedInUsername: string | null =  null;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient
  ) { }

  /**
   * login
   */
  public login(user: User): Observable<any> {
    return this.http.post<any>(this.host, user, {observe: 'response'});
  }

  /**
   * logout
   */
  public logout() {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * saveToken
   */
  public saveToken(token: string | null): void {
    this.token = token;
    if (token != null) {
      localStorage.setItem('token', token); 
    }
  }

  /**
   * addUserToLocalCache
   */
  public addUserToLocalCache(user: User | null): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * getUserFromLocalCache
   */
  public getUserFromLocalCache(): User | null {
    if (localStorage.getItem('user') !== null) {
      return JSON.parse(localStorage.getItem('user')!);
    } else {
      return null;
    }
  }

  /**
   * loadToken
   */
  public loadToken(): void {
    this.token = localStorage.getItem('token');
    console.log('loadToken:',this.token)
  }

  /**
   * getToken
   */
  public getToken(): string | null {
    return this.token;
  }

  /**
   * isLoggedIn
   */
  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      this.logout();
      return false;
    }
  }
}
