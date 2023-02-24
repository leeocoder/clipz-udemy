import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  age: FormControl = new FormControl('', [
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

  constructor() {
    this.registerForm.controls['name'];
  }

  register($event: Event): void {
    this.showAlert = true;
    this.alertMessage = 'Please Wait! Your account is being created.';
    this.alertColor = 'blue';
  }
}
