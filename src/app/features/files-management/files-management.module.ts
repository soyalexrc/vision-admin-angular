import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {FilesManagementRoutingModule} from "./files-management-routing.module";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzSpinModule} from "ng-zorro-antd/spin";



@NgModule({
  declarations: [
    MainComponent
  ],
    imports: [
        CommonModule,
        FilesManagementRoutingModule,
        NzGridModule,
        NzIconModule,
        NzBreadCrumbModule,
        NzSpaceModule,
        NzButtonModule,
        NzToolTipModule,
        NzDropDownModule,
        NzModalModule,
        NzInputModule,
        FormsModule,
        NzSpinModule
    ]
})
export class FilesManagementModule { }
