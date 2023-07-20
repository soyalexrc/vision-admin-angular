import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OwnerService} from "../../../core/services/owner.service";


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit{
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      phone: ['', Validators.required],
      birthday: ['', Validators.required],
      isInvestor: [false, Validators.required],
      type: ['Propietarios'],
      id: [null]
    })
  }

  submitForm(): void {
    console.log(this.form);
    if (this.form.valid) {
      this.ownerService.createOne(this.form.value).subscribe(result => {
        console.log(result)
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
