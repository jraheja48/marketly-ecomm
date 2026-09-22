import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from '@src/app/constants/Constanct';
import { ApiResponseModel } from '@src/app/models/api-response-model';
import { ILoginModel, IRegisterModel, RegisterUserClass } from '@src/app/models/user-model';
import { UserService } from '@src/app/services/user-service';

// bootstrap.bundle.min.js is loaded globally (see angular.json "scripts"),
// the same script that already drives the navbar's offcanvas/dropdown —
// this just gives TypeScript a type for the global it exposes.
declare const bootstrap: any;

type ToastVariant = 'success' | 'danger';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  @ViewChild('toastEl') private toastEl!: ElementRef<HTMLElement>;

  isLoginFormVisible: boolean = true;
  isShowPassword: boolean = false;
  registerObj: IRegisterModel = new RegisterUserClass();
  loginObj: ILoginModel = {
    UserName: '',
    UserPassword: '',
  };
  registerBtnDisabled: boolean = false;
  loginBtnDisabled: boolean = false;

  protected readonly toastMessage = signal('');
  protected readonly toastVariant = signal<ToastVariant>('success');

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
          this.showToast('Registration successful! You can now log in.', 'success');
          this.registerObj = new RegisterUserClass();
          this.isLoginFormVisible = true;
        } else {
          this.showToast('Registration failed: ' + response.message, 'danger');
        }
        this.registerBtnDisabled = false;
      },
      error: (error: any) => {
        this.registerBtnDisabled = false;
        this.showToast('Something went wrong while registering. Please try again.', 'danger');
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
          this.showToast('Login successful! Redirecting...', 'success');
          this.userSrv.onLogin$.next();
          setTimeout(() => this.routerSrv.navigate(['/home']), 900);
        } else {
          this.showToast('Login failed: ' + response.message, 'danger');
        }
        this.loginBtnDisabled = false;
      },
      error: (error: any) => {
        this.loginBtnDisabled = false;
        this.showToast('Something went wrong while logging in. Please try again.', 'danger');
        console.error('Error logging in user:', error);
      },
    });
  }

  private showToast(message: string, variant: ToastVariant): void {
    this.toastMessage.set(message);
    this.toastVariant.set(variant);
    bootstrap.Toast.getOrCreateInstance(this.toastEl.nativeElement).show();
  }
}
