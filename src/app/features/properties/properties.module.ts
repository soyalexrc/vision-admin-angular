import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {PropertiesRoutingModule} from "./properties-routing.module";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {SharedModule} from "../../shared/shared.module";
import { CreateComponent } from './create/create.component';
import { PreviewComponent } from './preview/preview.component';
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    MainComponent,
    CreateComponent,
    PreviewComponent
  ],
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    NzBreadCrumbModule,
    SharedModule,
    NzStepsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule
  ]
})
export class PropertiesModule { }
