import {Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PropertyService} from "../../../core/services/property.service";
import {v4 as uuidv4} from 'uuid';
import {FileService} from "../../../core/services/file.service";
import {PropertyFull, PropertyType} from "../../../core/interfaces/property";
import {Subscription} from "rxjs";
import {Ally} from "../../../core/interfaces/ally";
import {AllyService} from "../../../core/services/ally.service";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";
import {Adviser} from "../../../core/interfaces/adviser";
import {AdviserService} from "../../../core/services/adviser.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";

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
  loading = false;
  loadingImage = false;
  loadingDocument = false;
  isEditing = false;
  id: any;
  index = 0;
  imagesSubscription = new Subscription();
  documentsSubscription = new Subscription();
  images: string[] = [];
  documents: string[] = [];

  allies: Ally[] = [];
  owners: Owner[] = [];
  advisers: Adviser[] = [];

  showRegisterOwnersModal = false;
  ownersLoading = true;
  firstRender = false;
  creatingFromStoredData = false;


  @ViewChild('imageInputFile') imageInputFile!: ElementRef<HTMLInputElement>
  @ViewChild('documentInputFile') documentInputFile!: ElementRef<HTMLInputElement>
  visitedImages = false;

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.saveTemporalChanges()
  }

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileService,
    private allyService: AllyService,
    private ownerService: OwnerService,
    private modal: NzModalService,
    private adviserService: AdviserService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.documentsSubscription = this.fileService.currentDocuments.subscribe(documents => {
      this.documents = documents;
    })
    this.imagesSubscription = this.fileService.currentImages.subscribe(images => {
      this.images = images;
    })

    this.buildForms();

    this.getAdvisers();
    this.getOwners();
    this.getAllies();


    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getUserById(this.id)
      this.firstRender = true;
    } else {
      if (localStorage.getItem('property_create_temporal')) {
        this.modal.confirm({
          nzClosable: false,
          nzCloseIcon: '',
          nzWidth: '600px',
          nzTitle: 'Atencion',
          nzContent: 'Existe informacion de la ultima propiedad que intentaste registrar, pero no completaste el proceso. Te gustaria completarlo ahora?. Si la respuesta es NO, se eliminaran los cambios guardados',
          nzCancelText: 'No, Eliminar cambios guardados',
          nzOkText: 'Si, Completar ahora',
          nzOnOk: () => new Promise((resolve, reject) => {
            this.recoverDataFromStorage();
            setTimeout(() => resolve(), 500);
          }),
          nzOnCancel: () => new Promise((resolve, reject) => {
            this.clearStorageData()
            setTimeout(() => resolve(), 500);
          }),
        })
      }
    }
  }

  ngOnDestroy() {
    this.fileService.cleanFiles();
    this.imagesSubscription.unsubscribe();
    this.documentsSubscription.unsubscribe();
  }

  private buildForms() {
    this.publicationSourceForm = this.fb.group({
      conlallave: [false],
      facebook: [false],
      instagram: [false],
      mercadolibre: [false],
      whatsapp: [false],
      tiktok: [false],
    })

    this.generalForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      distributionComments: [''],
      footageBuilding: [''],
      footageGround: [''],
      nomenclature: [''],
      propertyCondition: [''],
      operationType: ['', Validators.required],
      status: ['Incompleto'],
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
      owner: ['', Validators.required],
      attorneyPhone: ['', Validators.required],
      attorneyEmail: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      attorneyFirstName: ['', Validators.required],
      attorneyLastName: ['', Validators.required],
      contactPhone: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
      contactFirstName: ['', Validators.required],
      contactLastName: ['', Validators.required],
      minimumNegotiation: [''],
      reasonToSellOrRent: [''],
      externalCapacitor: [''],
      ally: [''],
      partOfPayment: [''],
    })

    this.documentsForm = this.fb.group({
      files: this.fb.array([])
    })
  }

  submitForm(): void {
    console.log({
      property: this.generalForm.value,
      location: this.locationForm.value,
      clientData: this.negotiationForm.value,
      images: this.images,
      files: this.documents,
      publicationSource: this.publicationSourceForm.value,
      attributes: this.attributes.value
    })
    if (this.generalForm.valid && this.locationForm.valid && this.negotiationForm.valid) {
      this.loading = true;
      const data = {
        id: this.id,
        generalInformation: this.generalForm.value,
        locationInformation: this.locationForm.value,
        negotiationInformation: this.negotiationForm.value,
        images: this.images,
        files: this.documents,
        publicationSource: this.publicationSourceForm.value,
        attributes: this.attributes.value,
        user_id: this.userService.currentUser.value.id,
        owner_id: this.negotiationForm.get('owner')?.value,
        ally_id: this.negotiationForm.get('ally')?.value === '' ? null : this.negotiationForm.get('ally')?.value,
      };
      if (this.isEditing) {
        this.propertyService.update(data as PropertyFull).subscribe(result => {
          this.uiService.createMessage('success', 'Se edito la propiedad con exito!')
          this.router.navigate(['/propiedades'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.propertyService.createOne(data as PropertyFull).subscribe(result => {
          this.uiService.createMessage('success', 'Se creo la propiedad con exito!')
          this.router.navigate(['/propiedades'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      }
    } else {
      this.getFormValidation(this.generalForm)
      this.getFormValidation(this.locationForm)
      this.getFormValidation(this.negotiationForm)
    }
  }


  getUserById(id: string) {
    this.propertyService.getById(id).subscribe(result => {
      this.generalForm.get('code')?.patchValue(result.generalInformation.code);
      this.generalForm.get('nomenclature')?.patchValue(result.generalInformation.nomenclature);
      this.generalForm.get('footageBuilding')?.patchValue(result.generalInformation.footageBuilding);
      this.generalForm.get('footageGround')?.patchValue(result.generalInformation.footageGround);
      this.generalForm.get('distributionComments')?.patchValue(result.generalInformation.distributionComments);
      this.generalForm.get('description')?.patchValue(result.generalInformation.description);
      this.generalForm.get('propertyType')?.patchValue(result.generalInformation.propertyType);
      this.generalForm.get('operationType')?.patchValue(result.generalInformation.operationType);
      this.generalForm.get('propertyCondition')?.patchValue(result.generalInformation.propertyCondition);

      this.locationForm.get('city')?.patchValue(result.locationInformation.city);
      this.locationForm.get('state')?.patchValue(result.locationInformation.state);
      this.locationForm.get('country')?.patchValue(result.locationInformation.country);
      this.locationForm.get('municipality')?.patchValue(result.locationInformation.municipality);
      this.locationForm.get('avenue')?.patchValue(result.locationInformation.avenue);
      this.locationForm.get('street')?.patchValue(result.locationInformation.street);
      this.locationForm.get('floor')?.patchValue(result.locationInformation.floor);
      this.locationForm.get('buildingNumber')?.patchValue(result.locationInformation.buildingNumber);
      this.locationForm.get('howToGet')?.patchValue(result.locationInformation.howToGet);
      this.locationForm.get('urbanization')?.patchValue(result.locationInformation.urbanization);
      this.locationForm.get('trunkNumber')?.patchValue(result.locationInformation.trunkNumber);
      this.locationForm.get('trunkLevel')?.patchValue(result.locationInformation.trunkLevel);
      this.locationForm.get('referencePoint')?.patchValue(result.locationInformation.referencePoint);
      this.locationForm.get('buildingShoppingcenter')?.patchValue(result.locationInformation.buildingShoppingCenter);

      result.attributes.forEach(attr => {
        this.attributes.push(this.fb.group({
          id: [attr.id],
          propertyType: [attr.propertyType],
          formType: [attr.formType],
          label: [attr.label],
          category: [attr.category],
          placeholder: [attr.placeholder],
          options: [attr.options],
          value: [attr.value],
        }))
      })

      result.images.forEach(image => {
        this.fileService.storeImage(image);
      });

      this.negotiationForm.get('price')?.patchValue(result.negotiationInformation.price);
      this.negotiationForm.get('partOfPayment')?.patchValue(result.negotiationInformation.partOfPayment);
      this.negotiationForm.get('minimumNegotiation')?.patchValue(result.negotiationInformation.minimumNegotiation);
      this.negotiationForm.get('reasonToSellOrRent')?.patchValue(result.negotiationInformation.reasonToSellOrRent);
      this.negotiationForm.get('ally')?.patchValue(result.ally_id);
      this.negotiationForm.get('externalCapacitor')?.patchValue(result.negotiationInformation.externalCapacitor);
      this.negotiationForm.get('owner')?.patchValue(result.owner_id);
      this.negotiationForm.get('attorneyEmail')?.patchValue(result.negotiationInformation.attorneyEmail);
      this.negotiationForm.get('attorneyFirstName')?.patchValue(result.negotiationInformation.attorneyFirstName);
      this.negotiationForm.get('attorneyLastName')?.patchValue(result.negotiationInformation.attorneyLastName);
      this.negotiationForm.get('attorneyPhone')?.patchValue(result.negotiationInformation.attorneyPhone);
      this.negotiationForm.get('contactEmail')?.patchValue(result.negotiationInformation.contactEmail);
      this.negotiationForm.get('contactFirstName')?.patchValue(result.negotiationInformation.contactFirstName);
      this.negotiationForm.get('contactLastName')?.patchValue(result.negotiationInformation.contactLastName);
      this.negotiationForm.get('contactPhone')?.patchValue(result.negotiationInformation.contactPhone);

      result.files.forEach(file => {
        this.fileService.storeDocument(file);
      });

      this.publicationSourceForm.get('conlallave')?.patchValue(result.publicationSource.conlallave)
      this.publicationSourceForm.get('facebook')?.patchValue(result.publicationSource.facebook)
      this.publicationSourceForm.get('instagram')?.patchValue(result.publicationSource.instagram)
      this.publicationSourceForm.get('tiktok')?.patchValue(result.publicationSource.tiktok)
      this.publicationSourceForm.get('mercadolibre')?.patchValue(result.publicationSource.mercadolibre)
      this.publicationSourceForm.get('whatsapp')?.patchValue(result.publicationSource.whatsapp)

    })
  }

  recoverDataFromStorage() {
    this.creatingFromStoredData = true;
    const data = JSON.parse(localStorage.getItem('property_create_temporal')!);
    console.log(data);
    this.generalForm.get('code')?.patchValue(data.generalInformation.code);
    this.generalForm.get('nomenclature')?.patchValue(data.generalInformation.nomenclature);
    this.generalForm.get('footageBuilding')?.patchValue(data.generalInformation.footageBuilding);
    this.generalForm.get('footageGround')?.patchValue(data.generalInformation.footageGround);
    this.generalForm.get('distributionComments')?.patchValue(data.generalInformation.distributionComments);
    this.generalForm.get('description')?.patchValue(data.generalInformation.description);
    this.generalForm.get('propertyType')?.patchValue(data.generalInformation.propertyType);
    this.generalForm.get('operationType')?.patchValue(data.generalInformation.operationType);
    this.generalForm.get('propertyCondition')?.patchValue(data.generalInformation.propertyCondition);

    this.locationForm.get('city')?.patchValue(data.locationInformation.city);
    this.locationForm.get('state')?.patchValue(data.locationInformation.state);
    this.locationForm.get('country')?.patchValue(data.locationInformation.country);
    this.locationForm.get('municipality')?.patchValue(data.locationInformation.municipality);
    this.locationForm.get('avenue')?.patchValue(data.locationInformation.avenue);
    this.locationForm.get('street')?.patchValue(data.locationInformation.street);
    this.locationForm.get('floor')?.patchValue(data.locationInformation.floor);
    this.locationForm.get('buildingNumber')?.patchValue(data.locationInformation.buildingNumber);
    this.locationForm.get('hotToGet')?.patchValue(data.locationInformation.howToGet);
    this.locationForm.get('urbanization')?.patchValue(data.locationInformation.urbanization);
    this.locationForm.get('trunkNumber')?.patchValue(data.locationInformation.trunkNumber);
    this.locationForm.get('trunkLevel')?.patchValue(data.locationInformation.trunkLevel);
    this.locationForm.get('referencePoint')?.patchValue(data.locationInformation.referencePoint);
    this.locationForm.get('buildingShoppingcenter')?.patchValue(data.locationInformation.buildingShoppingCenter);

    this.negotiationForm.get('price')?.patchValue(data.negotiationInformation.price);
    this.negotiationForm.get('partOfPayment')?.patchValue(data.negotiationInformation.partOfPayment);
    this.negotiationForm.get('minimunNegotiation')?.patchValue(data.negotiationInformation.minimumNegotiation);
    this.negotiationForm.get('reasonToSellOrRent')?.patchValue(data.negotiationInformation.reasonToSellOrRent);
    this.negotiationForm.get('externalCapacitor')?.patchValue(data.negotiationInformation.externalCapacitor);
    this.negotiationForm.get('owner')?.patchValue(data.negotiationInformation.owner);
    this.negotiationForm.get('attorneyEmail')?.patchValue(data.negotiationInformation.attorneyEmail);
    this.negotiationForm.get('attorneyFirstName')?.patchValue(data.negotiationInformation.attorneyFirstName);
    this.negotiationForm.get('attorneyLastName')?.patchValue(data.negotiationInformation.attorneyLastName);
    this.negotiationForm.get('attorneyPhone')?.patchValue(data.negotiationInformation.attorneyPhone);
    this.negotiationForm.get('contactEmail')?.patchValue(data.negotiationInformation.contactEmail);
    this.negotiationForm.get('contactFirstName')?.patchValue(data.negotiationInformation.contactFirstName);
    this.negotiationForm.get('contactLastName')?.patchValue(data.negotiationInformation.contactLastName);
    this.negotiationForm.get('contactPhone')?.patchValue(data.negotiationInformation.contactPhone);

    this.publicationSourceForm.get('conlallave')?.patchValue(data.publicationSource.conlallave)
    this.publicationSourceForm.get('facebook')?.patchValue(data.publicationSource.facebook)
    this.publicationSourceForm.get('instagram')?.patchValue(data.publicationSource.instagram)
    this.publicationSourceForm.get('tiktok')?.patchValue(data.publicationSource.tiktok)
    this.publicationSourceForm.get('mercadolibre')?.patchValue(data.publicationSource.mercadolibre)
    this.publicationSourceForm.get('whatsapp')?.patchValue(data.publicationSource.whatsapp)

    data.files.forEach((file: string) => {
      this.fileService.storeDocument(file);
    });

    data.images.forEach((file: string) => {
      this.fileService.storeImage(file);
    });

    data.attributes.forEach((attr: any) => {
      this.attributes.push(this.fb.group({
        id: [attr.id],
        propertyType: [attr.propertyType],
        formType: [attr.formType],
        label: [attr.label],
        category: [attr.category],
        placeholder: [attr.placeholder],
        options: [attr.options],
        value: [attr.value],
      }))
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

  async handleUploadImage(event: any) {
    this.loadingImage = true;

    const {files} = event.target;

    const forLoop = async () => {
      for (let i = 0; i < files.length; i++) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = async () => {
            this.fileService.uploadPropertyImage(files[i], this.generalForm.get('code')?.value).subscribe(result => {
                this.fileService.storeImage(result.secureUrl)
              },
              () => {
                this.loadingImage = false;
                this.uiService.createMessage('error', 'No se logro subir la imagen, ocurrio un error. Intenalo de nuevo')
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

  async handleUploadFile(event: any) {
    this.loadingImage = true;

    const {files} = event.target;

    const forLoop = async () => {
      for (let i = 0; i < files.length; i++) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = async () => {
            this.fileService.uploadPropertyFile(files[i], this.generalForm.get('code')?.value).subscribe(result => {
                this.fileService.storeDocument(result.secureUrl)
              },
              () => {
                this.loadingImage = false;
                this.uiService.createMessage('error', 'No se logro subir la imagen, ocurrio un error. Intenalo de nuevo')
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

  handleDeleteImage(image: string, type: string) {
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

  handleSelectPropertyType(propertyType: PropertyType) {
    this.clearFormArray(this.attributes);
    if (!propertyType || this.firstRender || this.creatingFromStoredData) return;
    this.propertyService.getAttributesByPropertyType(propertyType).subscribe(result => {
      this.firstRender = false;
      result.forEach(attr => {
        this.attributes.push(this.fb.group({
          id: [attr.id],
          propertyType: [attr.propertyType],
          formType: [attr.formType],
          label: [attr.label],
          category: [attr.category],
          placeholder: [attr.placeholder],
          options: [attr.options],
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

  handleSortElements(images: string[], type: string) {
    if (type === 'image') {
      this.fileService.setReorderImages(images)
    } else {
      this.fileService.setReorderDocuments(images)
    }
  }


  getOwners() {
    this.ownersLoading = true;
    this.ownerService.getAll().subscribe(result => {
      this.owners = result.rows;
    }, () => {
      this.ownersLoading = false;
    }, () => {
      this.ownersLoading = false;
    })
  }

  getAllies() {
    this.allyService.getAll(1, 1).subscribe(result => {
      this.allies = result.rows;
    })
  }

  getAdvisers() {
    this.adviserService.getAll(1, 1).subscribe(result => {
      this.advisers = result.rows;
    })
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

    if (this.index === 1) {
      bool = this.locationForm.invalid
    }

    if (this.index === 2) {
      bool = this.images.length < 1
    }

    if (this.index === 3) {
      bool = false
    }

    if (this.index === 4) {
      bool = this.negotiationForm.invalid;
    }

    if (this.index === 5) {
      bool = false
    }

    return bool;
  }

  saveTemporalChanges() {
    const data = {
      generalInformation: this.generalForm.value,
      locationInformation: this.locationForm.value,
      negotiationInformation: this.negotiationForm.value,
      images: this.images,
      files: this.documents,
      publicationSource: this.publicationSourceForm.value,
      attributes: this.attributes.value
    };
    if (!this.isEditing && (this.generalForm.touched || this.locationForm.touched || this.negotiationForm.touched || this.publicationSourceForm.touched || this.attributesForm.touched)) {
      localStorage.setItem('property_create_temporal', JSON.stringify(data));
    }
  }

  clearStorageData() {
    this.fileService.deleteTemporalImages();
    this.fileService.deleteTemporalFiles();
    localStorage.removeItem('property_create_temporal')
  }
}
