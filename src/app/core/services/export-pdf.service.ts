import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  currentReceipt: BehaviorSubject<any> = new BehaviorSubject<any>({})
  currentPdfTable: BehaviorSubject<any> = new BehaviorSubject<any>([])

  constructor() { }

  exportPdf() {
    window.print();
  }

  updateReceipt(receipt: any) {
    this.currentReceipt.next(receipt);
  }

  clearReceipt() {
    this.currentReceipt.next({})
  }
  updatePdfTable(receipt: any) {
    this.currentPdfTable.next(receipt);
  }

  clearPdfTable() {
    this.currentPdfTable.next([])
  }

}
