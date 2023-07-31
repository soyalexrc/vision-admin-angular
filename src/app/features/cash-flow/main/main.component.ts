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

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  dataValue = 'income';
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<CashFlowRegister>[] = [];
  statsData!: CashFlowTotals;
  headers: any[] = [];
  showModal = false;
  transactionForm!: FormGroup;
  transferLoading = false;
  loadingStats = true;

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
    this.getCashFlowData(this.dataValue);
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
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.cashFlowService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', 'Se elimino la transaccion con exito!')
          this.getCashFlowData(this.dataValue)
          this.getTotalStats();
          setTimeout(() => resolve(), 500);
        })
      })
    });
  }

  getCashFlowData(source: string) {
    let headers: ITableHeader[];
    this.loading = true;
    this.cashFlowService.getAll().subscribe(data => {
        if (source === 'income') {
          this.data = data
            .filter(x => x.transaction_type === 'Ingreso' && x.temporalTransactionId === null)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.code} - ${element.property?.property_type} - ${element.property?.operation_type}`,
              client: element.client,
              amount: `${formatCurrency(Number(element.amount), 'en', `${element.currency} `)}`,
              reason: element.reason,
              pending_to_collect: `${formatCurrency(Number(element.pending_to_collect), 'en', `${element.currency} `)}`,
              total_due: `${formatCurrency(Number(element.total_due), 'en', `${element.currency} `)}`
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'client', displayName: 'Persona / Cliente'},
            {key: 'amount', displayName: 'Monto'},
            {key: 'reason', displayName: 'Concepto'},
            {key: 'total_due', displayName: 'Por cobrar'},
            {key: 'pending_to_collect', displayName: 'Por pagar'},
          ]);
        }
        if (source === 'outcome') {
          this.data = data
            .filter(x => x.transaction_type === 'Egreso' && x.temporalTransactionId === null)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.code} - ${element.property?.property_type} - ${element.property?.operation_type}`,
              client: element.client,
              amount: `${formatCurrency(Number(element.amount), 'en', `${element.currency} `)}`,
              reason: element.reason
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'client', displayName: 'Persona / Cliente'},
            {key: 'amount', displayName: 'Monto'},
            {key: 'reason', displayName: 'Concepto'},
          ]);
        }
        if (source === 'toPay') {
          this.data = data
            .filter(x => x.transaction_type === 'Cuenta por pagar' && x.temporalTransactionId === null)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.code} - ${element.property?.property_type} - ${element.property?.operation_type}`,
              client: element.client,
              reason: element.reason,
              total_due: `${formatCurrency(Number(element.total_due), 'en', `${element.currency} `)}`
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'client', displayName: 'Persona / Cliente'},
            {key: 'reason', displayName: 'Concepto'},
            {key: 'total_due', displayName: 'Por Pagar'},
          ]);
        }
        if (source === 'toCollect') {
          this.data = data
            .filter(x => x.transaction_type === 'Cuenta por cobrar' && x.temporalTransactionId === null)
            .map(element => ({
              id: element.id,
              date: element.date,
              customProperty: `${element.property?.code} - ${element.property?.property_type} - ${element.property?.operation_type}`,
              client: element.client,
              reason: element.reason,
              pending_to_collect: `${formatCurrency(Number(element.pending_to_collect), 'en', `${element.currency} `)}`,
            }));
          headers = setHeaders([
            {key: 'date', displayName: 'Fecha'},
            {key: 'customProperty', displayName: 'Inmueble'},
            {key: 'client', displayName: 'Persona / Cliente'},
            {key: 'reason', displayName: 'Concepto'},
            {key: 'pending_to_collect', displayName: 'Por Cobrar'},
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
    this.getCashFlowData(event)
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
          USD: (result?.ingreso?.USD ?? 0) - (result?.cuentasPorCobrar?.USD ?? 0),
          Bs: (result?.ingreso?.Bs ?? 0) - (result?.cuentasPorCobrar?.Bs ?? 0),
          EUR: (result?.ingreso?.EUR ?? 0) - (result?.cuentasPorCobrar?.EUR ?? 0)
        }
      };
      this.statsData = data;
    }, () => {
      this.loadingStats = false;
    }, () => {
      this.loadingStats = false;
    })
  }
}
