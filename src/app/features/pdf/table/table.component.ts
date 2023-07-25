import {Component, OnInit} from '@angular/core';
import {ExportPdfService} from "../../../core/services/export-pdf.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  tableSubscription = new Subscription();
  tableData: any[] = [];

  constructor(private pdfService: ExportPdfService) {
  }



  ngOnInit() {
    this.tableSubscription = this.pdfService.currentPdfTable.subscribe(data => {
      this.tableData = data;
    })
  }
}
