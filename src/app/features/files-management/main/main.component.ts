import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DeleteRequest, DigitalSignatureRequest, FileService, FilesResult} from "../../../core/services/file.service";
import {isDocument, isImage, isOtherFileType, isSpreadSheet} from "../../../shared/utils/validateFileType";
import {NzImageService} from "ng-zorro-antd/image";
import {UiService} from "../../../core/services/ui.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";
import * as moment from "moment";
import {setHeaders} from "../../../shared/utils/generic-table";
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import formatDatesFilter from "../../../shared/utils/formatDatesFilter";

type ViewType = 'list' | 'grid';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  path: string = '';
  elements: FilesResult[] = [];
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<DigitalSignatureRequest>[]  = [];

  protected readonly isOtherFileType = isOtherFileType;
  protected readonly isDocument = isDocument;
  protected readonly isSpreadSheet = isSpreadSheet;
  protected readonly isImage = isImage;
  showCreateNewFolderModal = false;
  viewType: ViewType = 'list';

  pageIndex = 1;
  totalItems = 1;
  pageSize = 10;
  showFiltersDrawer = false
  date: any = '';
  sendToEmail: any = '';
  requestedBy: any = '';
  status: any = '';

  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>
  @ViewChild('inputFolder') inputFolder!: ElementRef<HTMLInputElement>
  loading = false;
  loadingDigitalSignatureRequests = false;
  folderName = '';
  folderNameModalTitle = '';
  loadingFiles = false;
  currentElementToEdit: FilesResult = {file: '', type: null};
  deleteRequests: DeleteRequest[] = [];
  deleteRequestsAmount = 0;
  showMoveModal = false;
  moveFromPath = '';
  filePath = '';
  showRequireSignatureModal = false;

  constructor(
    private fileService: FileService,
    private nzImageService: NzImageService,
    private uiService: UiService,
    private modal: NzModalService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.getElementsByPath();
    if (this.checkIfCanDelete()) {
      this.getDeleteRequests();
    }
  }

  ngAfterViewInit() {
    this.getDigitalSignatureRequests();
  }


  ngOnDestroy() {
  }

  getDigitalSignatureRequests() {
    this.loadingDigitalSignatureRequests = true;
    this.showFiltersDrawer = false;
    this.fileService.getDigitalSignatureRequests(
      this.pageSize,
      this.pageIndex,
      this.date[0] ? this.date[0] : '',
      this.date[1] ? this.date[1] : '',
      this.requestedBy,
      this.sendToEmail,
      this.status
    ).subscribe(data => {
        this.data = data.rows.map(element => ({
          id: element.id,
          date: moment(element.createdAt).calendar(),
          filePath: element.filePath,
          signedDocumentPath: element.signedDocumentPath,
          expiringDate: moment(element.expiresAt).calendar(),
          sendToEmail: element.sendToEmail,
          requestStatus: element.status,
          requestedBy: element.requestedBy,
          sendToName: element.sendToData.label,
        }));
        const headers = setHeaders([
          {key: 'filePath', displayName: 'Documento original'},
          {key: 'signedDocumentPath', displayName: 'Documento firmado'},
          {key: 'sendToName', displayName: 'Nombre de destinatario'},
          {key: 'sendToEmail', displayName: 'Correo de destinatario'},
          {key: 'date', displayName: 'Fecha de solicitud'},
          {key: 'requestStatus', displayName: 'Estatus'},
          {key: 'expiringDate', displayName: 'Fecha de vencimiento de solicitud'},
          {key: 'requestedBy', displayName: 'Solicitado por'},
        ]);

        this.dataTable.render(headers, this.data);
      },
      () => {
        this.loadingDigitalSignatureRequests = false
      },
      () => {
        this.loadingDigitalSignatureRequests = false
      }
    )
  }
  getElementsByPath() {
    this.loadingFiles = true;
    this.fileService.getElementsByPath(this.path).subscribe(result => {
      this.elements = result;
    }, (error) => {
      this.loadingFiles = false;
      this.uiService.createMessage('error', error.error.message)
    }, () => {
      this.loadingFiles = false;
    })
  }

  handleClickElement(element: FilesResult) {
    if (element.type === 'dir') {
      this.path += `+${element.file}`;

      if (this.path.charAt(0) === '+') {
        this.path = this.path.substring(1);
      }
      this.getElementsByPath();
    } else {
      const path = `${this.path}+${element.file}`

      this.fileService.getGenericStaticFile(path).subscribe(result => {
        if (isImage(element.file)) {
          this.showPreview(result.secureUrl);
        } else {
          window.open(result.secureUrl, '_blank')
        }
      })
    }
  }

  goTo(pathFragment: string) {
    if (pathFragment === 'root') {
      this.path = '';
      this.getElementsByPath();
    } else {
      const newPath = this.path.split(pathFragment)[0];
      this.path = `${newPath}+${pathFragment}`;
      if (this.path.charAt(0) === '+') {
        this.path = this.path.substring(1);
      }
      this.getElementsByPath();
    }


  }

  showPreview(image: string) {
    const img = {
      src: image,
      width: '800px',
      height: '700px',
      alt: image
    };
    this.nzImageService.preview([img], {nzZoom: 1, nzRotate: 0});

  }

  formatFileName(filename: FilesResult) {
    // const filenameFormatted = filename.file.replaceAll('-', ' ');
    if (filename.type === 'dir') return filename.file;
    return filename.file.substring(0, 30).concat('...').concat(filename.file.split('.')[1])
  }

  clickInputFile(type = 'file') {
    if (type === 'folder') {
      this.inputFolder?.nativeElement.click();
    } else {
      this.inputFile?.nativeElement.click();
    }
  }

  async handleUploadImage(event: any) {
    this.loading = true;


    const {files} = event.target;

    console.log(files);



    const forLoop = async () => {
      for (let i = 0; i < files.length; i++) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = async () => {
            this.fileService.uploadGenericStaticFile(files[i], this.path).subscribe(result => {
              this.uiService.createMessage('success', 'Se subio el archivo con exito!');
              this.getElementsByPath();
              },
              () => {
                this.loading = false;
                this.uiService.createMessage('error', 'No se logro subir la imagen, ocurrio un error. Intenalo de nuevo')
              },
              () => {
                if (i === files.length - 1) {
                  this.loading = false;
                }
              }
            )
          }
        } catch (e) {
        }
      }
    }
    await forLoop();
  }

  handleCancelCreateFolder() {
    this.currentElementToEdit = {file: '', type: null};
    this.showCreateNewFolderModal = false;
    this.folderName = ''
  }

  handleOkCreateFolder() {
    if (this.currentElementToEdit.type !== null) {
      let path = `${this.path}+${this.currentElementToEdit.file}`
      const fileExtension = this.currentElementToEdit.file.split('_VINM')[1];
      const newNameFile = `${this.path}+${this.folderName.concat('_VINM').concat(fileExtension)}`;
      const newNameDir = `${this.path}+${this.folderName}`;
      if (this.currentElementToEdit.type === 'dir') {
        this.fileService.changeName(path, newNameDir, false).subscribe(result => {
          this.folderName = '';
          this.currentElementToEdit = {file: '', type: null};
          this.showCreateNewFolderModal = false;
          this.uiService.createMessage('success', result.message);
          this.getElementsByPath();
        })
      } else {
        this.fileService.changeName(path, newNameFile, true).subscribe(result => {
          this.folderName = '';
          this.currentElementToEdit = {file: '', type: null};
          this.showCreateNewFolderModal = false;
          this.uiService.createMessage('success', result.message);
          this.getElementsByPath();
        })
      }
    } else {
      const newNameDir = `${this.path}+${this.folderName}`;
      this.fileService.createFolder(newNameDir).subscribe(result => {
        this.folderName = '';
        this.showCreateNewFolderModal = false;
        this.uiService.createMessage('success', result.message);
        this.getElementsByPath();
      })
    }
  }

  deleteFolderOrFile(element: FilesResult) {
    const message = element.type === 'dir' ? 'la carpeta, y todos los documentos dentro de ella' : 'el documento'
    const path = `${this.path}+${element.file}`
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzAutofocus: 'ok',
      nzContent: `Se eliminara ${message}, quieres continuar?`,
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        if (this.checkIfCanDelete()) {
          this.fileService.deleteFolderOrFile(path).subscribe(result => {
            this.uiService.createMessage('success', result.message)
            this.getElementsByPath()
            setTimeout(() => resolve(), 500);
          }, (error) => {
            this.uiService.createMessage('error', error.error.message);
          })
        } else {
          this.fileService.requestDelete(path, this.userService.currentUser.value.id!).subscribe(result => {
            this.uiService.createMessage('success', result.message)
            this.getElementsByPath()
            setTimeout(() => resolve(), 500);
          }, (error) => {
            this.uiService.createMessage('error', error.error.message);
          })
        }
      })
    });
  }

  checkIfCanDelete() {
    return this.userService.onlyIfIsAdmin();
  }

  safeLevelForDelete() {
    const isAdmin = this.checkIfCanDelete();
    return this.path.split('+').length > (isAdmin ? 0 : 1);
  }

  handleCreateOrEditName(file?: FilesResult) {
    this.showCreateNewFolderModal = true;
    if (file) {
      this.folderName = file.file.split('-VINM')[0];
      this.currentElementToEdit = file;
      if (file.type === 'dir') {
        this.folderNameModalTitle = 'Cambiar nombre de carpeta'
      } else {
        this.folderNameModalTitle = 'Cambiar nombre de archivo'
      }
    } else {
      this.folderNameModalTitle = 'Crear nueva carpeta'
    }

  }

  getDeleteRequests() {
    this.fileService.getDeleteFileRequests().subscribe(result => {
      this.deleteRequests = result.rows;
      this.deleteRequestsAmount = result.count;
      if (result.count > 0) {
        this.uiService.createMessage('info', `Tienes ${result.count} solicitudes de eliminacion pendientes!`);
      }
    }, (error) => {
        this.uiService.createMessage('error', error.error.message )
    }, () => {})
  }

  changeViewType(viewType: ViewType) {
    this.viewType = viewType;
  }

  handleMoveElement(element: FilesResult) {
    this.moveFromPath = `${this.path}+${element.file}`;
    this.showMoveModal = true;
  }

  handleMovedElement() {
    this.showMoveModal = false;
    this.getElementsByPath();
  }

  requestDigitalSignature(element: FilesResult) {
    this.filePath = `${this.path}+${element.file}`
    this.showRequireSignatureModal = true;

  }

  handleResendEmail(value: DigitalSignatureRequest) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Reenviar solicitud?, Se actualizara la fecha de expiracion por 48 horas mas, y se enviara un correo a el destinatario.',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.fileService.resendDigitalSignatureRequest(value.id!).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getDigitalSignatureRequests()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        })
      })
    });
  }

  closeFilterModal() {
    this.showFiltersDrawer = false;
  }

  onChangeDate(date: any[]) {
    if (date.length < 1) {
      this.date = '';
    } else {
      this.date = formatDatesFilter(date);
    }
  }

  handleOnComplete() {
    this.showRequireSignatureModal = false;
    this.getDigitalSignatureRequests();
  }
}
