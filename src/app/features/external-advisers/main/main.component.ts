import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {Adviser} from "../../../core/interfaces/adviser";
import {AdviserService} from "../../../core/services/adviser.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit{
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<Adviser>[]  = [];
  headers: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  totalItems = 1;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private adviserService: AdviserService,
    private uiService: UiService
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getAdvisers();
  }

  handleEdit(id: number) {
    this.router.navigate([`/asesores-externos/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.adviserService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getAdvisers()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        })
      })
    });
  }

  handleNewAdviser() {
    this.router.navigate(['/asesores-externos/crear']);
  }

  getAdvisers() {
    this.loading = true;
    this.adviserService.getAll(this.pageIndex, this.pageSize).subscribe(data => {
      this.totalItems = data.count;
        this.data = data.rows.map(element => ({
          id: element.id,
          first_name: element.firstName,
          last_name: element.lastName,
          phone: element.phone,
          email: element.email,
          birthday: element.birthDate
        }));
        const headers = setHeaders([
          {key: 'id', displayName: 'id'},
          {key: 'firstName', displayName: 'Nombre'},
          {key: 'lastName', displayName: 'Apellido'},
          {key: 'phone', displayName: 'Telefono'},
          {key: 'email', displayName: 'Correo'},
          {key: 'birthDate', displayName: 'Fecha de cumpleanos'},
        ]);

        this.dataTable.render(headers, data.rows);
      },
      () => {
        this.loading = false
      },
      () => {
        this.loading = false
      }
    )
  }

  handleIndexPageChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getAdvisers();
  }
}
