import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {setHeaders} from "../../../shared/utils/generic-table";
import {NzModalService} from "ng-zorro-antd/modal";
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";
import {UiService} from "../../../core/services/ui.service";
import * as moment from 'moment';

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
          this.uiService.createMessage('success', result.message)
          this.getOwners()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        })
      })
    });
  }

  handleNewOwner() {
    this.router.navigate(['/propietarios/crear']);
  }

  getOwners() {
    this.loading = true;
    this.ownerService.getAllPaginated(1, 10).subscribe(data => {
      console.log(data);
        this.data = data.rows.map(element => ({
          id: element.id,
          firstName: element.firstName,
          lastName: element.lastName,
          phone: element.phone,
          email: element.email,
          customBirthdate: moment(element.birthdate).calendar(),
          isInvestor: element.isInvestor
        }));
        const headers = setHeaders([
          {key: 'firstName', displayName: 'Nombre'},
          {key: 'lastName', displayName: 'Apellido'},
          {key: 'phone', displayName: 'Telefono'},
          {key: 'email', displayName: 'Correo'},
          {key: 'customBirthdate', displayName: 'Fecha de cumpleanos'},
          {key: 'isInvestor', displayName: 'Es inversor?'},
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
