import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PropertyService} from "../../../core/services/property.service";
import {PropertyReview} from "../../../core/interfaces/property";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import * as moment from "moment/moment";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MONTHS} from "../../../shared/utils/months";
import {CashFlowPerson, CashFlowProperty, CashFlowRegister} from "../../../core/interfaces/cashFlow";
import {Service, SubService} from "../../../core/interfaces/service";
import {ServicesService} from "../../../core/services/services.service";
import {User} from "../../../core/interfaces/user";
import {UserService} from "../../../core/services/user.service";
import {FileService} from "../../../core/services/file.service";
import {Subscription} from "rxjs";

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
export class CreateComponent implements OnInit, OnDestroy {
  isEditing = false;
  form!: FormGroup;
  loading = false;
  servicesLoading = false;
  id: any;
  index = 0;

  images: string[][] = [];
  properties: PropertyReview[] = []
  people: CashFlowPerson[] = [];
  cashFlowProperties: CashFlowProperty[] = [];
  showRegisterPersonModal = false;
  showRegisterPropertyModal = false;
  showConfigServicesModal = false;
  peopleLoading = false;
  propertiesLoading = false;
  services: Service[] = []
  subServicesLoading = false;
  subServices: SubService[] = [];
  loadingImage = false;
  imagesSubscription = new Subscription();
  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private cashFlowService: CashFlowService,
    private userService: UserService,
    private servicesService: ServicesService,
    public uiService: UiService,
    private router: Router,
    private fileService: FileService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.buildForms();

    this.propertyService.getAllPreviews().subscribe(result => {
      this.properties = result.rows;
    })

    this.imagesSubscription = this.fileService.currentImagesArray.subscribe(images => {
      this.images = images;
      console.log(this.images);
    })

