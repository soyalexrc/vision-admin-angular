import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {OwnersRoutingModule} from "./owners-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    OwnersRoutingModule,
    SharedModule,
    NzBreadCrumbModule
  ]
})
export class OwnersModule { }
