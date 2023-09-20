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
      birthdate: [null],
      isInvestor: [false, Validators.required],
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
      data.birthdate = data.birthdate ? moment(data.birthdate).format('YYYY-MM-DD') : null;
      if (this.isEditing) {
        this.ownerService.update(data).subscribe(result => {
          this.uiService.createMessage('success', result.message);
          this.router.navigate(['/propietarios'])
        }, (error) => {
          this.uiService.createMessage('error', error.error.message);
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.ownerService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/propietarios'])
        }, (error) => {
          this.uiService.createMessage('error', error.error.message);
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
      this.form.get('firstName')?.patchValue(result.firstName);
      this.form.get('lastName')?.patchValue(result.lastName);
      this.form.get('isInvestor')?.patchValue(result.isInvestor);
      this.form.get('birthdate')?.patchValue(result.birthdate);
      this.form.get('email')?.patchValue(result.email);
      this.form.get('phone')?.patchValue(result.phone);
      this.form.get('id')?.patchValue(result.id);
    })
  }

}
