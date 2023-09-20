import {Component, OnInit} from '@angular/core';
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
export class CreateComponent implements OnInit{
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
      birthDate: [null],
      id: [null]
    })

    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getAlly(this.id)
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      data.birthDate = data.birthDate ?  moment(data.birthDate).format('YYYY-MM-DD') : null;
      if (this.isEditing) {
        this.allyService.update(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/aliados'])
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.allyService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/aliados'])
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
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


  getAlly(id: string) {
    this.allyService.getById(id).subscribe(result => {
      this.form.get('firstName')?.patchValue(result.firstName);
      this.form.get('lastName')?.patchValue(result.lastName);
      this.form.get('birthday')?.patchValue(result.birthDate);
      this.form.get('email')?.patchValue(result.email);
      this.form.get('phone')?.patchValue(result.phone);
      this.form.get('id')?.patchValue(result.id);
    })
  }

}
