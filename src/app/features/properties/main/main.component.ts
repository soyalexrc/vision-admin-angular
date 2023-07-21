import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {User} from "../../../core/interfaces/user";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {PropertyReview} from "../../../core/interfaces/property";
import {PropertyService} from "../../../core/services/property.service";
import * as moment from 'moment';
import 'moment/locale/es-us.js';

moment.locale('es-us')

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
  constructor(
    private router: Router,
    private modal: NzModalService,
    private propertyService: PropertyService,
    private uiService: UiService
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
}
