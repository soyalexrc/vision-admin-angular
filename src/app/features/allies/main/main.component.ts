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
          this.uiService.createMessage('success', 'Se elimino el aliado con exito!')
          this.getAllies()
          setTimeout(() => resolve(), 500);
        })
      })
    });
  }

  handleNewAlly() {
    this.router.navigate(['/aliados/crear']);
  }

  getAllies() {
    this.loading = true;
    this.alliesService.getAll().subscribe(data => {
        this.data = data.map(element => ({
          id: element.id,
          first_name: element.first_name,
          last_name: element.last_name,
          phone: element.phone,
          email: element.email,
          birthday: element.birthday
        }));
        const headers = setHeaders([
          {key: 'id', displayName: 'id'},
          {key: 'first_name', displayName: 'Nombre'},
          {key: 'last_name', displayName: 'Apellido'},
          {key: 'phone', displayName: 'Telefono'},
          {key: 'email', displayName: 'Correo'},
          {key: 'birthday', displayName: 'Fecha de cumpleanos'},
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
