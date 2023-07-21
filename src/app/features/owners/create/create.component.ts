import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OwnerService} from "../../../core/services/owner.service";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit{
  form!: FormGroup;
  loading = false;
  isEditing = false;
  id: any;
  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute
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

    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getOwnerById(this.id)
    }
  }


  submitForm(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      data.birthday = moment(data.birthday).format('YYYY-MM-DD');
      data.isInvestor = data.isInvestor ? 'Si' : 'No';
      if (this.isEditing) {
        this.ownerService.update(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se edito el propietario con exito!')
          this.router.navigate(['/propietarios'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.ownerService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo el propietario con exito!')
          this.router.navigate(['/propietarios'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      }
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  getOwnerById(id: string) {
    this.ownerService.getById(id).subscribe(result => {
      const owner = result.recordset[0];
      this.form.get('firstName')?.patchValue(owner.first_name);
      this.form.get('lastName')?.patchValue(owner.last_name);
      this.form.get('isInvestor')?.patchValue(owner.isInvestor);
      this.form.get('birthday')?.patchValue(owner.birthday);
      this.form.get('email')?.patchValue(owner.email);
      this.form.get('phone')?.patchValue(owner.phone);
      this.form.get('id')?.patchValue(owner.id);
    })
  }

}
