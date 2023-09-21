import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
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
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import { RegisterPersonModalComponent } from './register-person-modal/register-person-modal.component';
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import { TotalAvailableComponent } from './total-available/total-available.component';
import {HighchartsChartModule} from "highcharts-angular";
import {NzSegmentedModule} from "ng-zorro-antd/segmented";
import {NzSpaceModule} from "ng-zorro-antd/space";
import { CloseCashFlowComponent } from './close-cash-flow/close-cash-flow.component';



@NgModule({
    declarations: [
        MainComponent,
        OperationsResumeComponent,
        CreateComponent,
        RegisterPersonModalComponent,
        TotalAvailableComponent,
        CloseCashFlowComponent,
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
        NzDatePickerModule,
        NzSkeletonModule,
        NzDividerModule,
        NzSpinModule,
        NzCheckboxModule,
        NzDrawerModule,
        NzToolTipModule,
        HighchartsChartModule,
        NzSegmentedModule,
        NzSpaceModule
    ],
    providers: [CurrencyPipe]
})
export class CashFlowModule { }
