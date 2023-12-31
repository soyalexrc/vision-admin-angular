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
import * as moment from "moment";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<User>[] = [];
  headers: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  totalItems = 1;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private userService: UserService,
    private uiService: UiService
  ) {
  }


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
      nzContent: 'Se eliminara el usuario, quieres continuar?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.userService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getUsers()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message);
        })
      })
    });
  }

  handleNewUser() {
    this.router.navigate(['/usuarios/crear']);
  }

  getUsers() {
    this.loading = true;
    this.userService.getAll(this.pageIndex, this.pageSize).subscribe(data => {
        this.totalItems = data.count;
        this.data = data.rows.map(element => ({
          id: element.id,
          username: element.username,
          name: element.firstName + ' ' + element.lastName,
          userType: element.userType,
          mainPhone: element.mainPhone,
          email: element.email,
          corporateEmail: element.corporateEmail,
          status: element.isActive,
          customJoinDate: moment(element.joinDate).calendar(),
          statusString: element.isActive ? 'Activo' : 'Inactivo',
          isUserTable: true,
        }));
        const headers = setHeaders([
          {key: 'username', displayName: 'Usuario'},
          {key: 'name', displayName: 'Nombre '},
          {key: 'userType', displayName: 'Tipo de usuario '},
          {key: 'mainPhone', displayName: 'Telefono principal'},
          {key: 'email', displayName: 'Correo (personal)'},
          {key: 'corporateEmail', displayName: 'Correo (corporativo)'},
          {key: 'statusString', displayName: 'Estatus'},
          {key: 'customJoinDate', displayName: 'Fecha de llegada'},
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
    this.getUsers();
  }

  handleChangeUserStatus(data: {value: boolean, id: number}) {
    this.loading = true;
    this.userService.changeStatus(data.value, data.id).subscribe(result => {
      this.uiService.createMessage('success', result.message)
      this.getUsers();
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
      this.loading = false;
      this.getUsers();
    }, () => {
      this.loading = false;
    })
  }
}
