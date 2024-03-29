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
      realStateName: ['', Validators.required],
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
        if (this.isEditing) {
        this.adviserService.update(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/asesores-externos'])
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.adviserService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/asesores-externos'])
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


  getOwnerById(id: string) {
    this.adviserService.getById(id).subscribe(result => {
      this.form.get('firstName')?.patchValue(result.firstName);
      this.form.get('lastName')?.patchValue(result.lastName);
      this.form.get('email')?.patchValue(result.email);
      this.form.get('phone')?.patchValue(result.phone);
      this.form.get('id')?.patchValue(result.id);
    })
  }
}
