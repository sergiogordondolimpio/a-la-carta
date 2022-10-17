import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth/auth.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public invalidInput: string = '';
  public isEmailInvalid: boolean = false;
  public isPassInvalid: boolean = false;
  public hideLoading: boolean = false;
  public user: User = new User ('', '');
  private subscriptions: PushSubscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notifier: NotificationService
  ) { }

  /* 
    User
    {
      "email": "challenge@alkemy.org",
      "password": "react"
    }
  */
  
  
  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('index');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  /**
   * onLogin
   */
  public onLogin():void {
    this.hideLoading = true;
    console.log(this.user);
   /*  this.subscriptions.push( */
   this.authService.login(this.user).subscribe(
    response => {
      console.log(response)
      this.authService.saveToken(response.body.token);
      this.authService.addUserToLocalCache(response); 
      this.router.navigateByUrl('index');
      this.hideLoading = true;
    },
    errorResponse => {
      console.log(errorResponse);
      this.sendErrorNotification(NotificationType.ERROR, errorResponse.message);
    })
/*     );
 */  


}

  sendErrorNotification(notificationType: NotificationType, message: string) {
    if (message) {
      this.notifier.notify(notificationType, message);
    } else {
      this.notifier.notify(notificationType, 'Email o password');
    }
  }
  
  ngOnDestroy(): void {
    /* this.subscriptions.forEach(sub => sub.unsubscribe); */
    this.authService.logout();
  }
}
