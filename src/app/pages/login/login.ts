import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from '@src/app/constants/Constanct';
import { ApiResponseModel } from '@src/app/models/api-response-model';
import { ILoginModel, IRegisterModel, RegisterUserClass } from '@src/app/models/user-model';
import { UserService } from '@src/app/services/user-service';
import { Toast } from '@src/app/core/toast';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly toast = inject(Toast);

  isLoginFormVisible: boolean = true;
  isShowPassword: boolean = false;
  registerObj: IRegisterModel = new RegisterUserClass();
  loginObj: ILoginModel = {
    UserName: '',
    UserPassword: '',
  };
  registerBtnDisabled: boolean = false;
  loginBtnDisabled: boolean = false;

  constructor(
    private userSrv: UserService,
    private routerSrv: Router,
  ) {}

  toggleForm() {
    this.isLoginFormVisible = !this.isLoginFormVisible;
    this.isShowPassword = false;
  }

  onRegister() {
    this.registerBtnDisabled = true;
    this.userSrv.onRegister(this.registerObj).subscribe({
      next: (response: ApiResponseModel) => {
        if (response.result) {
          this.toast.show('Registration successful! You can now log in.', 'success');
          this.registerObj = new RegisterUserClass();
          this.isLoginFormVisible = true;
        } else {
          this.toast.show('Registration failed: ' + response.message, 'danger');
        }
        this.registerBtnDisabled = false;
      },
      error: (error: any) => {
        this.registerBtnDisabled = false;
        this.toast.show('Something went wrong while registering. Please try again.', 'danger');
        console.error('Error registering user:', error);
      },
    });
  }

  onLogin() {
    this.loginBtnDisabled = true;
    this.userSrv.onLogin(this.loginObj).subscribe({
      next: (response: ApiResponseModel) => {
        if (response.result) {
          localStorage.setItem(Constants.LOGIN_STORAGE_KEY, JSON.stringify(response.data));
          this.toast.show('Login successful! Redirecting...', 'success');
          this.userSrv.readLoggedData();
          this.userSrv.onLogin$.next();
          setTimeout(() => this.routerSrv.navigate(['/home']), 900);
        } else {
          this.toast.show('Login failed: ' + response.message, 'danger');
        }
        this.loginBtnDisabled = false;
      },
      error: (error: any) => {
        this.loginBtnDisabled = false;
        this.toast.show('Something went wrong while logging in. Please try again.', 'danger');
        console.error('Error logging in user:', error);
      },
    });
  }
}
