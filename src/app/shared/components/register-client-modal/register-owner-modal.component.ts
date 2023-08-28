import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment/moment";
import {OwnerService} from "../../../core/services/owner.service";
import {UiService} from "../../../core/services/ui.service";

@Component({
  selector: 'app-register-owner-modal',
  templateUrl: './register-owner-modal.component.html',
  styleUrls: ['./register-owner-modal.component.scss']
})
export class RegisterOwnerModalComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  @Output() onFinished: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private uiService: UiService
  ) {
  }


  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      phone: ['', Validators.required],
      birthdate: ['', Validators.required],
      isInvestor: [false, Validators.required],
      id: [null]
    })
  }


  handleOkModal(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      data.birthdate = moment(data.birthdate).format('YYYY-MM-DD');
        this.ownerService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo el propietario con exito!')
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
}
