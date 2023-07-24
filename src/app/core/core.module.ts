import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ApiInterceptor} from "./interceptor/api.interceptor";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ErrorHandlerInterceptor} from "./interceptor/error-handler.interceptor";
import {AuthenticationGuard} from "./guards/authentication.guard";



@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    RouterLink,
    RouterOutlet,
    NzGridModule,
    NzDrawerModule,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  providers: [
    AuthenticationGuard,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : ApiInterceptor,
      multi : true
    },
    {
      provide : HTTP_INTERCEPTORS,
      useClass : ErrorHandlerInterceptor,
      multi : true
    }
  ]
})
export class CoreModule { }
