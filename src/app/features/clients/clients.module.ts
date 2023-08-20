import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientsRoutingModule} from "./clients-routing.module";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {SharedModule} from "../../shared/shared.module";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {ReactiveFormsModule} from "@angular/forms";
import {MainComponent} from "./main/main.component";


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    NzBreadCrumbModule,
    SharedModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzWaveModule,
    ReactiveFormsModule
  ]
})
export class ClientsModule {
}
