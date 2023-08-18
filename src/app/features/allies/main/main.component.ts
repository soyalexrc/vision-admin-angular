import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UiService} from "../../../core/services/ui.service";
import {setHeaders} from "../../../shared/utils/generic-table";
import {Ally} from "../../../core/interfaces/ally";
import {AllyService} from "../../../core/services/ally.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<Ally>[]  = [];
  headers: any[] = [];
  pageIndex = 1;
  totalItems = 1;
  pageSize = 10;
  constructor(
    private router: Router,
    private modal: NzModalService,
    private alliesService: AllyService,
    private uiService: UiService
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getAllies();
  }

  handleEdit(id: number) {
    this.router.navigate([`/aliados/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.alliesService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getAllies()
          setTimeout(() => resolve(), 500);
        }, (error: Error) => {
          this.uiService.createMessage('error', error.message)
        })
      })
    });
  }

  handleNewAlly() {
    this.router.navigate(['/aliados/crear']);
  }

  getAllies() {
    this.loading = true;
    this.alliesService.getAll(this.pageIndex, this.pageSize ).subscribe(data => {
        this.totalItems = data.count;
        this.data = data.rows.map(element => ({
          id: element.id,
          firstName: element.firstName,
          lastName: element.lastName,
          phone: element.phone,
          email: element.email,
          birthDate: element.birthDate
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

  handlePageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getAllies();
  }
}
