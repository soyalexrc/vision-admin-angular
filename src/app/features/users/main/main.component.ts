import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Ally} from "../../../core/interfaces/ally";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {AllyService} from "../../../core/services/ally.service";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {UserService} from "../../../core/services/user.service";
import {User} from "../../../core/interfaces/user";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit{
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<User>[]  = [];
  headers: any[] = [];
  constructor(
    private router: Router,
    private modal: NzModalService,
    private userService: UserService,
    private uiService: UiService
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getUsers();
  }

  handleEdit(id: number) {
    this.router.navigate([`/usuarios/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.userService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', 'Se elimino el usuario con exito!')
          this.getUsers()
          setTimeout(() => resolve(), 500);
        })
      })
    });
  }

  handleNewUser() {
    this.router.navigate(['/usuarios/crear']);
  }

  getUsers() {
    this.loading = true;
    this.userService.getAll().subscribe(data => {
        this.data = data.map(element => ({
          username: element.username,
          first_name: element.first_name,
          last_name: element.last_name,
          phone_number1: element.phone_number1,
          email: element.email,
        }));
        const headers = setHeaders([
          {key: 'username', displayName: 'Nombre de usuario'},
          {key: 'first_name', displayName: 'Nombre '},
          {key: 'last_name', displayName: 'Apellido '},
          {key: 'phone_number1', displayName: 'Telefono principal'},
          {key: 'email', displayName: 'Correo'},
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
