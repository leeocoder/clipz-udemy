import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [AuthModalComponent, LoginComponent, RegisterComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [AuthModalComponent],
})
export class UserModule {}
