import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-filter-date-selector',
  templateUrl: './filter-date-selector.component.html',
  styleUrls: ['./filter-date-selector.component.scss']
})
export class FilterDateSelectorComponent {
  @Input() date: any[] = []
  @Output() onChangeDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeSingleDate: EventEmitter<any> = new EventEmitter<any>();

  changeDate(date: Date) {
    this.onChangeDate.emit(date);
  }
  changeSingleDate(date: Date, at: 0 | 1) {
    this.onChangeSingleDate.emit({date, at});
  }

}
