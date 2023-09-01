import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDynamicTable, ITableHeader} from "../../../core/interfaces/table";

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {

  tableData!: IDynamicTable;
  allHeaders: ITableHeader[] = [];
  dragTrace: {src: number, dest: number} = {src: -1, dest: -1};
  @Input() loading!: boolean;
  @Input() xScroll: string = '1150px';
  @Input() yScroll: string = '100%';
  @Input() changeActionTitle: string = '';
  @Input() linkActionTitle: string = '';
  @Input() pageIndex: number = 1;
  @Input() totalItems: number = 1;
  @Input() pageSize: number = 10;
  @Input() historyActionTitle: string = '';
  @Input() approveTitle: string = '';
  @Input() actionsFixed: boolean = false;
  @Input() hasEdit: boolean = true;
  @Input() hasDelete: boolean = true;
  @Input() changeAction: boolean = false;
  @Input() hasApprove: boolean = false;
  @Input() linkAction: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() historyAction: boolean = false;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>()
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>()
  @Output() onLink: EventEmitter<any> = new EventEmitter<any>()
  @Output() onHistory: EventEmitter<any> = new EventEmitter<any>()
  @Output() onEdit: EventEmitter<number> = new EventEmitter<number>()
  @Output() onPageIndexChange: EventEmitter<number> = new EventEmitter<number>()
  @Output() onChangeUserStatus: EventEmitter<any> = new EventEmitter<any>()
  @Output() onApprove: EventEmitter<any> = new EventEmitter<any>()

  listOfData: any[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.tableData = {headers: [], data: []}
  }

  render(headers: ITableHeader[], data: any[]) {
    this.tableData = {
      headers: headers.filter(x => x.isSelected),
      data
    };
    this.allHeaders = headers;
    this.resetDragTracer();
    this.changeDetector.detectChanges()
  }

  private resetDragTracer() {
    this.dragTrace = {src: -1, dest: -1}
  }

  handleChange($event: any) {
    console.log($event)
  }
}
