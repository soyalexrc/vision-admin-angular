import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NzImageService} from "ng-zorro-antd/image";
import {CdkDrag, CdkDragMove, CdkDropList, CdkDropListGroup, moveItemInArray} from "@angular/cdk/drag-drop";
import {ViewportRuler} from "@angular/cdk/overlay";
import {isDocument, isImage, isOtherFileType, isSpreadSheet} from "../../utils/validateFileType";

@Component({
  selector: 'app-draggable-grid',
  templateUrl: './draggable-grid.component.html',
  styleUrls: ['./draggable-grid.component.scss']
})
export class DraggableGridComponent implements AfterViewInit {

  @Input() elements: string[] = [];
  @Input() canDelete = true;
  @Output() onDeleteElement: EventEmitter<string> = new EventEmitter<string>()
  @Output() onSortElements: EventEmitter<string[]> = new EventEmitter<string[]>()

  @ViewChild(CdkDropListGroup) listGroup!: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder!: CdkDropList;

  public target!: CdkDropList | null;
  public targetIndex!: number;
  public source!: CdkDropList | any;
  public sourceIndex!: number;
  public dragIndex!: number;
  public activeContainer: any;
  protected readonly isSpreadSheet = isSpreadSheet;
  protected readonly isDocument = isDocument;
  protected readonly isImage = isImage;
  protected readonly isOtherFileType = isOtherFileType;

  constructor(
    private nzImageService: NzImageService,
    private viewportRuler: ViewportRuler
    ) {
    this.target = null;
    this.source = null;
  }


  ngAfterViewInit() {
    // let phElement = this.placeholder.element.nativeElement;
    //
    // phElement.style.display = 'none';
    // phElement.parentElement?.removeChild(phElement);
  }

  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);
    this.listGroup._items.forEach(dropList => {
      if (this.isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = this.isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top
    };
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    if (drop != this.activeContainer)
      return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = this.indexOf(dropElement.parentElement?.children, (this.source ? phElement : sourceElement));
    let dropIndex = this.indexOf(dropElement.parentElement?.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement?.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement?.insertBefore(phElement, (dropIndex > dragIndex
      ? dropElement.nextSibling : dropElement));

    this.placeholder._dropListRef.enter(drag._dragRef, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }

  dropListDropped(event: any) {
    if (!this.target)
      return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement!;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source?.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex) {
      const elements = [...this.elements];
      moveItemInArray(elements, this.sourceIndex, this.targetIndex);
      console.log(elements);
      // this.onSortElements.emit(elements)
    }

  }



showPreview(image: string) {
    const img = [{
      src: image,
      width: '600px',
      height: '600px',
      alt: image
    }]
    if (img[0].src.includes('pdf') || isDocument(image) || isSpreadSheet(image) || isOtherFileType(image)) {
      window.open(img[0].src, '_blank')
    } else {
      this.nzImageService.preview(img, {nzZoom: 1, nzRotate: 0});
    }

  }

  setImageUrl(imageData: string) {
    return `http://100.42.69.119:3000/images/${imageData}`
  }

  indexOf(collection: any, node: any) {
    return Array.prototype.indexOf.call(collection, node);
  };

  /** Determines whether an event is a touch event. */
  isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
  }

      isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
      const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
      return y >= top && y <= bottom && x >= left && x <= right;
  }
}
