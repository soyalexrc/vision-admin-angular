import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {CashFlowRoutingModule} from "./cash-flow-routing.module";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {SharedModule} from "../../shared/shared.module";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzRadioModule} from "ng-zorro-antd/radio";
import { OperationsResumeComponent } from './operations-resume/operations-resume.component';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import { CreateComponent } from './create/create.component';
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";



@NgModule({
  declarations: [
    MainComponent,
    OperationsResumeComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    CashFlowRoutingModule,
    NzBreadCrumbModule,
    SharedModule,
    NzGridModule,
    NzButtonModule,
    FormsModule,
    NzRadioModule,
    NzModalModule,
    NzSelectModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzStepsModule,
    NzDatePickerModule
  ]
})
export class CashFlowModule { }
