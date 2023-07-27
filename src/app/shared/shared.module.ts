import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import { SectionTitleComponent } from './components/section-title/section-title.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import { RegisterClientModalComponent } from './components/register-client-modal/register-client-modal.component';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    SectionTitleComponent,
    GenericTableComponent,
    RegisterClientModalComponent
  ],
  exports: [
    SectionTitleComponent,
    GenericTableComponent,
    RegisterClientModalComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzSpinModule,
    NzToolTipModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
