import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../core/services/user.service";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment/moment";
import {PropertyService} from "../../../core/services/property.service";
import {v4 as uuidv4} from 'uuid';
import {FileService} from "../../../core/services/file.service";
import {Category, FormType, Image, PropertyType} from "../../../core/interfaces/property";
import {Subscription} from "rxjs";
import {NzImageService} from "ng-zorro-antd/image";

interface Steps {
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
export class CreateComponent implements OnInit, OnDestroy {
  generalForm!: FormGroup;
  locationForm!: FormGroup;
  attributesForm!: FormGroup;
  negotiationForm!: FormGroup;
  documentsForm!: FormGroup;
  publicationSourceForm!: FormGroup;
  personalForm!: FormGroup;
  socialForm!: FormGroup;
  loading = false;
  loadingImage = false;
  loadingDocument = false;
  isEditing = false;
  id: any;
  index = 0;
  imagesSubscription = new Subscription();
  documentsSubscription = new Subscription();
  images: Image[] = [];
  documents: Image[] = [];

  @ViewChild('imageInputFile') imageInputFile!: ElementRef<HTMLInputElement>
  @ViewChild('documentInputFile') documentInputFile!: ElementRef<HTMLInputElement>
  visitedImages = false;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileService,
    private nzImageService: NzImageService
  ) {
  }

  ngOnInit() {
    this.documentsSubscription = this.fileService.currentDocuments.subscribe(documents => {
      this.documents = documents;
    })
    this.imagesSubscription = this.fileService.currentImages.subscribe(images => {
      this.images = images;
    })
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
      operationType: ['' ,Validators.required],
      property_status: [''],
      propertyType: ['', Validators.required],
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

    this.attributesForm = this.fb.group({
      attributes: this.fb.array([])
    })

    this.negotiationForm = this.fb.group({
      price: ['', Validators.required],
      client: ['', Validators.required],
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
      minimunNegotiation: [''],
      reasonToSellOrRent: [''],
      externalCapacitor: [''],
      ally: [''],
      partOfPayment: ['', Validators.required],
      adviser: ['', Validators.required],
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

  ngOnDestroy() {
    this.fileService.cleanFiles();
    this.imagesSubscription.unsubscribe();
    this.documentsSubscription.unsubscribe();
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

    if (index === 0) steps = {
      first: 'process',
      second: 'wait',
      third: 'wait',
      fourth: 'wait',
      fifth: 'wait',
      sixth: 'wait',
      last: 'wait'
    }
    if (index === 1) steps = {
      first: 'finish',
      second: 'process',
      third: 'wait',
      fourth: 'wait',
      fifth: 'wait',
      sixth: 'wait',
      last: 'wait'
    }
    if (index === 2) {
      this.visitedImages = true;
      steps = {
        first: 'finish',
        second: 'finish',
        third: 'process',
        fourth: 'wait',
        fifth: 'wait',
        sixth: 'wait',
        last: 'wait'
      }
    }
    if (index === 3) steps = {
      first: 'finish',
      second: 'finish',
      third: 'finish',
      fourth: 'process',
      fifth: 'wait',
      sixth: 'wait',
      last: 'wait'
    }
    if (index === 4) steps = {
      first: 'finish',
      second: 'finish',
      third: 'finish',
      fourth: 'finish',
      fifth: 'process',
      sixth: 'wait',
      last: 'wait'
    }
    if (index === 5) steps = {
      first: 'finish',
      second: 'finish',
      third: 'finish',
      fourth: 'finish',
      fifth: 'finish',
      sixth: 'process',
      last: 'wait'
    }
    if (index === 6) steps = {
      first: 'finish',
      second: 'finish',
      third: 'finish',
      fourth: 'finish',
      fifth: 'finish',
      sixth: 'finish',
      last: 'process'
    }


    // There are errors

    if (this.generalForm.dirty && this.generalForm.invalid) steps.first = 'error'
    if (this.locationForm.dirty && this.locationForm.invalid) steps.second = 'error'
    if (this.images.length < 1 && this.visitedImages) steps.third = 'error'
    if (this.attributesForm.dirty && this.attributesForm.invalid) steps.fourth = 'error'
    if (this.negotiationForm.dirty && this.negotiationForm.invalid) steps.fifth = 'error'
    if (this.documentsForm.dirty && this.documentsForm.invalid) steps.sixth = 'error'
    if (this.publicationSourceForm.dirty && this.publicationSourceForm.invalid) steps.last = 'error'

    //  Form finished and valid

    if (this.generalForm.dirty && this.generalForm.valid) steps.first = 'finish'
    if (this.locationForm.dirty && this.locationForm.valid) steps.second = 'finish'
    if (this.images.length > 0) steps.third = 'finish'
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
        control.updateValueAndValidity({onlySelf: true});
      }
    });
  }

  get attributes() {
    return this.attributesForm.controls["attributes"] as FormArray;
  }

  async handleUploadImage(event: any, type: string) {
    this.loadingImage = true;

    let obj: any = {
      id: '',
      imageType: '',
      imageData: ''
    }
    const {files} = event.target;

    const forLoop = async () => {
      for (let i = 0; i < files.length; i++) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = async () => {
            obj.imageType = files[i].type;
            obj.imageData = reader.result;
            obj.id = uuidv4();
            this.fileService.uploadFile(obj).subscribe(result => {
                if (type === 'image') {
                  this.fileService.storeImage({
                    id: result,
                    imageData: result,
                    imageType: files[i].type
                  })
                } else {
                  this.fileService.storeDocument({
                    id: result,
                    imageData: result,
                    imageType: files[i].type
                  })
                }
              },
              () => {
              },
              () => {
                if (i === files.length - 1) {
                  this.loadingImage = false;
                }
              }
            )
          }
        } catch (e) {
        }
      }
    }
    await forLoop();
  }

  handleDeleteImage(image: Image, type: string) {
    if (type === 'image') {
      this.fileService.deleteImage(image);
    } else {
      this.fileService.deleteDocument(image);
    }
  }


  clickInputFile(type: string) {
    if (type === 'image') {
      this.imageInputFile?.nativeElement.click();
    } else {
      this.documentInputFile?.nativeElement.click();
    }
  }

  setImageUrl(imageData: string) {
    return `http://100.42.69.119:3000/images/${imageData}`
  }

  showPreview(image: Image) {
    // const imgs = this.images.map(img => ({
    //   src: this.setImageUrl(img.imageData),
    //   width: '600px',
    //   height: '600px',
    //   alt: 'sample'
    // }))
    const img = [{
      src: this.setImageUrl(image.imageData),
      width: '600px',
      height: '600px',
      alt: 'sample'
    }]
    this.nzImageService.preview(img, {nzZoom: 1, nzRotate: 0});
  }

  handleSelectPropertyType(propertyType: PropertyType) {
    this.clearFormArray(this.attributes);
    this.propertyService.getAttributesByPropertyType(propertyType).subscribe(result => {
      result.forEach(attr => {
        this.attributes.push(this.fb.group({
          id: [attr.id],
          property_type: [attr.property_type],
          form_type: [attr.form_type],
          label: [attr.label],
          category: [attr.category],
          placeholder: [attr.placeholder],
          values: [attr.values],
          value: [null],
        }))
      })
    })
  }

  getFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  handleGoToSelectPropertyType() {
    this.index = 0;
    this.generalForm.get('propertyType')?.markAsDirty();
  }
}
