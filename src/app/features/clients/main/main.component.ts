import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {Client} from "../../../core/interfaces/client";
import {ClientService} from "../../../core/services/client.service";
import * as moment from 'moment';
import {PropertyReview, PropertyStatus} from "../../../core/interfaces/property";
import formatDatesFilter from "../../../shared/utils/formatDatesFilter";
import {Service, SubService} from "../../../core/interfaces/service";
import {ServicesService} from "../../../core/services/services.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<Client>[] = [];
  services: Service[] = [];
  serviceTypes: SubService[] = [];
  headers: any[] = [];
  pageIndex = 1;
  totalItems = 1;
  pageSize = 10;
  date: any = '';
  service_id = '';
  status = '';
  operationOptions: string[] = [];
  subService_id = '';
  contactFrom = '';
  isPotentialInvestor = '';
  showFiltersDrawer = false;
  currentClient: Partial<Client> = {};
  showChangeStatusModal = false;
  currentStatus: any = '';
  selectedStatus: any = '';
  currentId: any = null;
  changeStatusLoading = false;
  servicesLoading = false;
  serviceTypesLoading = false;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private clientService: ClientService,
    private servicesService: ServicesService,
    private uiService: UiService
  ) {
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getClients();
    this.getServices();
  }

  handleEdit(id: number) {
    this.router.navigate([`/clientes/editar/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.clientService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getClients()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        })
      })
    });
  }

  handleNewClient() {
    this.router.navigate(['/clientes/crear']);
  }

  getClients() {
    this.loading = true;
    this.clientService.getAllPaginated(
      this.pageIndex,
      this.pageSize,
      this.service_id,
      this.subService_id,
      this.date[0] ? this.date[0] : '',
      this.date[1] ? this.date[1] : '',
      this.status,
      this.contactFrom,
      this.isPotentialInvestor,
    ).subscribe(data => {
        this.totalItems = data.count;
        this.data = data.rows.map(element => ({
          id: element.id,
          date: moment(element.createdAt).calendar(),
          name: element.name,
          phone: element.phone,
          isInvestor: element.isPotentialInvestor ? 'Si' : 'No',
          contactFrom: element.contactFrom,
          requirementStatus: element.requirementStatus,
          subServiceName: element.subServiceName.toUpperCase(),
          serviceName: element.serviceName.toUpperCase(),
        }));
        const headers = setHeaders([
          {key: 'date', displayName: 'Fecha de registro'},
          {key: 'name', displayName: 'Nombre'},
          {key: 'phone', displayName: 'Telefono'},
          {key: 'contactFrom', displayName: 'De dónde nos contacta'},
          {key: 'serviceName', displayName: 'Servicio'},
          {key: 'subServiceName', displayName: 'Tipo de operacion'},
          {key: 'isInvestor', displayName: 'Es Potencial inversionista'},
          {key: 'requirementStatus', displayName: 'Estatus de la solicitud'},
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

  handlePageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getClients();
  }

  handleSelectService(value: number) {
    this.subService_id = '';
    this.getSubServices(value);

    // if (value === '') {
    //   this.operationOptions = [];
    // } else if (value === 'Inmobiliario') {
    //   this.operationOptions = [
    //     'Alquiler residencial',
    //     'Alquiler comercial / industrial',
    //     'Alquiler vacacional',
    //     'Captacion'
    //   ]
    // } else if (value === 'Administrativo') {
    //   this.operationOptions = [
    //     'Administracion de inmueble alquilado',
    //     'Administracion de empresa'
    //   ]
    // } else if (value === 'Limpieza (Ama de llaves)') {
    //   this.operationOptions = [
    //     'Limpieza de inmueble vacacional',
    //     'Limpieza inmueble no vacacional',
    //     'Paquete basico (2 dias)',
    //     'Paquete flexible (3 dias)',
    //     'Paquete plus (4 dias)',
    //     'Paquete premium (5 dias)',
    //     'Lavanderia',
    //     'Planchado',
    //     'Cocina',
    //     'Organizacion de espacios',
    //     'Jardineria',
    //     'Condominio comercial',
    //     'Condominio residencial',
    //   ]
    // } else if (value === 'Mantenimiento') {
    //   this.operationOptions = [
    //     'Albañilería',
    //     'Plomería'
    //   ]
    // } else if (value === 'Remodelacion') {
    //   this.operationOptions = [
    //     'Remodelacion',
    //   ]
    // } else if (value === 'Contabilidad') {
    //   this.operationOptions = [
    //     'Contabilidad Seniat',
    //     'Contabilidad Seniat Parafiscales',
    //     'Contabilidad Seniat Alcaldia Parafiscales',
    //     'Declaracion ISLR',
    //     'Declaracion definitiva patente',
    //     'Carta de comisario',
    //     'Balance de apertura',
    //     'Informes de aprobacion estado financiero',
    //     'Estados financieros historicos',
    //     'Estados financieros reexpresados',
    //     'Certificacion de ingresos',
    //   ]
    // } else if (value === 'Legal') {
    //   this.operationOptions = [
    //     'Contrato de arrendamiento privado',
    //     'Contrato de arrendamiento notariado',
    //     'Finiquito visado',
    //     'Finiquito sin visado',
    //     'Compraventa registrada',
    //     'Promesa bilateral de compraventa',
    //     'Cedula catastral Naguanagua',
    //     'Cedula catastral Valencia',
    //     'Cedula catastral San Diego',
    //     'Constitucion de empresa CA',
    //     'Constitucion de empresa Pyme',
    //     'Constitucion de Firma Personal',
    //     'Acta de asamblea',
    //     'Permisos de apertura de negocio Naguanagua',
    //     'Permisos de apertura de negocio Valencia',
    //     'Permisos de apertura de negocio San Diego',
    //     'Bomberos Naguanagua',
    //     'Uso conforme Naguanagua',
    //     'Licencia de actividades economicas Naguanagua',
    //     'Licencia de licores Naguanagua',
    //     'Publicidad Naguanagua',
    //     'Poder registrado',
    //     'Declaracion sucesoral',
    //     'Liberacion de hipoteca',
    //     'Permiso de viaje',
    //     'Liberacion de enajenacion tribunales',
    //     'Titulo supletorio',
    //     'Registro de marca SAPI Caracas',
    //     'Inscripcion parafiscales',
    //   ]
    // }
  }

  closeFilterModal() {
    this.showFiltersDrawer = false;
  }

  onChangeDate(date: any[]) {
    if (date.length < 1) {
      this.date = '';
    } else {
      this.date = formatDatesFilter(date);
    }
  }


  handleChangeStatus(row: Partial<Client>) {
    this.currentClient = row;
    this.showChangeStatusModal = true;
    this.currentStatus = row.requirementStatus;
    this.selectedStatus = row.requirementStatus;
    this.currentId = row.id;
  }

  getColorByStatus(): string {
    switch (this.currentStatus) {
      case 'Activo' :
        return 'green';


      case "Inactivo":
        return 'orange';

      case "Concretado":
        return 'magenta';

      default:
        return 'blue';
    }
  }

  handleCancelChangeStatusModal() {
    this.showChangeStatusModal = false;
    this.selectedStatus = null;
  }

  handleOkChangeStatusModal() {
    this.changeStatusLoading = true;

    if (this.selectedStatus === this.currentStatus) {
      this.changeStatusLoading = false;
      this.showChangeStatusModal = false;
      this.uiService.createMessage('warning', 'Estas intentando actualizar el estatus de la propiedad con el mismo valor que tenia antes, selecciona otro valor.')
      return;
    }
    this.changeStatusClient();
  }

  changeStatusClient() {
    this.clientService.changeStatus(this.selectedStatus, this.currentId).subscribe(result => {
      this.uiService.createMessage('success', result.message);
      this.getClients();
    }, (err) => {
      this.uiService.createMessage('error', err.error.message)
      this.changeStatusLoading = false
      this.showChangeStatusModal = false;
    }, () => {
      this.changeStatusLoading = false
      this.showChangeStatusModal = false;
    })
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

  getSubServices(serviceId: number) {
    this.serviceTypesLoading = true;
    this.servicesService.getSubServicesByServiceId(serviceId).subscribe(result => {
      this.serviceTypes = result;
    }, error => {
      this.serviceTypesLoading = false;
    }, () => {
      this.serviceTypesLoading = false;
    })
  }


}
