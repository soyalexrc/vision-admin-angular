import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Ally} from "../../../core/interfaces/ally";
import {setHeaders} from "../../../shared/utils/generic-table";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {AllyService} from "../../../core/services/ally.service";
import {UiService} from "../../../core/services/ui.service";
import {ITableHeader} from "../../../core/interfaces/table";
import {
  CashFlowPerson,
  CashFlowRegister, CashFlowTotal,
  CashFlowTotals,
  Currency,
  Entity,
  WayToPay
} from "../../../core/interfaces/cashFlow";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../core/interfaces/user";
import {UserService} from "../../../core/services/user.service";
import {formatCurrency} from "@angular/common";
import * as moment from "moment";
import {Service, SubService} from "../../../core/interfaces/service";
import {ServicesService} from "../../../core/services/services.service";
import {Client} from "../../../core/interfaces/client";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";
import {ClientService} from "../../../core/services/client.service";
import {PropertyReview} from "../../../core/interfaces/property";
import {PropertyService} from "../../../core/services/property.service";
import {MONTHS} from "../../../shared/utils/months";
import formatDatesFilter from "../../../shared/utils/formatDatesFilter";

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
  pageSize = 5;
  sourceSelection = '';
  currency = '';
  wayToPay = '';
  entity = '';
  service = '';
  serviceType = '';
  servicesLoading = false;
  serviceTypesLoading = false;
  services: Service[] = [];
  serviceTypes: SubService[] = [];
  person = '';
  cashFlowPeople: CashFlowPerson[] = [];
  cashFlowPerson = '';
  cashFlowPeopleLoading = false;
  properties: PropertyReview[] = [];
  property = '';
  propertiesLoading = false;
  showFiltersDrawer = false;

  date: any = formatDatesFilter([]);
  loadingTotalAvailable = true
  totalAvailable: CashFlowTotal = {usd: null, eur: null, bs: null};
  client = '';
  owner = '';
  detailModalData: any;
  showDetailModal = false;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private cashFlowService: CashFlowService,
    public uiService: UiService,
    private propertyService: PropertyService,
    private servicesService: ServicesService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getServices();
    this.getSubServices();
    this.getCashFlowPeople();
    this.getProperties()
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.minLength(4)]],
      reason: ['', Validators.required],
      entityFrom: ['', Validators.required],
      entityTo: ['', Validators.required],
      wayToPay: ['', Validators.required],
      currency: ['', Validators.required],
      createdBy: [this.userService.currentUser.value.username],
    })
  }

  ngAfterViewInit() {
    this.getData();
    this.getTotalAvailable();
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
    this.cashFlowService.getAll(
      this.pageIndex,
      this.pageSize,
      this.sourceSelection,
      this.currency,
      this.wayToPay,
      this.entity,
      this.service,
      this.date[0] ? this.date[0] : '',
      this.date[1] ? this.date[1] : '',
      this.serviceType,
      this.property,
      this.client,
      this.owner,
      this.cashFlowPerson,
    ).subscribe(data => {
        this.totalItems = data.count;
        this.data = data.rows
          .map(element => ({
            raw: {
              ...element,
              date: moment(element.date).calendar(),
            },
            id: element.id,
            date: moment(element.date).calendar(),
            customProperty: `${element.property?.generalInformation?.code ?? ''} - ${element.property?.generalInformation?.propertyType ?? ''} - ${element.property?.generalInformation?.operationType ?? ''}`,
            person: element.person ? element.person?.split('-')[1] + ' - ' + element.person?.split('-')[2] : '- - ',
            amount: `${formatCurrency(Number(element.amount), 'en', `${element.currency} `)}`,
            reason: element.reason,
            entity: element.entity,
            wayToPay: element.wayToPay,
            transactionType: element.transactionType,
            pendingToCollect: `${formatCurrency(Number(element.pendingToCollect), 'en', `${element.currency} `)}`,
            totalDue: `${formatCurrency(Number(element.totalDue), 'en', `${element.currency} `)}`
          }));
        headers = setHeaders([
          {key: 'date', displayName: 'Fecha'},
          {key: 'customProperty', displayName: 'Inmueble'},
          {key: 'person', displayName: 'Persona'},
          {key: 'entity', displayName: 'Entidad'},
          {key: 'transactionType', displayName: 'Tipo de transaccion'},
          {key: 'wayToPay', displayName: 'Forma de pago'},
          {key: 'reason', displayName: 'Concepto'},
          {key: 'amount', displayName: 'Monto'},
          {key: 'pendingToCollect', displayName: 'Por cobrar'},
          {key: 'totalDue', displayName: 'Por pagar'},
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

  handleCancelModal() {
    this.showModal = false;
  }

  handleOkModal() {
    if (this.transactionForm.value.entityFrom === this.transactionForm.value.entityTo) {
      this.uiService.createMessage('warning', 'Debes seleccionar entidades diferentes de origen y destino')
    } else {
      const data = {...this.transactionForm.value};
      data.amount = data.amount.replace(/[^0-9.]+/g, '').trim();
      data.user_id = this.userService.currentUser.value.id;
      data.date = moment().format();
      const month = new Date().getMonth();
      data.month = MONTHS[month];
      console.log(data);
      this.transferLoading = true;
      this.cashFlowService.createTemporalTransaction(data).subscribe(result => {
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
    this.cashFlowService.getTotals(this.date[0] ? this.date[0] : '', this.date[1] ? this.date[1] : '').subscribe(result => {
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

  getTotalAvailable() {
    this.loadingTotalAvailable = true;
    this.cashFlowService.getTotalAvailable('', '').subscribe(result => {
      this.totalAvailable = result;
    }, () => {this.loadingTotalAvailable = false},
      () => {this.loadingTotalAvailable = false})
  }

  handlePageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getCashFlowData();
    this.getTotalStats();
  }

  getServices() {
    this.servicesLoading = true;
    this.servicesService.getAll().subscribe(result => {
      this.services = result;
    }, error => {
      this.servicesLoading = false;
    }, () => {
      this.servicesLoading = false;
    })
  }

  getSubServices() {
    this.serviceTypesLoading = true;
    this.servicesService.getAllSubService().subscribe(result => {
      this.serviceTypes = result;
    }, error => {
      this.serviceTypesLoading = false;
    }, () => {
      this.serviceTypesLoading = false;
    })
  }

  getProperties() {
    this.propertiesLoading = true;
    this.propertyService.getAllPreviews().subscribe(result => {
      this.properties = result.rows;
    }, error => {
      this.propertiesLoading = false;
    }, () => {
      this.propertiesLoading = false;
    })
  }

  getPropertyLabel(property: PropertyReview) {
    return `${property.code} - ${property.propertyType} - ${property.operationType}`;
  }

  getCashFlowPeople() {
    this.cashFlowPeopleLoading = true;
    this.cashFlowService.getPeople().subscribe(result => {
      this.cashFlowPeople = result;
    }, error => {
      this.cashFlowPeopleLoading = false;
    }, () => {
      this.cashFlowPeopleLoading = false;
    })
  }

  onChangeDate(date: any[], search = false) {
    if (date.length < 1) {
      this.date = '';
    } else {
      this.date = formatDatesFilter(date);
    }
    if (search) {
      this.getData();
    }
  }

  getData() {
    this.getCashFlowData()
    this.getTotalStats();
    this.showFiltersDrawer = false;
  }

  closeFilterModal() {
    this.showFiltersDrawer = false;
  }

  onlyIfIsAdmin() {
    return this.userService.onlyIfIsAdmin()
  }

  get transactionCurrency() {
    return this.transactionForm.get('currency')?.value;
  }

  getValueFromPeople(person: CashFlowPerson, isLabel = false) {
    return isLabel ? `${person.name} - ${person.type}` : `${person.id}-${person.name}-${person.type}`;
  }

  handleSelectPerson(person: string) {
    const id = person.split('-')[0];
    console.log(person);
    if (person.includes('Propietario')) {
      this.owner = id;
      this.client = '';
      this.cashFlowPerson = '';
    } else if (person.includes('Cliente')) {
      this.owner = '';
      this.client = id;
      this.cashFlowPerson = '';
    } else if (person.includes('Administracion')) {
      this.owner = '';
      this.client = '';
      this.cashFlowPerson = person;
    } else {
      this.owner = '';
      this.client = '';
      this.cashFlowPerson = '';
    }
  }

  handleCheckDetail(data: any) {
    this.detailModalData = data;
    this.showDetailModal = true;
  }

  handleCancelDetailModal() {
    this.detailModalData = {};
    this.showDetailModal = false;
  }

  handleOkDetailModal() {
    this.detailModalData = {};
    this.showDetailModal = false;
  }

  getSubServiceById(id: string) {
    return this.serviceTypes.find(s => s.id === Number(id))?.title
  }

  getServiceById(id: string) {
    return this.services.find(s => s.id === Number(id))?.title
  }
}
