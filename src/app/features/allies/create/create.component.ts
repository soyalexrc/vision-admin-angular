import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment/moment";
import {AllyService} from "../../../core/services/ally.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  form!: FormGroup;
  loading = false;
  isEditing = false;
  id: any;
  constructor(
    private fb: FormBuilder,
    private allyService: AllyService,
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
      type: ['Aliados'],
      id: [null]
    })
  }

  ngAfterViewInit() {
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
        this.allyService.update(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se edito el aliado con exito!')
          this.router.navigate(['/aliados'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.allyService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo el aliado con exito!')
          this.router.navigate(['/aliados'])
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
    this.allyService.getById(id).subscribe(result => {
      const ally = result.recordset[0];
      this.form.get('firstName')?.patchValue(ally.first_name);
      this.form.get('lastName')?.patchValue(ally.last_name);
      this.form.get('isInvestor')?.patchValue(ally.isInvestor);
      this.form.get('birthday')?.patchValue(ally.birthday);
      this.form.get('email')?.patchValue(ally.email);
      this.form.get('phone')?.patchValue(ally.phone);
      this.form.get('id')?.patchValue(ally.id);
    })
  }

}
