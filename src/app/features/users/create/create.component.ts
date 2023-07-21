import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AllyService} from "../../../core/services/ally.service";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, AfterViewInit {
  generalForm!: FormGroup;
  personalForm!: FormGroup;
  socialForm!: FormGroup;
  loading = false;
  isEditing = false;
  id: any;
  index = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.socialForm = this.fb.group({
      socialFacebook: [''],
      socialInstagram: [''],
      socialTwitter: [''],
      socialYoutube: [''],
    })

    this.generalForm = this.fb.group({
      company: ['Vision Inmobiliaria', Validators.required],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      phonNumber1: ['', Validators.required],
      phonNumber2: [''],
      userType: ['', Validators.required],
      id: [null]
    })

    this.personalForm = this.fb.group({
      birthday: ['', Validators.required],
      profession: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      fiscalAddress: ['', Validators.required],
    })
  }

  ngAfterViewInit() {
    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getUserById(this.id)
    }
  }

  submitForm(): void {
    if (this.generalForm.valid && this.personalForm.valid && this.socialForm.valid) {
      this.loading = true;
      const data = {...this.generalForm.value, ...this.socialForm.value, ...this.personalForm.value};
      data.birthday = moment(data.birthday).format('YYYY-MM-DD');
      if (this.isEditing) {
        this.userService.update(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se edito el usuario con exito!')
          this.router.navigate(['/usuarios'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.userService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo el usuario con exito!')
          this.router.navigate(['/usuarios'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      }
    } else {
      Object.values(this.generalForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      Object.values(this.personalForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      Object.values(this.socialForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  getUserById(id: string) {
    this.userService.getById(id).subscribe(result => {
      const user = result.recordset[0];
      this.generalForm.get('company')?.patchValue(user.company)
      this.generalForm.get('username')?.patchValue(user.username)
      this.generalForm.get('firstName')?.patchValue(user.first_name)
      this.generalForm.get('lastName')?.patchValue(user.last_name)
      this.generalForm.get('password')?.patchValue(user.password)
      this.generalForm.get('email')?.patchValue(user.email)
      this.generalForm.get('phonNumber1')?.patchValue(user.phone_number1)
      this.generalForm.get('phonNumber2')?.patchValue(user.phone_number2)
      this.generalForm.get('userType')?.patchValue(user.user_type)
      this.personalForm.get('birthday')?.patchValue(user.birthday)
      this.personalForm.get('profession')?.patchValue(user.profession)
      this.personalForm.get('city')?.patchValue(user.city)
      this.personalForm.get('state')?.patchValue(user.state)
      this.personalForm.get('fiscalAddress')?.patchValue(user.fiscal_address)
      this.socialForm.get('socialFacebook')?.patchValue(user.social_facebook)
      this.socialForm.get('socialInstagram')?.patchValue(user.social_instagram)
      this.socialForm.get('socialTwitter')?.patchValue(user.social_twitter)
      this.socialForm.get('socialYoutube')?.patchValue(user.social_youtube)
      this.generalForm.get('id')?.patchValue(user.id)
    })
  }

  onIndexChange(index: number): void {
    this.index = index;
  }
}
