import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
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
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";



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
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
    NgOptimizedImage,
    NzToolTipModule,
    NzEmptyModule,
    NzDividerModule,
    CdkDropList,
    CdkDrag
  ]
})
export class PropertiesModule { }
