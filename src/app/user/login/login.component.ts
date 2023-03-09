import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showAlert: boolean = false;
  inSubmission: boolean = false;

  alertColor: string = '';
  alertMessage: string = '';

  credentials = {
    email: '',
    password: '',
  };

  constructor(private auth: AngularFireAuth) {}

  async login(): Promise<void> {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMessage = 'Please Wait! We are logging you in.';
    this.alertColor = 'blue';
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      this.alertMessage = 'A unexpected error ocurred. Please try again later.';
      this.alertColor = 'red';
      console.log(error);
      return;
    }
    this.alertMessage = 'Success! Your are now logged in.';
    this.alertColor = 'green';
    this.inSubmission = false;
    return;
  }
}
