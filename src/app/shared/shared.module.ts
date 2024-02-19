import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import { SectionTitleComponent } from './components/section-title/section-title.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import { RegisterOwnerModalComponent } from './components/register-owner-modal/register-owner-modal.component';
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
import { TextShortenerPipe } from './pipes/text-shortener.pipe';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import { SlugTransformDirective } from './directives/slug-transform.directive';
import { RegisterAllyModalComponent } from './components/register-ally-modal/register-ally-modal.component';
import {ConfigServicesModalComponent} from "./components/config-services-modal/config-services-modal.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {DraggableGridComponent} from "./components/draggable-grid/draggable-grid.component";
import { DocumentInputDirective } from './directives/document-input.directive';
import {NzTagModule} from "ng-zorro-antd/tag";
import { RegisterExternalAdviserModalComponent } from './components/register-external-adviser-modal/register-external-adviser-modal.component';
import { FilterDateSelectorComponent } from './components/filter-date-selector/filter-date-selector.component';




@NgModule({
  declarations: [
    SectionTitleComponent,
    GenericTableComponent,
    RegisterOwnerModalComponent,
    OnlyNumbersDirective,
    TextShortenerPipe,
    CurrencyInputDirective,
    SlugTransformDirective,
    RegisterAllyModalComponent,
    ConfigServicesModalComponent,
    DraggableGridComponent,
    DocumentInputDirective,
    RegisterExternalAdviserModalComponent,
    FilterDateSelectorComponent,
  ],
    exports: [
        SectionTitleComponent,
        GenericTableComponent,
        RegisterOwnerModalComponent,
        OnlyNumbersDirective,
        TextShortenerPipe,
        CurrencyInputDirective,
        SlugTransformDirective,
        SlugTransformDirective,
        RegisterAllyModalComponent,
        ConfigServicesModalComponent,
        DraggableGridComponent,
        DocumentInputDirective,
        RegisterExternalAdviserModalComponent,
        FilterDateSelectorComponent,
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
    NzInputModule,
    NzDividerModule,
    NzTagModule
  ]
})
export class SharedModule { }
