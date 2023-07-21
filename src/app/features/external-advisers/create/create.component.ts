import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";
import {AdviserService} from "../../../core/services/adviser.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditing = false;
  id: any;
  constructor(
    private fb: FormBuilder,
    private adviserService: AdviserService,
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
      isInvestor: [false],
      type: ['Asesores Externos'],
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
        this.adviserService.update(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se edito el asesor con exito!')
          this.router.navigate(['/asesores-externos'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.adviserService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo el asesor con exito!')
          this.router.navigate(['/asesores-externos'])
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
    this.adviserService.getById(id).subscribe(result => {
      const adviser = result.recordset[0];
      this.form.get('firstName')?.patchValue(adviser.first_name);
      this.form.get('lastName')?.patchValue(adviser.last_name);
      this.form.get('isInvestor')?.patchValue(adviser.isInvestor);
      this.form.get('birthday')?.patchValue(adviser.birthday);
      this.form.get('email')?.patchValue(adviser.email);
      this.form.get('phone')?.patchValue(adviser.phone);
      this.form.get('id')?.patchValue(adviser.id);
    })
  }
}
