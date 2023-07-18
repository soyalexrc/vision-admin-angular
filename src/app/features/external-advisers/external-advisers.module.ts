import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {ExternalAdvisersRoutingModule} from "./external-advisers-routing.module";



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    ExternalAdvisersRoutingModule
  ]
})
export class ExternalAdvisersModule { }
