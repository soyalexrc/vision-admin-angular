import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../core/services/user.service";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment/moment";
import {PropertyService} from "../../../core/services/property.service";

interface Steps  {
  first: string,
  second: string,
  third: string,
  fourth: string,
  fifth: string,
  sixth: string,
  last: string
}


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  generalForm!: FormGroup;
  mediaForm!: FormGroup;
  locationForm!: FormGroup;
  attributesForm!: FormGroup;
  negotiationForm!: FormGroup;
  documentsForm!: FormGroup;
  publicationSourceForm!: FormGroup;
  personalForm!: FormGroup;
  socialForm!: FormGroup;
  loading = false;
  isEditing = false;
  id: any;
  index = 0;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.publicationSourceForm = this.fb.group({
      conlallave: [''],
      facebook: [''],
      instagram: [''],
      mercadolibre: [''],
      whatsapp: [''],
      tiktok: [''],
    })

    this.generalForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      distributionComments: [''],
      footageBuilding: [''],
      footageGround: [''],
      nomenclarure: [''],
      propertyCondition: [''],
      operationType: [''],
      property_status: [''],
      propertyType: [''],
    })

    this.locationForm = this.fb.group({
      country: ['Venezuela', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      municipality: ['', Validators.required],
      avenue: ['', Validators.required],
      street: ['', Validators.required],
      howToGet: [''],
      parkingLevel: [''],
      parkingNumber: [''],
      trunkLevel: [''],
      trunkNumber: [''],
      referencePoint: [''],
      floor: [''],
      location: ['A pie de calle', Validators.required],
      buildingNumber: [''],
      isClosedStreet: ['No'],
    })

    this.mediaForm = this.fb.group({
      images: this.fb.array([])
    })

    this.attributesForm = this.fb.group({
      attributes : this.fb.array([])
    })

    this.negotiationForm = this.fb.group({
      price: ['', Validators.required],
      attorneyCellPhone: ['', Validators.required],
      attorneyEmail: ['', Validators.required],
      attorneyFirstName: ['', Validators.required],
      attorneyLastName: ['', Validators.required],
      contactCellPhone: ['', Validators.required],
      contactEmail: ['', Validators.required],
      contactFirstName: ['', Validators.required],
      contactLastName: ['', Validators.required],
      birthday: ['', Validators.required],
      phone: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      comission: ['', Validators.required],
      partOfPayment: ['', Validators.required],
    })

    this.documentsForm = this.fb.group({
      files: this.fb.array([])
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
      data.birthday = moment(data.birthday).format('YYYY-MM-DD');
      if (this.isEditing) {
        this.propertyService.update(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se edito el usuario con exito!')
          this.router.navigate(['/usuarios'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.propertyService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo el usuario con exito!')
          this.router.navigate(['/usuarios'])
        }, () => {
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
    this.propertyService.getById(id).subscribe(result => {
      const user = result.recordset[0];
      this.generalForm.get('id')?.patchValue(user.id)
    })
  }

  onIndexChange(index: number): void {
    this.index = index;
  }


  getStatusBasedOnIndex(index: number): Steps {
    let steps: Steps = {
      first: '',
      second: '',
      third: '',
      fourth: '',
      fifth: '',
      sixth: '',
      last: ''
    }

    // initial state

    if (index === 0) steps = {first: 'process', second: 'wait', third: 'wait', fourth: 'wait', fifth: 'wait', sixth: 'wait', last: 'wait'}
    if (index === 1) steps = {first: 'finish', second: 'process', third: 'wait', fourth: 'wait', fifth: 'wait', sixth: 'wait', last: 'wait'}
    if (index === 2) steps = {first: 'finish', second: 'finish', third: 'process', fourth: 'wait', fifth: 'wait', sixth: 'wait', last: 'wait'}
    if (index === 3) steps = {first: 'finish', second: 'finish', third: 'finish', fourth: 'process', fifth: 'wait', sixth: 'wait', last: 'wait'}
    if (index === 4) steps = {first: 'finish', second: 'finish', third: 'finish', fourth: 'finish', fifth: 'process', sixth: 'wait', last: 'wait'}
    if (index === 5) steps = {first: 'finish', second: 'finish', third: 'finish', fourth: 'finish', fifth: 'finish', sixth: 'process', last: 'wait'}
    if (index === 6) steps = {first: 'finish', second: 'finish', third: 'finish', fourth: 'finish', fifth: 'finish', sixth: 'finish', last: 'process'}


    // There are errors

    if (this.generalForm.dirty && this.generalForm.invalid) steps.first = 'error'
    if (this.locationForm.dirty && this.locationForm.invalid) steps.second = 'error'
    if (this.mediaForm.dirty && this.mediaForm.invalid) steps.third = 'error'
    if (this.attributesForm.dirty && this.attributesForm.invalid) steps.fourth = 'error'
    if (this.negotiationForm.dirty && this.negotiationForm.invalid) steps.fifth = 'error'
    if (this.documentsForm.dirty && this.documentsForm.invalid) steps.sixth = 'error'
    if (this.publicationSourceForm.dirty && this.publicationSourceForm.invalid) steps.last = 'error'

    //  Form finished and valid

    if (this.generalForm.dirty && this.generalForm.valid) steps.first = 'finish'
    if (this.locationForm.dirty && this.locationForm.valid) steps.second = 'finish'
    if (this.mediaForm.dirty && this.mediaForm.valid) steps.third = 'finish'
    if (this.attributesForm.dirty && this.attributesForm.valid) steps.fourth = 'finish'
    if (this.negotiationForm.dirty && this.negotiationForm.valid) steps.fifth = 'finish'
    if (this.documentsForm.dirty && this.documentsForm.valid) steps.sixth = 'finish'
    if (this.publicationSourceForm.dirty && this.publicationSourceForm.valid) steps.last = 'finish'


    return steps
  }

  getFormValidation(form: FormGroup<any>) {
    Object.values(form.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  get images() {
    return this.mediaForm.controls["images"] as FormArray;
  }

  get files() {
    return this.documentsForm.controls["files"] as FormArray;
  }

  get attributes() {
    return this.attributesForm.controls["attributes"] as FormArray;
  }
}
