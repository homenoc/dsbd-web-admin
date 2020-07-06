import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) {
  }


  ngOnInit(): void {
  }

  public hide = true;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl();

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  loginMail() {
    this.authService.loginWithMail(this.email.value, this.password.value);
  }

  loginGoogle() {
    this.authService.loginWithGoogle();
  }

}
