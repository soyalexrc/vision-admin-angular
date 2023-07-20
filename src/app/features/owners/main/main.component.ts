import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {setHeaders} from "../../../shared/utils/generic-table";
import {NzModalService} from "ng-zorro-antd/modal";
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Owner[]  = [];
  headers: any[] = [];
  constructor(
    private router: Router,
    private modal: NzModalService,
    private ownerService: OwnerService
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getOwners();
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
    this.router.navigate(['/propietarios/crear']);
  }

  getOwners() {
    this.loading = true;
    this.ownerService.getOwners().subscribe(data => {
        this.data = data;
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

        this.dataTable.render(headers, data);
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
