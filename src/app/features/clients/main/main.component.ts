import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {Client} from "../../../core/interfaces/client";
import {ClientService} from "../../../core/services/client.service";
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit{
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<Client>[]  = [];
  headers: any[] = [];
  pageIndex = 1;
  totalItems = 1;
  pageSize = 10;
  constructor(
    private router: Router,
    private modal: NzModalService,
    private clientService: ClientService,
    private uiService: UiService
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getClients();
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
    this.clientService.getAllPaginated(this.pageIndex, this.pageSize ).subscribe(data => {
        this.totalItems = data.count;
        this.data = data.rows.map(element => ({
          id: element.id,
          date: moment(element.createdAt).calendar(),
          name: element.name,
          phone: element.phone,
          contactFrom: element.contactFrom,
          status: element.requirementStatus ? 'Activo' : 'Inactivo',
          operationType: element.operationType.toUpperCase()
        }));
        const headers = setHeaders([
          {key: 'date', displayName: 'Fecha de registro'},
          {key: 'name', displayName: 'Nombre'},
          {key: 'phone', displayName: 'Telefono'},
          {key: 'contactFrom', displayName: 'De dónde nos contacta'},
          {key: 'operationType', displayName: 'Tipo de operacion'},
          {key: 'status', displayName: 'Estatus de la solicitud'},
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
}