    this.getPeople();
    this.getProperties();
    this.getServices();
    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getCashFlowRegisterById(this.id)
    } else {
      this.addPayment({})
    }

    this.form.get('person')?.valueChanges.subscribe(value => {
      if (value.includes('Administracion interna')) {
        this.form.get('internalProperty')?.patchValue('')
        this.form.get('property_id')?.patchValue(null)
        this.payments.controls.forEach(control => {
          control.get('service')?.reset()
          control.get('service')?.patchValue(10);
          control.get('service')?.disable()
          control.get('serviceType')?.reset()
        })
      } else {
        this.form.get('internalProperty')?.patchValue('')
        this.form.get('property_id')?.patchValue(null)

        this.payments.controls.forEach(control => {
          control.get('service')?.reset()
          control.get('service')?.enable()
          control.get('serviceType')?.reset()
        })

      }
    })

  }

  ngOnDestroy() {
    this.imagesSubscription.unsubscribe();
    this.images = [];
  }

  private buildForms() {
    this.form = this.fb.group({
      client_id: [null],
      owner_id: [null],
      cashflow_person_id: [null],
      property_id: [null],
      internalProperty: [''],
      person: [null, Validators.required],
      date: [new Date(), Validators.required],
      month: [''],
      location: [''],
      isTemporalTransaction: [false],
      id: [null],
      payments: this.fb.array([])
    })
  }

  getPropertyLabel(property: PropertyReview) {
    return `${property.code} - ${property.propertyType} - ${property.operationType}`;
  }

  handleChangeService(serviceId: number | string) {
    if (typeof serviceId !== "number") return;
    this.subServicesLoading = true;
    this.servicesService.getSubServicesByServiceId(serviceId).subscribe(result => {
        this.subServices = result;
      }, _ => this.subServicesLoading = false,
      () => this.subServicesLoading = false)
  }

  showAmountField(i: number) {
    return this.payments.at(i).value.transactionType === 'Ingreso'
      || this.payments.at(i).value.transactionType === 'Egreso'
      || this.payments.at(i).value.transactionType === 'Ingreso a cuenta de terceros'
  }

  showTotalDueField(i: number) {
    return this.payments.at(i).value.transactionType === 'Ingreso'
      || this.payments.at(i).value.transactionType === 'Ingreso a cuenta de terceros'
      || this.payments.at(i).value.transactionType === 'Cuenta por pagar'
  }

  showPendingToCollectField(i: number) {
    return this.payments.at(i).value.transactionType === 'Ingreso'
      || this.payments.at(i).value.transactionType === 'Ingreso a cuenta de terceros'
      || this.payments.at(i).value.transactionType === 'Cuenta por cobrar'
  }


  submitForm() {
    this.loading = true;
    const data = {...this.form.value}
    data.client_id = data.person && data.person.includes('Cliente') ? data.person.split('-')[0] : null;
    data.owner_id = data.person && data.person.includes('Propietario') ? data.person.split('-')[0] : null;
    data.cashflow_person_id = data.person && data.person.includes('Administracion interna') ? data.person.split('-')[0] : null;
    data.payments = data.payments.map((payment: any, index: number) => ({
      ...payment,
      amount: !payment.amount ? '0' : payment.amount.replace(/[^0-9.]+/g, '').trim(),
      pendingToCollect: !payment.pendingToCollect ? '0' : payment.pendingToCollect.replace(/[^0-9.]+/g, '').trim(),
      totalDue: !payment.totalDue ? '0' : payment.totalDue.replace(/[^0-9.]+/g, '').trim(),
      attachments: this.images[index],
    }))

    console.log(data);
    if (this.isEditing) {
      this.cashFlowService.update(data).subscribe(result => {
          this.uiService.createMessage('success', result.message);
          this.router.navigate(['/flujo-de-caja'])
        },
        (error) => {
          this.uiService.createMessage('error', error.error.message)
          this.loading = false;
        }, () => {
          this.loading = false;
        })
    } else {
      data.user_id = this.userService.currentUser.value.id;
      data.date = moment().format();
      const month = new Date().getMonth();
      data.month = MONTHS[month];
      this.cashFlowService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', result.message);
          this.router.navigate(['/flujo-de-caja'])
        },
        (error) => {
          this.uiService.createMessage('error', error.error.message)
          this.loading = false;
        }, () => {
          this.loading = false;
        })
    }

  }

  getCashFlowRegisterById(id: string) {
    this.cashFlowService.getById(id).subscribe(result => {
      this.form.get('person')?.patchValue(result.person);
      this.form.get('client_id')?.patchValue(result.client_id);
      this.form.get('owner_id')?.patchValue(result.owner_id);
      this.form.get('internalProperty')?.patchValue(result.internalProperty);
      this.form.get('date')?.patchValue(result.date);
      this.form.get('month')?.patchValue(result.month);
      this.form.get('property_id')?.patchValue(result.property_id);
      this.form.get('location')?.patchValue(result.location);
      this.form.get('id')?.patchValue(this.id);

      result.attachments.forEach(image => {
        this.fileService.storeImageInArray(image, 0)
      })

      this.addPayment({
        canon: result.canon,
        contract: result.contract,
        guarantee: result.guarantee,
        service: Number(result.service),
        serviceType: Number(result.serviceType),
        reason: result.reason,
        taxPayer: result.taxPayer,
        currency: result.currency,
        wayToPay: result.wayToPay,
        transactionType: result.transactionType,
        totalDue: result.totalDue,
        amount: result.amount,
        entity: result.entity,
        pendingToCollect: result.pendingToCollect,
        observations: result.observations,
      })
      this.handleChangeService(Number(result.service));
    })
  }


  handleChangeSample($event: any) {
    console.log($event)
    console.log($event === this.form.get('person')?.value);
  }

  getValueFromPeople(person: CashFlowPerson) {
    return `${person.id}-${person.name}-${person.type}`;
  }

  getPeople() {
    this.peopleLoading = true;
    this.cashFlowService.getPeople().subscribe(result => {
      this.people = result;
    }, error => {
      this.peopleLoading = false;
    }, () => {
      this.peopleLoading = false;
    })
  }

  getProperties() {
    this.propertiesLoading = true;
    this.cashFlowService.getProperties().subscribe(result => {
      this.cashFlowProperties = result;
    }, error => {
      this.propertiesLoading = false;
    }, () => {
      this.propertiesLoading = false;
    })
  }

  getServices() {
    this.servicesLoading = true;
    this.servicesService.getAll().subscribe(result => {
      this.services = result;
    }, error => {
      this.servicesLoading = false;
    }, () => {
      this.servicesLoading = false;
    })
  }

  getTransactionType(i: number) {
    return this.payments.at(i).get('transactionType')?.value;
  }

  get person() {
    return this.form.get('person')?.value;
  }


  getCurrency(i: number) {
    return this.payments.at(i).get('currency')?.value;
  }

  getService(i: number) {
    return this.payments.at(i).get('service')?.value;
  }

  get payments() {
    return this.form.get('payments') as FormArray;
  }


  // Function to create a default item FormGroup
  createPayment(params?: Partial<CashFlowRegister>) {
    return this.fb.group({
      canon: [params?.canon ?? false],
      contract: [params?.contract || false],
      guarantee: [params?.guarantee || false],
      serviceType: [params?.serviceType || ''],
      reason: [params?.reason || '', Validators.required],
      service: [params?.service || '', Validators.required],
      taxPayer: [params?.taxPayer || ''],
      amount: [params?.amount || '', [Validators.minLength(3)]],
      currency: [params?.currency || '$'],
      wayToPay: [params?.wayToPay || ''],
      transactionType: [params?.transactionType || 'Ingreso'],
      totalDue: [params?.totalDue || ''],
      entity: [params?.entity || ''],
      pendingToCollect: [params?.pendingToCollect || ''],
      observation: [params?.observations || ''],
      proofOfPayment: [params?.proofOfPayment || this.fb.array([])]
    });
  }

  // Function to add controls to the FormArray
  addPayment(params?: Partial<CashFlowRegister>) {
    const newPayment = this.createPayment(params);
    this.payments.push(newPayment);
    if (this.form.get('person')?.value?.includes('Administracion interna')) {
      this.form.get('internalProperty')?.patchValue('')
      this.form.get('property_id')?.patchValue(null)

      this.payments.controls.forEach(control => {
        control.get('service')?.reset()
        control.get('service')?.patchValue(10);
        control.get('service')?.disable()
        control.get('serviceType')?.reset()
      })
    }
  }

  removePayment(i: number) {
    this.payments.removeAt(i);
  }

  async handleUploadFile(event: any) {
    this.loadingImage = true;


    const {files} = event.target;
    console.log(files);

    const forLoop = async () => {
      const month = MONTHS[new Date().getMonth()]
      for (let i = 0; i < files.length; i++) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = async () => {
            // const path = `flujo-de-caja+${month}+${new Date().getTime()}`
            const path = `flujo-de-caja+${month}`;
            this.fileService.uploadGenericStaticFile(files[i], path).subscribe(result => {
                this.fileService.storeImageInArray(result.secureUrl, this.index)
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

  clickInputFile(i: number) {
    this.index = i;
    this.inputFile?.nativeElement.click();

  }

  handleDeleteImage(image: string, index: number) {
      this.fileService.deleteImageInArray(image, index);
  }


}
