import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {CommissionCalculationRoutingModule} from "./commission-calculation-routing.module";



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    CommissionCalculationRoutingModule
  ]
})
export class CommissionCalculationModule { }
