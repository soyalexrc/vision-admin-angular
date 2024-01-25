import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";
import {UserService} from "../../../core/services/user.service";
import {decryptValue, encryptValue} from "../../../shared/utils/crypto";
import {Error} from "../../../core/interfaces/generics";

interface Steps {
  first: string,
  second: string,
  last: string
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
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
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.socialForm = this.fb.group({
      facebook: [''],
      instagram: [''],
      twitter: [''],
      youtube: [''],
      tiktok: [''],
    })

    this.generalForm = this.fb.group({
      company: ['Vision Inmobiliaria', Validators.required],
      username: ['', Validators.required],
      joinDate: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      corporateEmail: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      mainPhone: ['', Validators.required],
      secondaryPhone: [''],
      userType: ['', Validators.required],
      userLevel: [{value: '', disabled: true}],
      userCommission: [0],
      id: [null],
      isActive: [true]
    })

    this.personalForm = this.fb.group({
      birthDate: [null],
      profession: [''],
      city: [''],
      state: [''],
      address: [''],
      image: [''],
    })

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
      data.birthDate = data.birthDate ? moment(data.birthday).format('YYYY-MM-DD') : null;
      data.joinDate = moment(data.joinDate).format('YYYY-MM-DD');
      data.userCommission = data.userLevel === 'Asesor Diamante' ? 80 : data.userLevel === 'Asesor Estrella' ? 70 : data.userLevel === 'Asesor Destacado' ? 60 : data.userLevel === 'Asesor Emprendedor' ? 50 : 0;
      data.userLevel = this.generalForm.get('userLevel')?.value || '';
      if (this.isEditing) {
        this.userService.update(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/usuarios'])
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.userService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/usuarios'])
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
          this.loading = false
        }, () => {
          this.loading = false
        })
      }
    } else {
      this.getFormValidation(this.generalForm)
      this.getFormValidation(this.personalForm)
      this.getFormValidation(this.socialForm)
    }
  }


  getUserById(id: string) {
    this.generalForm.get('password')?.clearValidators()
    this.userService.getById(id).subscribe(result => {
      this.generalForm.get('username')?.patchValue(result.username)
      this.generalForm.get('firstName')?.patchValue(result.firstName)
      this.generalForm.get('lastName')?.patchValue(result.lastName)
      this.generalForm.get('email')?.patchValue(result.email)
      this.generalForm.get('corporateEmail')?.patchValue(result.corporateEmail)
      this.generalForm.get('password')?.patchValue(result.password)
      this.generalForm.get('mainPhone')?.patchValue(result.mainPhone)
      this.generalForm.get('secondaryPhone')?.patchValue(result.secondaryPhone)
      this.generalForm.get('userType')?.patchValue(result.userType)
      this.generalForm.get('userLevel')?.patchValue(result.userLevel)
      this.generalForm.get('isActive')?.patchValue(result.isActive)
      this.generalForm.get('joinDate')?.patchValue(result.joinDate)
      this.personalForm.get('birthDate')?.patchValue(result.birthDate)
      this.personalForm.get('profession')?.patchValue(result.profession)
      this.personalForm.get('city')?.patchValue(result.city)
      this.personalForm.get('state')?.patchValue(result.state)
      this.personalForm.get('address')?.patchValue(result.address)
      this.socialForm.get('facebook')?.patchValue(result.facebook)
      this.socialForm.get('instagram')?.patchValue(result.instagram)
      this.socialForm.get('twitter')?.patchValue(result.twitter)
      this.socialForm.get('youtube')?.patchValue(result.youtube)
      this.socialForm.get('tiktok')?.patchValue(result.tiktok)
      this.generalForm.get('id')?.patchValue(result.id)
    })
  }

  onIndexChange(index: number): void {
    this.index = index;
  }


  getStatusBasedOnIndex(index: number): Steps {
    let steps: Steps = {
      first: '',
      second: '',
      last: ''
    }

    // initial state

    if (index === 0) {
      steps = {
        first: 'process',
        second: 'wait',
        last: 'wait'
      }
    }
    if (index === 1) {
      steps = {
        first: 'finish',
        second: 'process',
        last: 'wait'
      }
    }
    if (index === 2) {
      steps = {
        first: 'finish',
        second: 'finish',
        last: 'wait'
      }
    }


    // There are errors

    if (this.generalForm.dirty && this.generalForm.invalid) {
      steps.first = 'error'
    }
    if (this.personalForm.dirty && this.personalForm.invalid) {
      steps.second = 'error'
    }
    if (this.socialForm.dirty && this.socialForm.invalid) {
      steps.last = 'error'
    }

    //  Form finished and valid

    if (this.generalForm.dirty && this.generalForm.valid) {
      steps.first = 'finish'
    }
    if (this.personalForm.dirty && this.personalForm.valid) {
      steps.second = 'finish'
    }
    if (this.socialForm.dirty && this.socialForm.valid) {
      steps.last = 'finish'
    }

    return steps
  }

  getFormValidation(form: FormGroup<any>) {
    Object.values(form.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({onlySelf: true});
      }
    });
  }

  handleSelectUserType(value: string) {
    if (value === 'Asesor inmobiliario') {
      console.log(value)
      this.generalForm.get('userLevel')?.enable();
    } else {
      this.generalForm.get('userLevel')?.disable();
      this.generalForm.get('userLevel')?.setValue('');
    }
  }

  goPrev() {
    this.index -= 1;
  }

  goNext() {
    this.index += 1;
  }

  handleGoNextButtonDisabled(): boolean {

    let bool = true;

    if (this.index === 0) {
      bool = this.generalForm.invalid
    }



    if (this.index === 1 ) {
      bool = this.personalForm.invalid
    }

    if (this.index === 2 ) {
      bool = this.socialForm.invalid
    }

    return bool;
  }
}
