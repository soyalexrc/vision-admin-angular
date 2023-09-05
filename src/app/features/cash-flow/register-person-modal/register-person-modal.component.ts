import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OwnerService} from "../../../core/services/owner.service";
import {UiService} from "../../../core/services/ui.service";
import * as moment from "moment";
import {CashFlowService} from "../../../core/services/cash-flow.service";

@Component({
  selector: 'app-register-person-modal',
  templateUrl: './register-person-modal.component.html',
  styleUrls: ['./register-person-modal.component.scss']
})
export class RegisterPersonModalComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  @Output() onFinished: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cashflowService: CashFlowService,
    private uiService: UiService
  ) {
  }


  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      id: [null]
    })
  }


  handleOkModal(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      this.cashflowService.createPerson(data).subscribe(result => {
        this.uiService.createMessage('success', 'Se creo la persona con exito!')
        this.form.reset();
        this.onFinished.emit();
        this.onClose.emit();
      }, () => {
        this.loading = false
      }, () => {
        this.loading = false
      })

    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel() {
    this.form.reset();
    this.onCancel.emit(false)
  }
}
