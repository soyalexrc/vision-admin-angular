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
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>()
  @Output() onEdit: EventEmitter<number> = new EventEmitter<number>()

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

}
