import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {RecoverPasswordComponent} from "./recover-password/recover-password.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'recuperar-acceso',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reestablecer-acceso',
    component: RecoverPasswordComponent,
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
