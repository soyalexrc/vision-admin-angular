import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PropertyService} from "../../../core/services/property.service";
import {v4 as uuidv4} from 'uuid';
import {FileService} from "../../../core/services/file.service";
import {Image, PropertyType} from "../../../core/interfaces/property";
import {Subscription} from "rxjs";
import {Ally} from "../../../core/interfaces/ally";
import {AllyService} from "../../../core/services/ally.service";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";
import {Adviser} from "../../../core/interfaces/adviser";
import {AdviserService} from "../../../core/services/adviser.service";

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
  images: Image[] = [];
  documents: Image[] = [];

  allies: Ally[] = [];
  clients: Owner[] = [];
  advisers: Adviser[] = [];

  showRegisterClientsModal = false;
  clientsLoading = true;


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
    private clientService: OwnerService,
    private adviserService: AdviserService
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
    this.getClients();
    this.getAllies();


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
      birthday: [''],
      phone: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
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
        property: this.generalForm.value,
        location: this.locationForm.value,
        clientData: this.negotiationForm.value,
        images: this.images,
        files: this.documents,
        publicationSource: this.publicationSourceForm.value,
        attributes: this.attributes.value
      };
      if (this.isEditing) {
        this.propertyService.update(data).subscribe(result => {
          this.uiService.createMessage('success', 'Se edito la propiedad con exito!')
          this.router.navigate(['/propiedades'])
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.propertyService.createOne(data).subscribe(result => {
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
      const property = result.recordset[0];
      this.generalForm.get('id')?.patchValue(property.id)
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

  handleSortElements(images: Image[], type: string) {
    if (type === 'image') {
      this.fileService.setReorderImages(images)
    } else {
      this.fileService.setReorderDocuments(images)
    }
  }

  getAllyValue(ally: Ally) {
    return {
      id: ally.id,
      name: `${ally.first_name} ${ally.last_name}`
    }
  }

  getClientValue(client: Owner) {
    return {
      id: client.id,
      name: `${client.first_name} ${client.last_name}`
    }
  }


  getClients() {
    this.clientsLoading = true;
    this.clientService.getAll().subscribe(result => {
      this.clients = result;
    }, () => {
      this.clientsLoading = false;
    }, () => {
      this.clientsLoading = false;
    })
  }

  getAllies() {
    this.allyService.getAll().subscribe(result => {
      this.allies = result;
    })
  }

  getAdvisers() {
    this.adviserService.getAll().subscribe(result => {
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

    if (this.index === 1 ) {
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
}
