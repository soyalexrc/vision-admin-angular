import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import { SectionTitleComponent } from './components/section-title/section-title.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import { RegisterOwnerModalComponent } from './components/register-client-modal/register-owner-modal.component';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzInputModule} from "ng-zorro-antd/input";




@NgModule({
  declarations: [
    SectionTitleComponent,
    GenericTableComponent,
    RegisterOwnerModalComponent,
    OnlyNumbersDirective,
  ],
    exports: [
        SectionTitleComponent,
        GenericTableComponent,
        RegisterOwnerModalComponent,
        OnlyNumbersDirective,
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
    ReactiveFormsModule,
    NzPaginationModule,
    NzSwitchModule,
    FormsModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzInputModule
  ]
})
export class SharedModule { }
