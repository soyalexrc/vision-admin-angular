import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthRoutingModule} from "./auth-routing.module";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {LoginComponent} from "./login/login.component";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzDividerModule} from "ng-zorro-antd/divider";



@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent
  ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        NzIconModule,
        NzButtonModule,
        NzCheckboxModule,
        FormsModule,
        NzInputModule,
        ReactiveFormsModule,
        NzFormModule,
        NzGridModule,
        NzAlertModule,
        NzDividerModule
    ]
})
export class AuthModule { }
