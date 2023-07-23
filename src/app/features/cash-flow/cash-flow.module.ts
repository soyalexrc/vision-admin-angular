import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {CashFlowRoutingModule} from "./cash-flow-routing.module";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {SharedModule} from "../../shared/shared.module";
import {NzGridModule} from "ng-zorro-antd/grid";



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    CashFlowRoutingModule,
    NzBreadCrumbModule,
    SharedModule,
    NzGridModule
  ]
})
export class CashFlowModule { }
