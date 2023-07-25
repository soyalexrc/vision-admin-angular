import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {ReceiptComponent} from "./receipt/receipt.component";
import {TableComponent} from "./table/table.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: 'receipt',
    component: ReceiptComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdfRoutingModule { }
