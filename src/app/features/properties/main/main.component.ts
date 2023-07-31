import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {User} from "../../../core/interfaces/user";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {
  Property,
  PropertyReview,
  PropertyStatus,
  UpdatePropertyHistoryPayload
} from "../../../core/interfaces/property";
import {PropertyService} from "../../../core/services/property.service";
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<PropertyReview>[]  = [];
  headers: any[] = [];
  showChangeStatusModal = false;
  changeStatusLoading = false;
  currentStatus!: PropertyStatus;
  selectedStatus: PropertyStatus | null = null;
  currentId: any = null;
  comments = '';

  constructor(
    private router: Router,
    private modal: NzModalService,
    private propertyService: PropertyService,
    private uiService: UiService,
    private userService: UserService
  ) {}


  ngOnInit() {

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
    console.log(property)
    this.showChangeStatusModal = true;
    this.currentStatus = property.property_status as PropertyStatus;
    this.selectedStatus = property.property_status as PropertyStatus;
    this.currentId = property.id;
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.propertyService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', 'Se elimino la propiedad con exito!')
          this.getPropertiesPreview()
          setTimeout(() => resolve(), 500);
        })
      })
    });
  }

  handleNewProperty() {
    this.router.navigate(['/propiedades/crear']);
  }

  getPropertiesPreview() {
    this.loading = true;
    this.propertyService.getAllPreview({filters: [], pageNumber: 1, pageSize: 10}).subscribe(data => {
        this.data = data.data.map(element => ({
          id: element.id,
          code: element.code,
          created_date: moment(element.created_date).calendar(),
          propertyType: element.propertyType,
          customLocation: `${element.location.country} - ${element.location.city} - ${element.location.state} - ${element.location.municipality}`,
          price: element.price,
          minimunNegotiation: element.minimunNegotiation,
          owner: element.owner,
          operationType: element.operationType,
          ally: element.ally,
          adviser: element.adviser,
          externalCapacitur: element.externalCapacitur,
          operationReason: 'colocar data aca',
          property_status: element.property_status,
          documentStatus: 'colocar data aca',
          nomenclature: element.nomenclature,
          footageGround: element.footageGround,
          footageBuilding: element.footageBuilding,
          distributionComments: element.distributionComments
        }));
        const headers = setHeaders([
          {key: 'code', displayName: 'Codigo'},
          {key: 'created_date', displayName: 'Fecha de registro '},
          {key: 'propertyType', displayName: 'Inmueble '},
          {key: 'customLocation', displayName: 'Ubicacion'},
          {key: 'price', displayName: 'Precio'},
          {key: 'minimunNegotiation', displayName: 'Negociacion'},
          {key: 'owner', displayName: 'Propietario'},
          {key: 'operationType', displayName: 'Tipo de operacion'},
          {key: 'ally', displayName: 'Aliado'},
          {key: 'adviser', displayName: 'Asesor'},
          {key: 'externalCapacitur', displayName: 'Capacitador externo'},
          {key: 'operationReason', displayName: 'Motivo de operacion'},
          {key: 'property_status', displayName: 'Estatus'},
          {key: 'documentStatus', displayName: 'Estatus de documentos'},
          {key: 'nomenclature', displayName: 'Nomenclatura'},
          {key: 'footageGround', displayName: 'Metraje de terreno'},
          {key: 'footageBuilding', displayName: 'Metraje de construccion'},
          {key: 'distributionComments', displayName: 'Comentarios de distribucion'},
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

  handleHistory(property: Partial<PropertyReview>) {
    this.router.navigate([`/propiedades/historial/${property.id}`])
  }

  handleCancelChangeStatusModal() {
    this.showChangeStatusModal = false;
    this.selectedStatus = null;
  }

  handleOkChangeStatusModal() {
    this.changeStatusLoading = true;
    this.propertyService.updateStatus(this.currentId, this.selectedStatus!).subscribe(result => {
      this.showChangeStatusModal = false;
      this.uiService.createMessage('success', 'Se edito el estatus de la propiedad con exito!');
      const payload: UpdatePropertyHistoryPayload = {
        comments: this.comments,
        status: this.selectedStatus!,
        property_id: this.currentId,
        user_id: this.userService.currentUser?.value?.id,
        username: this.userService.currentUser?.value?.username

      };
      this.propertyService.updateHistory(payload).subscribe(res => {
        this.uiService.createMessage('success', 'Se actualizo el hostorial de la propiedad!');
      })
      this.getPropertiesPreview();
    }, () => {
      this.changeStatusLoading = false;
    }, () => {
      this.changeStatusLoading = false;
    })
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
}
