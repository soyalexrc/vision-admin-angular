import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import { SectionTitleComponent } from './components/section-title/section-title.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";



@NgModule({
  declarations: [
    SectionTitleComponent,
    GenericTableComponent
  ],
    exports: [
        SectionTitleComponent,
        GenericTableComponent
    ],
  imports: [
    CommonModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzSpinModule,
    NzToolTipModule
  ]
})
export class SharedModule { }
