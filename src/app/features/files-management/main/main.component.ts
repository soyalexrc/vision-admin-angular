import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileService, FilesResult} from "../../../core/services/file.service";
import {isDocument, isImage, isOtherFileType, isSpreadSheet} from "../../../shared/utils/validateFileType";
import {NzImageService} from "ng-zorro-antd/image";
import {UiService} from "../../../core/services/ui.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  path: string = '';
  elements: FilesResult[] = [];

  protected readonly isOtherFileType = isOtherFileType;
  protected readonly isDocument = isDocument;
  protected readonly isSpreadSheet = isSpreadSheet;
  protected readonly isImage = isImage;
  showCreateNewFolderModal = false;

  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>
  loading = false;
  folderName = '';
  loadingFiles = false;

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
  }

  ngOnDestroy() {
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
      const path = `${this.path}+${element.file}`.substring(1)

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
    const filenameFormatted = filename.file.replaceAll('-', ' ');
    if (filename.type === 'dir') return filenameFormatted;
    return filenameFormatted.substring(0, 30).concat('...').concat(filename.file.split('.')[1])
  }

  clickInputFile() {
      this.inputFile?.nativeElement.click();
  }

  async handleUploadImage(event: any) {
    this.loading = true;

    const {files} = event.target;

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
    this.showCreateNewFolderModal = false;
    this.folderName = ''
  }

  handleOkCreateFolder() {
    const path = `${this.path.substring(1)}+${this.folderName}`
    this.fileService.createFolder(path).subscribe(result => {
      this.folderName = ''
      this.showCreateNewFolderModal = false;
      this.uiService.createMessage('success', result.message);
      this.getElementsByPath();
    })
  }

  deleteFolderOrFile(element: FilesResult) {
    const message = element.type === 'dir' ? 'la carpeta, y todos los documentos dentro de ella' : 'el documento'
    const path = `${this.path.substring(1)}+${element.file}`
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: `Se eliminara ${message}, quieres continuar?`,
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.fileService.deleteFolderOrFile(path).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getElementsByPath()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message);
        })
      })
    });
  }

  checkIfCanDelete() {
    return this.userService.onlyIfIsAdmin();
  }

  safeLevelForDelete() {
    return this.path.split('+').length > 1;
  }
}
