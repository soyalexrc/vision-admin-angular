import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDynamicTable, ITableHeader} from "../../../core/interfaces/table";

@Component({
  selector: 'app-regular-table',
  templateUrl: './regular-table.component.html',
  styleUrls: ['./regular-table.component.scss']
})
export class RegularTableComponent implements OnInit {

  tableData!: IDynamicTable;
  allHeaders: ITableHeader[] = [];
  dragTrace: {src: number, dest: number} = {src: -1, dest: -1};
  @Input() loading!: boolean;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>()
  @Output() onEdit: EventEmitter<string | number> = new EventEmitter<string | number>()

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
