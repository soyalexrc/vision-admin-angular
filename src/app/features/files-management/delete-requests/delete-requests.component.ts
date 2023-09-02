import {Component, ViewChild} from '@angular/core';
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UiService} from "../../../core/services/ui.service";
import * as moment from "moment/moment";
import {setHeaders} from "../../../shared/utils/generic-table";
import {DeleteRequest, FileService} from "../../../core/services/file.service";

@Component({
  selector: 'app-delete-requests',
  templateUrl: './delete-requests.component.html',
  styleUrls: ['./delete-requests.component.scss']
})
export class DeleteRequestsComponent {

  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<DeleteRequest>[]  = [];
  headers: any[] = [];
  constructor(
    private router: Router,
    private modal: NzModalService,
    private fileService: FileService,
    private uiService: UiService
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getDeleteRequests();
  }

  handleEdit(id: number) {
    this.router.navigate([`/propietarios/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar solicitud ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.fileService.cancelDeleteRequest(id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getDeleteRequests()
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

  getDeleteRequests() {
    this.loading = true;
    this.fileService.getDeleteFileRequests().subscribe(data => {
        this.data = data.rows.map(element => ({
          id: element.id,
          user: element.user,
          type: element.type,
          path: element.path.split('/static/')[1],
          date: moment(element.createdAt).calendar(),
        }));
        const headers = setHeaders([
          {key: 'user', displayName: 'Usuario'},
          {key: 'type', displayName: 'Tipo de archivo'},
          {key: 'path', displayName: 'URL'},
          {key: 'date', displayName: 'Fecha de solicitud'},
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

  handleAcceptDeleteRequest(value: DeleteRequest) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Aprobar solicitud?, Se eliminara el archivo y/o carpeta.',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.fileService.acceptDeleteRequest(value.id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getDeleteRequests()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        })
      })
    });
  }
}
