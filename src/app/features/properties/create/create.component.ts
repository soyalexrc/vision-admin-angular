import {Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterEvent} from "@angular/router";
import {PropertyService} from "../../../core/services/property.service";
import {FileService} from "../../../core/services/file.service";
import {PropertyFull, PropertyType} from "../../../core/interfaces/property";
import {filter, Subscription} from "rxjs";
import {Ally} from "../../../core/interfaces/ally";
import {AllyService} from "../../../core/services/ally.service";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";
import {Adviser} from "../../../core/interfaces/adviser";
import {AdviserService} from "../../../core/services/adviser.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";
import {CurrencyPipe} from "@angular/common";
import {User} from "../../../core/interfaces/user";
import {PROPERTY_TYPES} from "../../../shared/utils/property-types";
import {LOCATIONS, LOCATIONS_DETAIL} from "../../../shared/utils/locations";

interface Steps {
  first: string,
  second: string,
  third: string,
  fourth: string,
  fifth: string,
  sixth: string,
  last: string
}

type TypeOptions = 'imagenes' | 'documentos'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  generalForm!: FormGroup;
  locationForm!: FormGroup;
  attributesForm!: FormGroup;
  distributionForm!: FormGroup;
  equipmentForm!: FormGroup;
  negotiationForm!: FormGroup;
  documentsForm!: FormGroup;
  loading = false;
  loadingImage = false;
  loadingDocument = false;
  isEditing = false;
  id: any;
  index = 5;
  imagesSubscription = new Subscription();
  routerSubscription = new Subscription();
  documentsSubscription = new Subscription();
  images: string[] = [];
  documents: string[] = [];
  propertyTypes = PROPERTY_TYPES;
  allies: Ally[] = [];
  owners: Owner[] = [];
  externalAdvisers: Adviser[] = [];
  users: User[] = [];
  advisers: any[] = [];
  showOrderModal = false;
  states = LOCATIONS;
  cities: string[] = [];
  locationsDetail = LOCATIONS_DETAIL;

  showRegisterOwnersModal = false;
  showRegisterAlliesModal = false;
  showRegisterExternalAdviserModal = false;
  ownersLoading = true;
  firstRender = false;
  creatingFromStoredData = false;
  negotiationFormSubscription = new Subscription();

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
    private allyService: AllyService,
    private ownerService: OwnerService,
    private modal: NzModalService,
    private adviserService: AdviserService,
    private userService: UserService,
    private currencyPipe: CurrencyPipe,
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

    this.getExternalAdvisers();
    this.getOwners();
    this.getAllies();
    this.getAdvisers()

    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getPropertyById(this.id)
      this.firstRender = true;
    } else {
      // this.routerSubscription = this.router.events
      //   .pipe(filter((event: RouterEvent | any) => event instanceof NavigationStart))
      //   .subscribe((event: NavigationStart) => {
      //     this.saveTemporalChanges()
      //   });
      this.populateDistributionWhenCreate()
      this.getAutomaticPropertyCode();
      // if (localStorage.getItem('property_create_temporal')) {
      //   this.modal.confirm({
      //     nzClosable: false,
      //     nzCloseIcon: '',
      //     nzWidth: '600px',
      //     nzTitle: 'Atencion',
      //     nzContent: 'Existe informacion de la ultima propiedad que intentaste registrar, pero no completaste el proceso. Te gustaria completarlo ahora?. Si la respuesta es NO, se eliminaran los cambios guardados',
      //     nzCancelText: 'No, Eliminar cambios guardados',
      //     nzOkText: 'Si, Completar ahora',
      //     nzOnOk: () => new Promise((resolve, reject) => {
      //       this.recoverDataFromStorage();
      //       setTimeout(() => resolve(), 500);
      //     }),
      //     nzOnCancel: () => new Promise((resolve, reject) => {
      //       this.clearStorageData()
      //       setTimeout(() => resolve(), 500);
      //     }),
      //   })
      // }
    }


    this.negotiationForm.get('externalAdviser')?.valueChanges.subscribe(value => {
      if (value) {
        this.negotiationForm.get('owner')?.disable()
        this.negotiationForm.get('owner')?.reset()
      } else {
        this.negotiationForm.get('owner')?.enable()
      }
    })
  }

  ngOnDestroy() {
    this.fileService.cleanFiles();
    this.imagesSubscription.unsubscribe();
    this.documentsSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  private buildForms() {


    this.generalForm = this.fb.group({
      code: [{value: '', disabled: true}],
      description: ['', Validators.required],
      publicationTitle: ['', Validators.required],
      footageBuilding: [''],
      footageGround: [''],
      nomenclature: [''],
      propertyCondition: [''],
      operationType: ['', Validators.required],
      status: ['Incompleto'],
      propertyType: ['', Validators.required],
      conlallave: [false],
      facebook: [false],
      instagram: [false],
      mercadolibre: [false],
      whatsapp: [false],
      tiktok: [false],
      publicationOnBuilding: [false],
      handoverKeys: [false],
      propertyExclusivity: [''],
      termsAndConditionsAccepted: [false],
    })

    this.locationForm = this.fb.group({
      country: ['Venezuela', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      municipality: [''],
      avenue: [''],
      street: [''],
      howToGet: [''],
      parkingLevel: [''],
      parkingNumber: [''],
      trunkLevel: [''],
      trunkNumber: [''],
      referencePoint: [''],
      floor: [''],
      amountOfFloors: [''],
      location: [''],
      isClosedStreet: [''],
    })

    this.attributesForm = this.fb.group({
      attributes: this.fb.array([])
    })

    this.distributionForm = this.fb.group({
      distribution: this.fb.array([])
    })
    this.equipmentForm = this.fb.group({
      equipment: this.fb.array([])
    })

    this.negotiationForm = this.fb.group({
      price: ['', [Validators.required, Validators.minLength(1)]],
      owner: [{value: null, disabled: false}, Validators.required],
      attorneyPhone: [''],
      attorneyEmail: ['', Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)],
      attorneyFirstName: [''],
      attorneyLastName: [''],
      minimumNegotiation: ['', Validators.minLength(1)],
      reasonToSellOrRent: [''],
      externalAdviser: [null],
      ally: [null],
      partOfPayment: [''],
      user: [this.userService.currentUser.value.id, Validators.required]
    })

    this.documentsForm = this.fb.group({
      propertyDoc: [false],
      CIorRIF: [false],
      ownerCIorRIF: [false],
      spouseCIorRIF: [false],
      mortgageRelease: ['N/A'],
      power: ['N/A'],
      successionDeclaration: ['N/A'],
      courtRulings: ['N/A'],
      cadastralRecordYear: [''],
      isCadastralRecordSameOwner: [false],
      realStateTaxYear: [''],
      condominiumSolvency: [false],
      condominiumSolvencyDetails: [''],
      mainProperty: [false],
    })
  }

  submitForm(): void {
    if (this.generalForm.valid && this.locationForm.valid && this.negotiationForm.valid) {
      this.loading = true;
      const data = {
        id: this.id,
        generalInformation: {...this.generalForm.value, code: this.generalForm.get('code')?.value},
        locationInformation: this.locationForm.value,
        negotiationInformation: this.negotiationForm.value,
        images: this.images,
        publicationTitle: this.generalForm.get('publicationTitle')?.value,
        files: this.documents,
        documentsInformation: this.documentsForm.value,
        attributes: this.attributes.value,
        equipment: this.equipment.value,
        distribution: this.distribution.value,
        user_id: this.negotiationForm.get('user')?.value,
        external_adviser_id: this.negotiationForm.get('externalAdviser')?.value,
        owner_id: this.negotiationForm.get('owner')?.value,
        ally_id: this.negotiationForm.get('ally')?.value === '' ? null : this.negotiationForm.get('ally')?.value,
      };

      data.negotiationInformation.price = data.negotiationInformation.price.replace(/[^0-9.]+/g, '').trim();
      data.negotiationInformation.minimumNegotiation = !data.negotiationInformation.minimumNegotiation ? '0' : data.negotiationInformation.minimumNegotiation.replace(/[^0-9.]+/g, '').trim();

      delete data.negotiationInformation.externalAdviser;
      delete data.negotiationInformation.owner;
      delete data.negotiationInformation.ally;
      delete data.negotiationInformation.user;
      delete data.generalInformation.publicationTitle;
      localStorage.removeItem('property_create_temporal')

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


  getPropertyById(id: string) {
    this.propertyService.getById(id).subscribe(result => {
      this.generalForm.get('code')?.patchValue(result.generalInformation.code);
      this.generalForm.get('user')?.patchValue(result.user_id);
      this.generalForm.get('nomenclature')?.patchValue(result.generalInformation.nomenclature);
      this.generalForm.get('footageBuilding')?.patchValue(result.generalInformation.footageBuilding);
      this.generalForm.get('footageGround')?.patchValue(result.generalInformation.footageGround);
      this.generalForm.get('description')?.patchValue(result.generalInformation.description);
      this.generalForm.get('propertyType')?.patchValue(result.generalInformation.propertyType);
      this.generalForm.get('propertyType')?.disable();
      this.generalForm.get('operationType')?.patchValue(result.generalInformation.operationType);
      this.generalForm.get('publicationTitle')?.patchValue(result.publicationTitle);
      this.generalForm.get('propertyCondition')?.patchValue(result.generalInformation.propertyCondition);
      this.generalForm.get('conlallave')?.patchValue(result.generalInformation.conlallave)
      this.generalForm.get('facebook')?.patchValue(result.generalInformation.facebook)
      this.generalForm.get('instagram')?.patchValue(result.generalInformation.instagram)
      this.generalForm.get('tiktok')?.patchValue(result.generalInformation.tiktok)
      this.generalForm.get('propertyExclusivity')?.patchValue(result.generalInformation.propertyExclusivity)
      this.generalForm.get('mercadolibre')?.patchValue(result.generalInformation.mercadolibre)
      this.generalForm.get('whatsapp')?.patchValue(result.generalInformation.whatsapp)
      this.generalForm.get('publicationOnBuilding')?.patchValue(result.generalInformation.publicationOnBuilding)
      this.generalForm.get('termsAndConditionsAccepted')?.patchValue(result.generalInformation.termsAndConditionsAccepted)
      this.generalForm.get('handoverKeys')?.patchValue(result.generalInformation.handoverKeys)

      this.documentsForm.get('propertyDoc')?.patchValue(result.documentsInformation.propertyDoc)
      this.documentsForm.get('CIorRIF')?.patchValue(result.documentsInformation.CIorRIF)
      this.documentsForm.get('ownerCIorRIF')?.patchValue(result.documentsInformation.ownerCIorRIF)
      this.documentsForm.get('spouseCIorRIF')?.patchValue(result.documentsInformation.spouseCIorRIF)
      this.documentsForm.get('mortgageRelease')?.patchValue(result.documentsInformation.mortgageRelease)
      this.documentsForm.get('power')?.patchValue(result.documentsInformation.power)
      this.documentsForm.get('successionDeclaration')?.patchValue(result.documentsInformation.successionDeclaration)
      this.documentsForm.get('courtRulings')?.patchValue(result.documentsInformation.courtRulings)
      this.documentsForm.get('cadastralRecordYear')?.patchValue(result.documentsInformation.cadastralRecordYear)
      this.documentsForm.get('isCadastralRecordSameOwner')?.patchValue(result.documentsInformation.isCadastralRecordSameOwner)
      this.documentsForm.get('realStateTaxYear')?.patchValue(result.documentsInformation.realStateTaxYear)
      this.documentsForm.get('condominiumSolvency')?.patchValue(result.documentsInformation.condominiumSolvency)
      this.documentsForm.get('condominiumSolvencyDetails')?.patchValue(result.documentsInformation.condominiumSolvencyDetails)
      this.documentsForm.get('mainProperty')?.patchValue(result.documentsInformation.mainProperty)

      this.locationForm.get('city')?.patchValue(result.locationInformation.city);
      this.locationForm.get('state')?.patchValue(result.locationInformation.state);
      this.locationForm.get('amountOfFloors')?.patchValue(result.locationInformation.amountOfFloors);
      this.locationForm.get('country')?.patchValue(result.locationInformation.country);
      this.locationForm.get('municipality')?.patchValue(result.locationInformation.municipality);
      this.locationForm.get('avenue')?.patchValue(result.locationInformation.avenue);
      this.locationForm.get('street')?.patchValue(result.locationInformation.street);
      this.locationForm.get('floor')?.patchValue(result.locationInformation.floor);
      this.locationForm.get('howToGet')?.patchValue(result.locationInformation.howToGet);
      this.locationForm.get('urbanization')?.patchValue(result.locationInformation.urbanization);
      this.locationForm.get('trunkNumber')?.patchValue(result.locationInformation.trunkNumber);
      this.locationForm.get('trunkLevel')?.patchValue(result.locationInformation.trunkLevel);
      this.locationForm.get('referencePoint')?.patchValue(result.locationInformation.referencePoint);
      this.locationForm.get('buildingShoppingcenter')?.patchValue(result.locationInformation.buildingShoppingCenter);

      const attrs = result.attributes.sort((a , b) => {
        // Compare 'formType' first

        const formTypeComparison = a.formType.localeCompare(b.formType);

        // If 'formType' is the same, compare 'label'
        if (formTypeComparison === 0) {
          return a.label.localeCompare(b.label);
        }

        return formTypeComparison; // Return the result of 'formType' comparison

      })

      attrs.forEach(attr => {
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


      result.distribution.forEach(dist => {
        this.distribution.push(this.fb.group({
          type: [dist.type],
          label: [dist.label],
          placeholder: [dist.placeholder],
          options: [dist.options],
          value: [dist.value],
        }))
      })


      result.equipment.forEach(eq => {
        this.equipment.push(this.fb.group({
          name: [eq.name],
          brand: [eq.brand],
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
      this.negotiationForm.get('ally')?.disable();
      this.negotiationForm.get('externalAdviser')?.patchValue(result.external_adviser_id);
      this.negotiationForm.get('externalAdviser')?.disable();
      this.negotiationForm.get('owner')?.patchValue(result.owner_id);
      this.negotiationForm.get('contactEmail')?.patchValue(result.negotiationInformation.contactEmail);
      this.negotiationForm.get('contactFirstName')?.patchValue(result.negotiationInformation.contactFirstName);
      this.negotiationForm.get('contactLastName')?.patchValue(result.negotiationInformation.contactLastName);
      this.negotiationForm.get('contactPhone')?.patchValue(result.negotiationInformation.contactPhone);

      result.files.forEach(file => {
        this.fileService.storeDocument(file);
      });


    })
  }

  recoverDataFromStorage() {
    this.creatingFromStoredData = true;
    const data = JSON.parse(localStorage.getItem('property_create_temporal')!);
    console.log(data);

    this.generalForm.get('code')?.patchValue(data.generalInformation.code);
    this.generalForm.get('user')?.patchValue(data.user_id);
    this.generalForm.get('nomenclature')?.patchValue(data.generalInformation.nomenclature);
    this.generalForm.get('footageBuilding')?.patchValue(data.generalInformation.footageBuilding);
    this.generalForm.get('footageGround')?.patchValue(data.generalInformation.footageGround);
    this.generalForm.get('description')?.patchValue(data.generalInformation.description);
    this.generalForm.get('propertyType')?.patchValue(data.generalInformation.propertyType);
    this.generalForm.get('operationType')?.patchValue(data.generalInformation.operationType);
    this.generalForm.get('propertyCondition')?.patchValue(data.generalInformation.propertyCondition);
    this.generalForm.get('conlallave')?.patchValue(data.generalInformation.conlallave)
    this.generalForm.get('facebook')?.patchValue(data.generalInformation.facebook)
    this.generalForm.get('instagram')?.patchValue(data.generalInformation.instagram)
    this.generalForm.get('tiktok')?.patchValue(data.generalInformation.tiktok)
    this.generalForm.get('mercadolibre')?.patchValue(data.generalInformation.mercadolibre)
    this.generalForm.get('whatsapp')?.patchValue(data.generalInformation.whatsapp)


    this.locationForm.get('city')?.patchValue(data.locationInformation.city);
    this.locationForm.get('state')?.patchValue(data.locationInformation.state);
    this.locationForm.get('amountOfFloors')?.patchValue(data.locationInformation.amountOfFloors);
    this.locationForm.get('country')?.patchValue(data.locationInformation.country);
    this.locationForm.get('municipality')?.patchValue(data.locationInformation.municipality);
    this.locationForm.get('avenue')?.patchValue(data.locationInformation.avenue);
    this.locationForm.get('street')?.patchValue(data.locationInformation.street);
    this.locationForm.get('floor')?.patchValue(data.locationInformation.floor);
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
    this.negotiationForm.get('externalAdviser')?.patchValue(data.external_adviser_id);
    this.negotiationForm.get('owner')?.patchValue(data.negotiationInformation.owner);
    this.negotiationForm.get('contactEmail')?.patchValue(data.negotiationInformation.contactEmail);
    this.negotiationForm.get('contactFirstName')?.patchValue(data.negotiationInformation.contactFirstName);
    this.negotiationForm.get('contactLastName')?.patchValue(data.negotiationInformation.contactLastName);
    this.negotiationForm.get('contactPhone')?.patchValue(data.negotiationInformation.contactPhone);


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

    this.getAutomaticPropertyCode();

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
      last: 'wait',
    }
    if (index === 6) steps = {
      first: 'finish',
      second: 'finish',
      third: 'finish',
      fourth: 'finish',
      fifth: 'finish',
      sixth: 'finish',
      last: 'process',
    }



    if (this.generalForm.dirty && this.generalForm.invalid) steps.first = 'error'
    if (this.locationForm.dirty && this.locationForm.invalid) steps.second = 'error'
    if (this.images.length < 1 && this.visitedImages) steps.third = 'error'
    if (this.attributesForm.dirty && this.attributesForm.invalid) steps.fifth = 'error'
    if (this.negotiationForm.dirty && this.negotiationForm.invalid) steps.sixth = 'error'
    if (this.documentsForm.dirty && this.documentsForm.invalid) steps.last = 'error'

    //  Form finished and valid

    if (this.generalForm.dirty && this.generalForm.valid) steps.first = 'finish'
    if (this.locationForm.dirty && this.locationForm.valid) steps.second = 'finish'
    if (this.images.length > 0) steps.third = 'finish'
    if (this.attributesForm.dirty && this.attributesForm.valid) steps.fifth = 'finish'
    if (this.negotiationForm.dirty && this.negotiationForm.valid) steps.sixth = 'finish'
    if (this.documentsForm.dirty && this.documentsForm.valid) steps.last = 'finish'


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

  get distribution() {
    return this.distributionForm.controls['distribution'] as FormArray;
  }
  get equipment() {
    return this.equipmentForm.controls['equipment'] as FormArray;
  }

  get operationType() {
    return this.generalForm.get('operationType')?.value;
  }

  async handleUploadFile(event: any, type: TypeOptions) {
    this.loadingImage = true;

    const {files} = event.target;

    const forLoop = async () => {
      for (let i = 0; i < files.length; i++) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = async () => {
            const path = `servicio-inmobiliario+propiedades+${this.generalForm.get('code')?.value}+${type}`
            this.fileService.uploadGenericStaticFile(files[i], path).subscribe(result => {
                if (type === 'imagenes') {
                  this.fileService.storeImage(result.secureUrl)
                } else {
                  this.fileService.storeDocument(result.secureUrl)
                }
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
    console.log(this.attributes)
    this.clearFormArray(this.attributes);
    console.log(this.attributes)
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
      this.owners = result;
    }, () => {
      this.ownersLoading = false;
    }, () => {
      this.ownersLoading = false;
    })
  }

  getAllies() {
    this.allyService.getAll().subscribe(result => {
      this.allies = result;
    })
  }

  getExternalAdvisers() {
    this.adviserService.getAll().subscribe(result => {
      this.externalAdvisers = result;
    })
  }

  getAdvisers() {
    this.userService.getAdvisers().subscribe(result => {
      this.advisers = result;
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
      bool = false
    }

    if (this.index === 5) {
      bool = this.negotiationForm.invalid;
    }

    if (this.index === 6) {
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
      attributes: this.attributes.value
    };
    if (!this.isEditing && (this.generalForm.touched || this.locationForm.touched || this.negotiationForm.touched || this.attributesForm.touched)) {
      localStorage.setItem('property_create_temporal', JSON.stringify(data));
    }
  }

  clearStorageData() {
    this.fileService.deleteTemporalImages();
    this.fileService.deleteTemporalFiles();
    localStorage.removeItem('property_create_temporal')
  }

  private getAutomaticPropertyCode() {
    this.propertyService.getAutomaticPropertyCode().subscribe(result => {
      this.generalForm.get('code')?.patchValue(result.code);
    }, (error) => {
      this.uiService.createMessage('error', error.error.message);
    }, () => {})
  }

  handleSelectState(value: string) {
    if (value === 'Carabobo') {
      this.cities = this.locationsDetail.carabobo
    }
    if (value === 'Caracas') {
      this.cities = this.locationsDetail.caracas
    }
    if (value === 'Aragua') {
      this.cities = this.locationsDetail.aragua
    }
    if (value === 'Cojedes') {
      this.cities = this.locationsDetail.cojedes
    }
  }

  populateDistributionWhenCreate() {
    const data = [
      {label: 'Habitaciones', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Bano completo', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Medio bano', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Puestos de estacionamiento', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Sala / comedor', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Cocina empotrada', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Porche', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Patio', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Lavadero', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Terraza', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Balcon', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Estudio', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Recepcion', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Cubiculos', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Kichinnet', value: null, type: 'check', options: '', placeholder: ''},
      {label: 'Otras areas', value: null, type: 'text', options: '', placeholder: 'Especificar'},
    ];

    data.forEach(item => {
      this.distribution.push(
        this.fb.group({
          label: item.label,
          placeholder: item.placeholder,
          value: item.value,
          type: item.type,
          options: item.options
        })
      )
    })

  }

  addEquipment() {
    this.equipment.push(
      this.fb.group({
        name: [''],
        brand: ['']
      })
    )
  }

  deleteEquipment(i: number) {
    this.equipment.removeAt(i);
  }
}
