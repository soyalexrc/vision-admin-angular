import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isDocument, isImage, isOtherFileType, isSpreadSheet} from "../../../shared/utils/validateFileType";
import {FileService, FilesResult} from "../../../core/services/file.service";
import {UiService} from "../../../core/services/ui.service";

@Component({
  selector: 'app-move-modal',
  templateUrl: './move-modal.component.html',
  styleUrls: ['./move-modal.component.scss']
})
export class MoveModalComponent implements OnInit {
  @Input() show = false;
  @Input() moveFromPath = '';
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>;
  elements: FilesResult[] = [];
  path = ''
  loadingFiles = false;

  constructor(
    private fileService: FileService,
    private uiService: UiService
  ) {
  }

  ngOnInit() {
    this.getElementsByPath();
  }

  handleOk() {
    this.loadingFiles = true;
    let fileOrFolderName: string | string[] = this.moveFromPath.split('+');
    fileOrFolderName = fileOrFolderName[fileOrFolderName.length - 1]
    fileOrFolderName = `${this.path}+${fileOrFolderName}`
    this.fileService.moveFileOrFolder(this.moveFromPath, fileOrFolderName).subscribe(result => {
      this.path = '';
      this.getElementsByPath();
      this.uiService.createMessage('success', result.message);
      this.onSuccess.emit();
    }, (error) => {
        this.uiService.createMessage('error', error.error.message)
      }, () => {
      this.loadingFiles = false;
    })
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
    this.path += `+${element.file}`;
    if (this.path.charAt(0) === '+') {
      this.path = this.path.substring(1);
    }
    this.getElementsByPath();
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

  handleCancel() {
    this.path = '';
    this.getElementsByPath();
    this.onCancel.emit();
  }

}
