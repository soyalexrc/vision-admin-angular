import {Component, OnInit} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PropertyService} from "../../../core/services/property.service";
import {PropertyReview} from "../../../core/interfaces/property";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import * as moment from "moment/moment";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MONTHS} from "../../../shared/utils/months";
import {CashFlowPerson} from "../../../core/interfaces/cashFlow";
import {Service, SubService} from "../../../core/interfaces/service";
import {ServicesService} from "../../../core/services/services.service";
import {User} from "../../../core/interfaces/user";
import {UserService} from "../../../core/services/user.service";

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
  isEditing = false;
  form!: FormGroup;
  loading = false;
  servicesLoading = false;
  id: any;
  index = 0;

  properties: PropertyReview[] = []
  people: CashFlowPerson[] = [];
  showRegisterPersonModal = false;
  showConfigServicesModal = false;
  peopleLoading = false;
  services: Service[] = []
  subServicesLoading = false;
  subServices: SubService[] = [];

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private cashFlowService: CashFlowService,
    private userService: UserService,
    private servicesService: ServicesService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.buildForms();

    this.propertyService.getAllPreviews().subscribe(result => {
      this.properties = result.rows;
    })

    this.getPeople();
    this.getServices();
    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getCashFlowRegisterById(this.id)
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
      payments: this.fb.array([this.createPayment()])
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
    const data = { ...this.form.value }
    data.client_id = data.person && data.person.includes('Cliente') ? data.person.split('-')[0] : null;
    data.owner_id = data.person && data.person.includes('Propietario') ? data.person.split('-')[0] : null;
    data.cashflow_person_id = data.person && data.person.includes('Administracion interna') ? data.person.split('-')[0] : null;
    data.payments = data.payments.map((payment: any) => ({
      ...payment,
      amount: !payment.amount ? '0' : payment.amount.replace(/[^0-9.]+/g, '').trim(),
      pendingToCollect: !payment.pendingToCollect ? '0' : payment.pendingToCollect.replace(/[^0-9.]+/g, '').trim(),
      totalDue: !payment.totalDue ? '0' : payment.totalDue.replace(/[^0-9.]+/g, '').trim(),
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

      this.form.get('canon')?.patchValue(result.canon);
      this.form.get('contract')?.patchValue(result.contract);
      this.form.get('guarantee')?.patchValue(result.guarantee);
      this.form.get('service')?.patchValue(Number(result.service));
      this.handleChangeService(Number(result.service));
      this.form.get('serviceType')?.patchValue(Number(result.serviceType));
      this.form.get('reason')?.patchValue(result.reason);
      this.form.get('taxPayer')?.patchValue(result.taxPayer);

      this.form.get('amount')?.patchValue(result.amount);
      this.form.get('currency')?.patchValue(result.currency);
      this.form.get('wayToPay')?.patchValue(result.wayToPay);
      this.form.get('transactionType')?.patchValue(result.transactionType);
      this.form.get('totalDue')?.patchValue(result.totalDue);
      this.form.get('entity')?.patchValue(result.entity);
      this.form.get('pendingToCollect')?.patchValue(result.pendingToCollect);
      this.form.get('observations')?.patchValue(result.observations);
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
      bool = this.form.invalid
    }


    if (this.index === 1) {
      bool = this.form.invalid
    }

    if (this.index === 2) {
      bool = this.form.invalid
    }


    return bool;
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

  get transactionType() {
    return this.form.get('transactionType')?.value
  }

  get currency() {
    return this.form.get('currency')?.value
  }

  getTransactionType(i: number) {
    return this.payments.at(i).get('transactionType')?.value;
  }


  getCurrency(i: number) {
    return this.payments.at(i).get('currency')?.value;
  }

  get payments() {
    return this.form.get('payments') as FormArray;
  }


  // Function to create a default item FormGroup
  createPayment() {
    return this.fb.group({
      canon: [false],
      contract: [false],
      guarantee: [false],
      serviceType: [''],
      reason: ['', Validators.required],
      service: ['', Validators.required],
      taxPayer: [''],
      amount: ['', [Validators.minLength(3)]],
      currency: ['$'],
      wayToPay: ['Efectivo'],
      transactionType: ['Ingreso'],
      totalDue: [''],
      entity: ['Tesorería'],
      pendingToCollect: [''],
      observation: [''],
    });
  }

  // Function to add controls to the FormArray
  addPayment() {
    const newPayment = this.createPayment();
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
}
