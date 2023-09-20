import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {UiService} from "../../../core/services/ui.service";

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent {

  @Input() title!: string;
  @Input() buttonText!: string;
  @Input() additionalButtonText!: string;
  @Input() additionalButtonIcon!: string;
  @Input() additionalButton: boolean = false;
  @Input() customRightSide: boolean = false;
  @Input() hasRefresh: boolean = true;
  @Output() onNewElement: EventEmitter<any> = new EventEmitter<any>()
  @Output() onRefresh: EventEmitter<any> = new EventEmitter<any>()
  @Output() onAdditionalAction: EventEmitter<any> = new EventEmitter<any>()
  @Input() showTotal = false;
  @Input() totalValue: any;

  constructor(public uiService: UiService) {
  }



}
