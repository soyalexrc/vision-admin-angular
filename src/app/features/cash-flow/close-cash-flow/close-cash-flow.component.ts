import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import {ExportExcelService} from "../../../core/services/export-excel.service";
import {ExportPdfService} from "../../../core/services/export-pdf.service";
import * as moment from "moment/moment";
import {setHeaders} from "../../../shared/utils/generic-table";

@Component({
  selector: 'app-close-cash-flow',
  templateUrl: './close-cash-flow.component.html',
  styleUrls: ['./close-cash-flow.component.scss']
})
export class CloseCashFlowComponent implements AfterViewInit{
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: any  = [];
  headers: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  totalItems = 1;
  detailModal = false;
  detailModalTitle = '';
  detail: any;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private cashFlowService: CashFlowService,
  ) {
  }

  ngAfterViewInit() {
    this.getCloseCashFlows();
  }

  getCloseCashFlows() {
    this.loading = true;
    this.cashFlowService.getCloseCashFlows(this.pageIndex, this.pageSize).subscribe(result => {
        this.totalItems = result.count;

        this.data = result.rows.map(element => ({
          id: element.id,
          date: moment(element.createdAt).format('DD MMMM  YYYY, h:mm:ss a'),
          data: element.data,
        }));
        const headers = setHeaders([
          {key: 'date', displayName: 'Fecha de registro'},
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


  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getCloseCashFlows();
  }

  goToDetail(value: any) {
    this.detail = this.data.find((d: any) => d.id === value);
    console.log(this.detail);
    this.detailModalTitle = this.detail.date;
    this.detailModal = true;
    console.log(value);
  }
}
