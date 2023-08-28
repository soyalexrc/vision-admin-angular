import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import {ExportExcelService} from "../../../core/services/export-excel.service";
import {ExportPdfService} from "../../../core/services/export-pdf.service";
import groupBy from "../../../shared/utils/groupBy";
import {CashFlowRegister} from "../../../core/interfaces/cashFlow";
import * as moment from "moment/moment";
import {setHeaders} from "../../../shared/utils/generic-table";
import {PropertyService} from "../../../core/services/property.service";

@Component({
  selector: 'app-status-history',
  templateUrl: './status-history.component.html',
  styleUrls: ['./status-history.component.scss']
})
export class StatusHistoryComponent implements OnInit, AfterViewInit{
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: any  = [];
  headers: any[] = [];
  id: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private cashFlowService: CashFlowService,
    private excelService: ExportExcelService,
    private pdfService: ExportPdfService,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
  }

  ngAfterViewInit() {
    this.getPropertyHistory();
  }
  getPropertyHistory() {
    this.loading = true;
    this.propertyService.getPropertyStatusHistory(this.id).subscribe(result => {
      this.data = result.rows.map(element => ({
        id: element.id,
        username: element.username,
        date: moment(element.createdAt).calendar(),
        status: element.status,
        comments: element.comments
      }))

        const headers = setHeaders([
          {key: 'username', displayName: 'Usuario'},
          {key: 'date', displayName: 'Fecha de registro'},
          {key: 'status', displayName: 'Estatus'},
          {key: 'comments', displayName: 'Comentarios'},
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
