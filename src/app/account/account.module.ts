import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from 'src/app/account/login/login.component';
import { SignUpComponent } from 'src/app/account/sign-up/sign-up.component';


@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
