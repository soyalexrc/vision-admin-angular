import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Ally} from "../../../core/interfaces/ally";
import {setHeaders} from "../../../shared/utils/generic-table";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {AllyService} from "../../../core/services/ally.service";
import {UiService} from "../../../core/services/ui.service";
import {ITableHeader} from "../../../core/interfaces/table";
import {CashFlowRegister, CashFlowTotals, Currency, Entity, WayToPay} from "../../../core/interfaces/cashFlow";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../core/interfaces/user";
import {UserService} from "../../../core/services/user.service";
import {formatCurrency} from "@angular/common";
import * as moment from "moment";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<CashFlowRegister>[] = [];
  statsData!: CashFlowTotals;
  headers: any[] = [];
  showModal = false;
  transactionForm!: FormGroup;
  transferLoading = false;
  loadingStats = true;
  totalItems = 1;
  pageIndex = 1;
  pageSize = 10;
  sourceSelection = 'Ingreso';

  constructor(
    private router: Router,
    private modal: NzModalService,
    private cashFlowService: CashFlowService,
    private uiService: UiService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.transactionForm = this.fb.group({
      amount: ['', Validators.required],
      reason: ['', Validators.required],
      originEntity: ['', Validators.required],
      destinyEntity: ['', Validators.required],
      way_to_pay: ['', Validators.required],
      currency: ['', Validators.required],
      createdBy: [this.userService.currentUser.value.username],
      isTemporalTransaction: [true]
    })
  }

  ngAfterViewInit() {
    this.getCashFlowData();
    this.getTotalStats()
  }

  handleNewMoneyTransfer() {

  }

  handleNewRegister() {
    this.router.navigate(['/flujo-de-caja/crear'])
  }

  handleEdit(id: number) {
    this.router.navigate([`/flujo-de-caja/editar/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el registro ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.cashFlowService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getCashFlowData()
          this.getTotalStats();
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        })
      })
    });
  }

  getCashFlowData() {
    let headers: ITableHeader[];
    this.loading = true;
    this.cashFlowService.getAll(this.pageIndex, this.pageSize).subscribe(data => {
      this.totalItems = data.count;
        if (this.sourceSelection === 'Ingreso') {
          this.data = data.rows
            .filter(x => x.transactionType === 'Ingreso' && !x.isTemporalTransaction)
            .map(element => ({
              id: element.id,
              date: moment(element.date).calendar(),
              customProperty: `${element.property?.generalInformation?.code ?? ''} - ${element.property?.generalInformation?.propertyType ?? ''} - ${element.property?.generalInformation?.operationType ?? ''}`,
              person: element.person ? element.person?.split('-')[1] + ' - ' + element.person?.split('-')[2] : '- - ',
              amount: `${formatCurrency(Number(element.amount), 'en', `${element.currency} `)}`,
              reason: element.reason,
              pendingToCollect: `${formatCurrency(Number(element.pendingToCollect), 'en', `${element.currency} `)}`,
              totalDue: `${formatCurrency(Number(element.totalDue), 'en', `${element.currency} `)}`
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'person', displayName: 'Persona'},
            {key: 'amount', displayName: 'Monto'},
            {key: 'reason', displayName: 'Concepto'},
            {key: 'pendingToCollect', displayName: 'Por cobrar'},
            {key: 'totalDue', displayName: 'Por pagar'},
          ]);
        }
        if (this.sourceSelection === 'Egreso') {
          this.data = data.rows
            .filter(x => x.transactionType === 'Egreso' && !x.isTemporalTransaction)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.generalInformation?.code ?? ''} - ${element.property?.generalInformation?.propertyType ?? ''} - ${element.property?.generalInformation?.operationType ?? ''}`,
              person: element.person ? element.person?.split('-')[1] + ' - ' + element.person?.split('-')[2] : '- - ',
              amount: `${formatCurrency(Number(element.amount), 'en', `${element.currency} `)}`,
              reason: element.reason
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'person', displayName: 'Persona / Cliente'},
            {key: 'amount', displayName: 'Monto'},
            {key: 'reason', displayName: 'Concepto'},
          ]);
        }
        if (this.sourceSelection === 'Cuenta por pagar') {
          this.data = data.rows
            .filter(x => x.transactionType === 'Cuenta por pagar' && !x.isTemporalTransaction)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.generalInformation?.code ?? ''} - ${element.property?.generalInformation?.propertyType ?? ''} - ${element.property?.generalInformation?.operationType ?? ''}`,
              person: element.person ? element.person?.split('-')[1] + ' - ' + element.person?.split('-')[2] : '- - ',
              reason: element.reason,
              totalDue: `${formatCurrency(Number(element.totalDue), 'en', `${element.currency} `)}`
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'person', displayName: 'Persona / Cliente'},
            {key: 'reason', displayName: 'Concepto'},
            {key: 'totalDue', displayName: 'Por Pagar'},
          ]);
        }
        if (this.sourceSelection === 'Cuenta por cobrar') {
          this.data = data.rows
            .filter(x => x.transactionType === 'Cuenta por cobrar' && !x.isTemporalTransaction)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.generalInformation?.code ?? ''} - ${element.property?.generalInformation?.propertyType ?? ''} - ${element.property?.generalInformation?.operationType ?? ''}`,
              person: element.person ? element.person?.split('-')[1] + ' - ' + element.person?.split('-')[2] : '- - ',
              reason: element.reason,
              pendingToCollect: `${formatCurrency(Number(element.pendingToCollect), 'en', `${element.currency} `)}`,
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'person', displayName: 'Persona / Cliente'},
            {key: 'reason', displayName: 'Concepto'},
            {key: 'pendingToCollect', displayName: 'Por Cobrar'},
          ]);
        }

        if (this.sourceSelection === 'Ingreso a cuenta de terceros') {
          this.data = data.rows
            .filter(x => x.transactionType === 'Ingreso a cuenta de terceros' && !x.isTemporalTransaction)
            .map(element => ({
              id: element.id,
              date: moment(element.date).calendar(),
              customProperty: `${element.property?.generalInformation?.code ?? ''} - ${element.property?.generalInformation?.propertyType ?? ''} - ${element.property?.generalInformation?.operationType ?? ''}`,
              person: element.person ? element.person?.split('-')[1] + ' - ' + element.person?.split('-')[2] : '- - ',
              amount: `${formatCurrency(Number(element.amount), 'en', `${element.currency} `)}`,
              reason: element.reason,
              pendingToCollect: `${formatCurrency(Number(element.pendingToCollect), 'en', `${element.currency} `)}`,
              totalDue: `${formatCurrency(Number(element.totalDue), 'en', `${element.currency} `)}`
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'person', displayName: 'Persona'},
            {key: 'amount', displayName: 'Monto'},
            {key: 'reason', displayName: 'Concepto'},
            {key: 'pendingToCollect', displayName: 'Por cobrar'},
            {key: 'totalDue', displayName: 'Por pagar'},
          ]);
        }

        if (this.sourceSelection === 'Interbancaria') {
          this.data = data.rows
            .filter(x => x.transactionType === 'Interbancaria' && !x.isTemporalTransaction)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.generalInformation?.code ?? ''} - ${element.property?.generalInformation?.propertyType ?? ''} - ${element.property?.generalInformation?.operationType ?? ''}`,
              person: element.person ? element.person?.split('-')[1] + ' - ' + element.person?.split('-')[2] : '- - ',
              amount: `${formatCurrency(Number(element.amount), 'en', `${element.currency} `)}`,
              reason: element.reason
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'person', displayName: 'Persona / Cliente'},
            {key: 'amount', displayName: 'Monto'},
            {key: 'reason', displayName: 'Concepto'},
          ]);
        }

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

  handleChangeSelection(event: string) {
    this.sourceSelection = event;
    this.getCashFlowData()
  }

  handleCancelModal() {
    this.showModal = false;
  }

  handleOkModal() {
    if (this.transactionForm.value.originEntity === this.transactionForm.value.destinyEntity) {
      this.uiService.createMessage('warning', 'Debes seleccionar entidades diferentes de origen y destino')
    } else {
      this.transferLoading = true;
      this.cashFlowService.createTemporalTransaction(this.transactionForm.value).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo el traslado de dinero con exito!');
          this.showModal = false
        },
        () => {
          this.transferLoading = false;
        },
        () => {
          this.transferLoading = false;
        })
    }
  }

  getTotalStats() {
    this.loadingStats = true;
    this.cashFlowService.getTotals().subscribe(result => {
      const data = {
        ...result,
        utilidad: {
          usd: (result?.ingreso?.usd ?? 0) - (result?.cuentasPorCobrar?.usd ?? 0),
          bs: (result?.ingreso?.bs ?? 0) - (result?.cuentasPorCobrar?.bs ?? 0),
          eur: (result?.ingreso?.eur ?? 0) - (result?.cuentasPorCobrar?.eur ?? 0)
        },
        totalDisponible: {
          usd: (result?.ingreso?.usd ?? 0) - (result?.egreso?.usd ?? 0),
          bs: (result?.ingreso?.bs ?? 0) - (result?.egreso?.bs ?? 0),
          eur: (result?.ingreso?.eur ?? 0) - (result?.egreso?.eur ?? 0)
        }
      };
      this.statsData = data;
    }, () => {
      this.loadingStats = false;
    }, () => {
      this.loadingStats = false;
    })
  }

  handlePageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getCashFlowData();
    this.getTotalStats();
  }
}
