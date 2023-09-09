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
  CashFlowRegister,
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
  clients: Client[] = [];
  client = '';
  clientsLoading = false;
  owners: Owner[] = [];
  owner = '';
  ownersLoading = false;
  cashFlowPeople: CashFlowPerson[] = [];
  cashFlowPerson = '';
  cashFlowPeopleLoading = false;
  properties: PropertyReview[] = [];
  property = '';
  propertiesLoading = false;
  showFiltersDrawer = false;

  date = [
    new Date().toISOString().split('T')[0].concat('T05:00:00.000Z'),
    new Date().toISOString().split('T')[0].concat('T23:00:00.000Z'),
  ];

  constructor(
    private router: Router,
    private modal: NzModalService,
    private cashFlowService: CashFlowService,
    private uiService: UiService,
    private ownersService: OwnerService,
    private propertyService: PropertyService,
    private clientsService: ClientService,
    private servicesService: ServicesService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getServices();
    this.getSubServices();
    this.getCashFlowPeople();
    this.getOwners();
    this.getProperties()
    this.getClients();
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
    this.cashFlowService.getAll(
      this.pageIndex,
      this.pageSize,
      this.sourceSelection,
      this.currency,
      this.wayToPay,
      this.entity,
      this.service,
      this.date[0],
      this.date[1],
      this.serviceType,
      this.property,
    ).subscribe(data => {
      this.totalItems = data.count;
          this.data = data.rows
            .map(element => ({
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
            {key: 'amount', displayName: 'Monto'},
            {key: 'entity', displayName: 'Entidad'},
            {key: 'transactionType', displayName: 'Tipo de transaccion'},
            {key: 'wayToPay', displayName: 'Forma de pago'},
            {key: 'reason', displayName: 'Concepto'},
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
    this.cashFlowService.getTotals(this.date[0], this.date[1]).subscribe(result => {
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

  getOwners() {
    this.ownersLoading = true;
    this.ownersService.getAll().subscribe(result => {
      this.owners = result;
    }, error => {
      this.ownersLoading = false;
    }, () => {
      this.ownersLoading = false;
    })
  }

  getClients() {
    this.clientsLoading = true;
    this.clientsService.getAll().subscribe(result => {
      this.clients = result;
    }, error => {
      this.clientsLoading = false;
    }, () => {
      this.clientsLoading = false;
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
      this.date = [
        new Date().toISOString().split('T')[0].concat('T03:00:00.000Z'),
        new Date().toISOString().split('T')[0].concat('T23:00:00.000Z'),
      ]
    } else {
      this.date = [
        new Date(date[0]).toISOString().split('T')[0].concat('T05:00:00.000Z'),
        new Date(date[1]).toISOString().split('T')[0].concat('T23:00:00.000Z'),
      ];
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
}
