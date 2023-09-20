import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OwnerService} from "../../../core/services/owner.service";
import {UiService} from "../../../core/services/ui.service";
import * as moment from "moment";
import {AllyService} from "../../../core/services/ally.service";

@Component({
  selector: 'app-register-ally-modal',
  templateUrl: './register-ally-modal.component.html',
  styleUrls: ['./register-ally-modal.component.scss']
})
export class RegisterAllyModalComponent implements OnInit{
  form!: FormGroup;
  loading = false;
  @Output() onFinished: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private allyService: AllyService,
    private uiService: UiService
  ) {
  }


  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      phone: ['', Validators.required],
      id: [null]
    })
  }


  handleOkModal(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      this.allyService.createOne(data).subscribe(result => {
        this.uiService.createMessage('success', 'Se creo el aliado con exito!')
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
