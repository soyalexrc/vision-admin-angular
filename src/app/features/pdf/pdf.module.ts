import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {PdfRoutingModule} from "./pdf-routing.module";
import { TableComponent } from './table/table.component';
import { ReceiptComponent } from './receipt/receipt.component';



@NgModule({
  declarations: [
    MainComponent,
    TableComponent,
    ReceiptComponent
  ],
  imports: [
    CommonModule,
    PdfRoutingModule
  ]
})
export class PdfModule { }
