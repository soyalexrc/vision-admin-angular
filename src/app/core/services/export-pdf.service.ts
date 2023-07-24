import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  constructor() { }

  exportPdf() {
    window.print();
  }

}
