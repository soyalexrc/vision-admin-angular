import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import {RouterOutlet} from "@angular/router";
import {AuthGuard} from "./guards/auth.guard";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';



@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet
  ],
  providers: [
    AuthGuard
  ]
})
export class CoreModule { }
