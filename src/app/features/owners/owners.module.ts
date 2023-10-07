import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {OwnersRoutingModule} from "./owners-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import { CreateComponent } from './create/create.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzSelectModule} from "ng-zorro-antd/select";



@NgModule({
  declarations: [
    MainComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    OwnersRoutingModule,
    SharedModule,
    NzBreadCrumbModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzSelectModule,
    FormsModule
  ]
})
export class OwnersModule { }
