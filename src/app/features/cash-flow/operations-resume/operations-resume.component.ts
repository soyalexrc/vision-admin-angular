import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Ally} from "../../../core/interfaces/ally";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {AllyService} from "../../../core/services/ally.service";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {CashFlowRegister} from "../../../core/interfaces/cashFlow";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import groupBy from "../../../shared/utils/groupBy";
import * as moment from 'moment';
import {ExportExcelService} from "../../../core/services/export-excel.service";
import {ExportPdfService} from "../../../core/services/export-pdf.service";

@Component({
  selector: 'app-operations-resume',
  templateUrl: './operations-resume.component.html',
  styleUrls: ['./operations-resume.component.scss']
})
export class OperationsResumeComponent implements AfterViewInit{
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: any  = [];
  headers: any[] = [];
  constructor(
    private router: Router,
    private modal: NzModalService,
    private cashFlowService: CashFlowService,
    private excelService: ExportExcelService,
    private pdfService: ExportPdfService
  ) {}

  ngAfterViewInit() {
    this.getTemporalTransactions();
  }
  getTemporalTransactions() {
    this.loading = true;
    this.cashFlowService.getTemporalTransactions().subscribe(result => {
      const data = Array.from(groupBy(result, (transaction: CashFlowRegister) => transaction.temporalTransactionId));
      this.data = data.map(element => ({
          id: element[0],
          date: moment(element[1][0].createdAt).calendar(),
          amount: `${element[1][0].currency} ${element[1][0].amount}`,
          origin: element[1][0].entity,
          destiny: element[1][1].entity,
          createdBy: element[1][0].createdBy
        }));
        const headers = setHeaders([
          {key: 'date', displayName: 'Fecha de transaccion'},
          {key: 'amount', displayName: 'Monto'},
          {key: 'origin', displayName: 'Entidad de origen'},
          {key: 'destiny', displayName: 'Entidad de destino'},
          {key: 'createdBy', displayName: 'Creado por'},
        ]);

        this.dataTable.render(headers, this.data);
      },
      () => {
        this.loading = false
      },
      () => {
        this.loading = false
      }
    )
  }

  exportToExcel() {
    const data = this.data.map((element: any) => ({
      "date": element.date,
      "amount": element.amount,
      "origin": element.origin,
      "destiny": element.destiny,
      "createdBy": element.createdBy
    }));
    this.excelService.exportToExcel(data, 'Reporte-' + new Date().getTime() + '.xlsx')
  }

  exportPDF() {
    this.pdfService.updatePdfTable(['sample1', 'sampple2'])
    this.router.navigate(['/export-pdf/table'])
  }
 }
