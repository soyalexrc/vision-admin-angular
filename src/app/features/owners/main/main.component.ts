import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {setHeaders} from "../../../shared/utils/generic-table";
import {NzModalService} from "ng-zorro-antd/modal";
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";
import {UiService} from "../../../core/services/ui.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<Owner>[]  = [];
  headers: any[] = [];
  constructor(
    private router: Router,
    private modal: NzModalService,
    private ownerService: OwnerService,
    private uiService: UiService
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getOwners();
  }

  handleEdit(id: number) {
    this.router.navigate([`/propietarios/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.ownerService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', 'Se elimino el propietario con exito!')
          this.getOwners()
          setTimeout(() => resolve(), 500);
        })
      })
    });
  }

  handleNewOwner() {
    this.router.navigate(['/propietarios/crear']);
  }

  getOwners() {
    this.loading = true;
    this.ownerService.getAll().subscribe(data => {
        this.data = data.map(element => ({
          id: element.id,
          first_name: element.first_name,
          last_name: element.last_name,
          phone: element.phone,
          email: element.email,
          birthday: element.birthday,
          isInvestor: element.isInvestor
        }));
        const headers = setHeaders([
          {key: 'id', displayName: 'id'},
          {key: 'first_name', displayName: 'Nombre'},
          {key: 'last_name', displayName: 'Apellido'},
          {key: 'phone', displayName: 'Telefono'},
          {key: 'email', displayName: 'Correo'},
          {key: 'birthday', displayName: 'Fecha de cumpleanos'},
          {key: 'isInvestor', displayName: 'Es inversor?'},
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
