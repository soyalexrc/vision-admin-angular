import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {RegularTableComponent} from "../../../shared/components/regular-table/regular-table.component";
import {ITableHeader} from "../../../core/interfaces/table";
import {setHeaders} from "../../../shared/utils/generic-table";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = false;
  @ViewChild('dataTable') dataTable!: RegularTableComponent;

  data: any[]  = [];
  headers: any[] = [];
  constructor(
    private router: Router,
    private modal: NzModalService
  ) {}


  ngOnInit() {
    this.data = []
  }

  ngAfterViewInit() {
    const headers = setHeaders([
      {key: 'id', displayName: 'id'},
      {key: 'first_name', displayName: 'Nombre'},
      {key: 'last_name', displayName: 'Apellido'},
      {key: 'phone', displayName: 'Telefono'},
      {key: 'email', displayName: 'Correo'},
      {key: 'birthday', displayName: 'Fecha de cumpleanos'},
      {key: 'isInvestor', displayName: 'Es inversor?'},
      {key: 'type', displayName: 'Tipo de usuario'},
    ]);

    this.data = [
      {
        "id": 1048,
        "first_name": "Sol",
        "last_name": "Sol",
        "phone": "0414-4262906",
        "email": "sol@gmail.com",
        "birthday": "2023-04-07",
        "isInvestor": "No",
        "type": "Propietarios"
      },
      {
        "id": 1049,
        "first_name": "ejemplo",
        "last_name": "ejemplo",
        "phone": "28282828",
        "email": "sample@sample.com",
        "birthday": "2023-04-27",
        "isInvestor": "Si",
        "type": "Propietarios"
      }
    ]

    this.dataTable.render(headers, this.data);
  }

  handleEdit(id: string | number) {

  }
  handleDelete(id: string | number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000))
    });
  }

  handleNewOwner() {

  }
}
