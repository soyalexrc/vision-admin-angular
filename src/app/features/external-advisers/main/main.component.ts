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
          this.uiService.createMessage('success', 'Se elimino el propietario con exito!')
          this.getAdvisers()
          setTimeout(() => resolve(), 500);
        })
      })
    });
  }

  handleNewAdviser() {
    this.router.navigate(['/asesores-externos/crear']);
  }

  getAdvisers() {
    this.loading = true;
    this.adviserService.getAll().subscribe(data => {
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
