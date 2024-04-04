import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isDocument, isImage, isOtherFileType, isSpreadSheet} from "../../../shared/utils/validateFileType";
import {FileService, FilesResult, FolderResult, FoldersResult} from "../../../core/services/file.service";
import {UiService} from "../../../core/services/ui.service";
import {NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd/tree";

@Component({
  selector: 'app-move-modal',
  templateUrl: './move-modal.component.html',
  styleUrls: ['./move-modal.component.scss']
})
export class MoveModalComponent {
  @Input() show = false;
  @Input() folders: NzTreeNodeOptions[] = [];
  @Input() moveFromPath = '';
  @Input() idElementToMove!: number;
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>;
  path = ''
  loadingFiles = false;
  activatedNode?: NzTreeNode;

  constructor(
    private fileService: FileService,
    private uiService: UiService
  ) {
  }

  handleOk() {
    this.loadingFiles = true;
    this.fileService.moveFileOrFolderV2(this.idElementToMove, Number(this.activatedNode?.key)).subscribe(result => {
      this.path = '';
      this.uiService.createMessage('success', result.message);
      this.activatedNode = undefined;
      this.onSuccess.emit();
    }, (error) => {
        this.uiService.createMessage('error', error.error.message);
        this.loadingFiles = false;
      }, () => {
      this.loadingFiles = false;
    })
  }

  handleCancel() {
    this.path = '';
    this.onCancel.emit();
  }

  renderNestedPanels(children: FoldersResult[] | []): any {
    if (children) {
      return children.map(panel => {
        return {
          ...panel,
          children: this.renderNestedPanels(panel.children) // Recursive call
        };
      });
    }
    return [];
  }


  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node!;
  }

  getAncestors(node: NzTreeNode): string[] {
    const titles: string[] = [];
    while (node.parentNode) {
      titles.unshift(node.parentNode.title);
      node = node.parentNode;
    }
    return titles;
  }

  formatPathToMove() {
    if (!this.activatedNode) {
      return '';
    }
    const titles = this.getAncestors(this.activatedNode);
    titles.push(this.activatedNode.title);
    return titles.join(' / ');
  }
}
