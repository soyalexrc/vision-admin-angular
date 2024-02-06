import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import {UiService} from "../../../core/services/ui.service";

@Component({
  selector: 'app-register-property-modal',
  templateUrl: './register-property-modal.component.html',
  styleUrls: ['./register-property-modal.component.scss']
})
export class RegisterPropertyModalComponent implements OnInit{
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
      location: ['', Validators.required],
      id: [null]
    })
  }


  handleOkModal(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      this.cashflowService.createProperty(data).subscribe(result => {
        this.uiService.createMessage('success', 'Se creo la propiedad con exito!')
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
