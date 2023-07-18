import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {CashFlowRoutingModule} from "./cash-flow-routing.module";



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    CashFlowRoutingModule
  ]
})
export class CashFlowModule { }
