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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import { DeleteRequestsComponent } from './delete-requests/delete-requests.component';
import {SharedModule} from "../../shared/shared.module";
import {NzListModule} from "ng-zorro-antd/list";
import { MoveModalComponent } from './move-modal/move-modal.component';
import { RequireSignatureModalComponent } from './require-signature-modal/require-signature-modal.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzTreeModule} from "ng-zorro-antd/tree";



@NgModule({
  declarations: [
    MainComponent,
    DeleteRequestsComponent,
    MoveModalComponent,
    RequireSignatureModalComponent,
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
    NzSpinModule,
    NzBadgeModule,
    SharedModule,
    NzListModule,
    NzFormModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzTabsModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzCollapseModule,
    NzTreeModule
  ]
})
export class FilesManagementModule { }
