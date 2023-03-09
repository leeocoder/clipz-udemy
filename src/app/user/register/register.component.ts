import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private authService: AuthService) {}
  inSubmission: boolean = false;
  name: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  age: FormControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword: FormControl = new FormControl('', [Validators.required]);
  phoneNumber: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11),
  ]);

  showAlert: boolean = false;
  alertMessage: string = 'Please Wait! Your account is being created.';
  alertColor: string = 'blue';

  registerForm: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  });

  async register($event: Event): Promise<void> {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMessage = 'Please Wait! Your account is being created.';
    this.alertColor = 'blue';
    try {
      await this.authService.createUser(this.registerForm.value as IUser);
    } catch (error) {
      console.error(error);
      this.alertMessage = 'A unexpected error ocurred. Please try again later.';
      this.alertColor = 'red';
      return;
    }

    this.alertMessage = 'Success! Your account has been created.';
    this.alertColor = 'green';
    this.inSubmission = false;
    return;
  }
}
