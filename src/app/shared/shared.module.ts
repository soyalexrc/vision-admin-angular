import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegularTableComponent } from './components/regular-table/regular-table.component';
import {NzTableModule} from "ng-zorro-antd/table";
import { SectionTitleComponent } from './components/section-title/section-title.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";



@NgModule({
  declarations: [
    RegularTableComponent,
    SectionTitleComponent
  ],
  exports: [
    RegularTableComponent,
    SectionTitleComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule
  ]
})
export class SharedModule { }
