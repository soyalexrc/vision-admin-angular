import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {User} from "../../../core/interfaces/user";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {
  PropertyFull, PropertyHistoryElement,
  PropertyReview,
  PropertyStatus,
  UpdatePropertyHistoryPayload
} from "../../../core/interfaces/property";
import {PropertyService} from "../../../core/services/property.service";
import * as moment from 'moment';
import {FileService} from "../../../core/services/file.service";
import {CurrencyPipe} from "@angular/common";
import formatDatesFilter from "../../../shared/utils/formatDatesFilter";
import {PROPERTY_TYPES} from "../../../shared/utils/property-types";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<PropertyReview>[] = [];
  headers: any[] = [];
  showChangeStatusModal = false;
  changeStatusLoading = false;
  currentStatus!: PropertyStatus;
  selectedStatus: PropertyStatus | null = null;
  currentId: any = null;
  comments = '';
  showSetCommissionModal = false;
  currentProperty!: PropertyReview;
  pageIndex = 1;
  pageSize = 10;
  totalItems = 1;
  user: Partial<User> = {};
  showFiltersDrawer = false;
  date: any = '';
  code = '';
  propertyType = '';
  operationType = '';
  propertyTypes = PROPERTY_TYPES;
  status = '';

  constructor(
    private router: Router,
    private modal: NzModalService,
    private propertyService: PropertyService,
    private uiService: UiService,
    private userService: UserService,
    private fileService: FileService,
    private currencyPipe: CurrencyPipe,
  ) {
  }


  ngOnInit() {
    this.user = this.userService.currentUser.value;
  }

  ngAfterViewInit() {
    this.getPropertiesPreview();
  }

  handleEdit(id: number) {
    this.router.navigate([`/propiedades/${id}`])
  }

  handlePreview(property: PropertyReview) {
    this.router.navigate([`/propiedades/vista-previa/${property.id}`])
  }

  handleChangeStatus(property: PropertyReview) {
    this.currentProperty = property;
    this.propertyService.storePropertyReview(property);
    this.showChangeStatusModal = true;
    this.currentStatus = property.status as PropertyStatus;
    this.selectedStatus = property.status as PropertyStatus;
    this.currentId = property.id;
  }

  handleDelete(property: PropertyReview) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.propertyService.deleteOne(property.id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getPropertiesPreview()
          // property.images.forEach((image) => {
          //   this.fileService.deleteFolderOrFile(image.split('genericStaticFileAsset/')[1]).subscribe(result => {
          //     this.uiService.createMessage('success', result.message)
          //   })
          // });
          // property.files.forEach((file) => {
          //   this.fileService.deleteFolderOrFile(file.split('genericStaticFileAsset/')[1]).subscribe(result => {
          //     this.uiService.createMessage('success', result.message)
          //   })
          // });
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        }, () => {

        })
      })
    });
  }

  handleNewProperty() {
    this.router.navigate(['/propiedades/crear']);
  }

  getPropertiesPreview() {
    this.loading = true;
    if (this.user.userType === 'Administrador') {
      this.propertyService.getPreviewsPaginated(
        this.pageSize,
        this.pageIndex,
        this.date[0] ? this.date[0] : '',
        this.date[1] ? this.date[1] : '',
        this.status ? this.status : '',
        this.code ? `VINM-${this.code}` : '',
        this.propertyType ? this.propertyType : '',
        this.operationType ? this.operationType : '',
      ).subscribe(data => {
          this.totalItems = data.count;
          this.data = data.rows.map(element => ({
            id: element.id,
            code: element.code,
            created_date: moment(element.createdAt).calendar(),
            propertyType: element.propertyType,
            customLocation: `${element.country} - ${element.city} - ${element.state} - ${element.municipality}`,
            price: this.currencyPipe.transform(element.price, 'USD', 'symbol', '1.2-2')!,
            minimumNegotiation: this.currencyPipe.transform(element.minimumNegotiation, 'USD', 'symbol', '1.2-2')!,
            owner: element.owner_id,
            operationType: element.operationType,
            ally: element.ally_id,
            user: element.user_id,
            externalAdviser: element.externalAdviser,
            operationReason: 'colocar data aca',
            status: element.status,
            documentStatus: 'colocar data aca',
            nomenclature: element.nomenclature,
            footageGround: element.footageGround,
            footageBuilding: element.footageBuilding,
          }));
          const headers = setHeaders([
            {key: 'code', displayName: 'Codigo'},
            {key: 'created_date', displayName: 'Fecha de registro '},
            {key: 'propertyType', displayName: 'Inmueble '},
            {key: 'customLocation', displayName: 'Ubicacion'},
            {key: 'price', displayName: 'Precio'},
            {key: 'minimumNegotiation', displayName: 'Negociacion'},
            {key: 'owner', displayName: 'Propietario'},
            {key: 'operationType', displayName: 'Tipo de operacion'},
            {key: 'ally', displayName: 'Aliado'},
            {key: 'adviser', displayName: 'Asesor'},
            {key: 'externalAdviser', displayName: 'Captacion asesor externo'},
            {key: 'operationReason', displayName: 'Motivo de operacion'},
            {key: 'status', displayName: 'Estatus'},
            {key: 'documentStatus', displayName: 'Estatus de documentos'},
            {key: 'nomenclature', displayName: 'Nomenclatura'},
            {key: 'footageGround', displayName: 'Metraje de terreno'},
            {key: 'footageBuilding', displayName: 'Metraje de construccion'},
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
    } else {
      this.propertyService.getPreviewsByUserId(this.pageSize, this.pageIndex, this.user.id!).subscribe(data => {
          this.data = data.rows.map(element => ({
            id: element.id,
            code: element.code,
            created_date: moment(element.createdAt).calendar(),
            propertyType: element.propertyType,
            customLocation: `${element.country} - ${element.city} - ${element.state} - ${element.municipality}`,
            price: element.price,
            minimumNegotiation: element.minimumNegotiation,
            owner: element.owner_id,
            operationType: element.operationType,
            ally: element.ally_id,
            user: element.user_id,
            externalAdviser: element.externalAdviser,
            operationReason: 'colocar data aca',
            status: element.status,
            documentStatus: 'colocar data aca',
            nomenclature: element.nomenclature,
            footageGround: element.footageGround,
            footageBuilding: element.footageBuilding,
          }));
          const headers = setHeaders([
            {key: 'code', displayName: 'Codigo'},
            {key: 'created_date', displayName: 'Fecha de registro '},
            {key: 'propertyType', displayName: 'Inmueble '},
            {key: 'customLocation', displayName: 'Ubicacion'},
            {key: 'price', displayName: 'Precio'},
            {key: 'minimumNegotiation', displayName: 'Negociacion'},
            {key: 'owner', displayName: 'Propietario'},
            {key: 'operationType', displayName: 'Tipo de operacion'},
            {key: 'ally', displayName: 'Aliado'},
            {key: 'adviser', displayName: 'Asesor'},
            {key: 'externalAdviser', displayName: 'Captacion asesor externo'},
            {key: 'operationReason', displayName: 'Motivo de operacion'},
            {key: 'status', displayName: 'Estatus'},
            {key: 'documentStatus', displayName: 'Estatus de documentos'},
            {key: 'nomenclature', displayName: 'Nomenclatura'},
            {key: 'footageGround', displayName: 'Metraje de terreno'},
            {key: 'footageBuilding', displayName: 'Metraje de construccion'},
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

  }

  handleHistory(property: Partial<PropertyReview>) {
    this.router.navigate([`/propiedades/historial/${property.id}`])
  }

  handleCancelChangeStatusModal() {
    this.showChangeStatusModal = false;
    this.selectedStatus = null;
  }

  handleOkChangeStatusModal() {
    this.changeStatusLoading = true;

    if (this.selectedStatus === 'Cerrado por Vision (punta única)' || this.selectedStatus === 'Cerrado por Vision doble punta') {
      this.changeStatusLoading = false;
      this.showSetCommissionModal = true;
      return;
    }
    if (this.selectedStatus === this.currentStatus) {
      this.changeStatusLoading = false;
      this.showChangeStatusModal = false;
      this.uiService.createMessage('warning', 'Estas intentando actualizar el estatus de la propiedad con el mismo valor que tenia antes, selecciona otro valor.')
      return;
    };
    this.changeStatusProperty();
  }


  getColorByStatus(): string {
    switch (this.currentStatus) {
      case 'Activo' :
        return 'green';
        break;

      case 'Incompleto':
        return 'gold';
        break;

      case "Reservado":
        return 'orange';
        break;

      case "Suspendido":
        return 'red';
        break;

      case "Cerrado fuera de Vision":
        return 'magenta';
        break;

      case "Cerrado por Vision (punta única)":
        return 'magenta';
        break;

      case "Cerrado por Vision doble punta":
        return 'magenta';
        break;

      default:
        return 'blue';
    }
  }

  changeStatusProperty() {
    const payload: PropertyHistoryElement = {
      comments: this.comments,
      status: this.selectedStatus!,
      property_id: this.currentId,
      username: this.userService.currentUser?.value?.username!
    };
    this.propertyService.updateStatus(payload).subscribe(result => {
      this.showChangeStatusModal = false;
      this.uiService.createMessage('success', result.message);
      this.getPropertiesPreview();
    }, (error) => {
      this.uiService.createMessage('error', error.error.message);
      this.changeStatusLoading = false;
    }, () => {
      this.changeStatusLoading = false;
    })
  }

  handleCancelSetCommission() {
    this.showSetCommissionModal = false;
  }

  handleSetCommission() {
    this.showSetCommissionModal = false;
  }

  isAdmin() {
    return this.user.userType === 'Administrador';
  }

  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getPropertiesPreview();
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
}
