import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PropertyService} from "../../../core/services/property.service";
import { PropertyReview} from "../../../core/interfaces/property";
import {SERVICE_OPTIONS, SERVICE_TYPE_OPTIONS} from "../../../shared/utils/services";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import * as moment from "moment/moment";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MONTHS} from "../../../shared/utils/months";
import {CurrencyPipe} from "@angular/common";
import {Subscription} from "rxjs";
import {CashFlowPerson} from "../../../core/interfaces/cashFlow";

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
  generalForm!: FormGroup;
  paymentDetailForm!: FormGroup;
  serviceForm!: FormGroup;
  loading = false;
  id: any;
  index = 0;
  paymentDetailFormSubscription = new Subscription();

  properties: PropertyReview[] = []
  people: CashFlowPerson[] = [];
  serviceOptions: string[] = SERVICE_OPTIONS;
  serviceTypeOptions: string[] = [];
  showRegisterPersonModal = false;
  peopleLoading = false;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private cashFlowService: CashFlowService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
  ) {
  }

  ngOnInit() {
    this.buildForms();

    this.propertyService.getAllPreviews().subscribe(result => {
      this.properties = result.rows;
    })

    this.getPeople();

    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getCashFlowRegisterById(this.id)
    }

    this.paymentDetailFormSubscription = this.paymentDetailForm.valueChanges.subscribe(form => {
      if (form.amount) {
        this.paymentDetailForm.patchValue({
          amount: this.currencyPipe.transform(form.amount.replace(/\D/g, '').replace(/^0+/, ''), this.paymentDetailForm.get('currency')?.value, 'code', '1.0-0')
        }, {emitEvent: false})
      }
      if (form.pendingToCollect) {
        this.paymentDetailForm.patchValue({
          pendingToCollect: this.currencyPipe.transform(form.pendingToCollect.replace(/\D/g, '').replace(/^0+/, ''), this.paymentDetailForm.get('currency')?.value, 'code', '1.0-0')
        }, {emitEvent: false})
      }
      if (form.totalDue) {
        this.paymentDetailForm.patchValue({
          totalDue: this.currencyPipe.transform(form.totalDue.replace(/\D/g, '').replace(/^0+/, ''), this.paymentDetailForm.get('currency')?.value, 'code', '1.0-0')
        }, {emitEvent: false})
      }
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
    if (this.serviceForm.dirty && this.serviceForm.invalid) {
      steps.second = 'error'
    }
    if (this.paymentDetailForm.dirty && this.paymentDetailForm.invalid) {
      steps.last = 'error'
    }

    //  Form finished and valid

    if (this.generalForm.dirty && this.generalForm.valid) {
      steps.first = 'finish'
    }
    if (this.serviceForm.dirty && this.serviceForm.valid) {
      steps.second = 'finish'
    }
    if (this.paymentDetailForm.dirty && this.paymentDetailForm.valid) {
      steps.last = 'finish'
    }

    return steps
  }

  private buildForms() {
    this.generalForm = this.fb.group({
      client_id: [null],
      owner_id: [null],
      cashflow_person_id: [null],
      property_id: [null],
      internalProperty: [''],
      person: [null],
      date: [new Date(), Validators.required],
      month: [''],
      location: [''],
      isTemporalTransaction: [false],
      id: [null]
    });

    this.serviceForm = this.fb.group({
      canon: [''],
      contract: [''],
      guarantee: [''],
      typeOfService: [''],
      reason: [''],
      service: [''],
      taxPayer: ['']
    })

    this.paymentDetailForm = this.fb.group({
      amount: [''],
      currency: [''],
      wayToPay: [''],
      transactionType: [''],
      totalDue: [''],
      entity: [''],
      pendingToCollect: [''],
      observation: ['']
    })
  }

  getPropertyLabel(property: PropertyReview) {
    return `${property.code} - ${property.propertyType} - ${property.operationType}`;
  }

  handleChangeService(service: string) {
    if (service === this.serviceOptions[0]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.inmueble
    if (service === this.serviceOptions[1]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.legal
    if (service === this.serviceOptions[2]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.propertiesAdministration
    if (service === this.serviceOptions[3]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.accounting
    if (service === this.serviceOptions[4]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.companyAdministration
    if (service === this.serviceOptions[5]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.cleanliness
    if (service === this.serviceOptions[6]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.remodeling
    if (service === this.serviceOptions[7]) this.serviceTypeOptions = SERVICE_TYPE_OPTIONS.maintenance
  }

  showAmountField() {
    return this.paymentDetailForm.value.transactionType === 'Ingreso'
      || this.paymentDetailForm.value.transactionType === 'Egreso'
      || this.paymentDetailForm.value.transactionType === 'Interbancaria'
  }

  showTotalDueField() {
    return this.paymentDetailForm.value.transactionType === 'Ingreso'
      || this.paymentDetailForm.value.transactionType === 'Cuenta por pagar'
  }

  showPendingToCollectField() {
    return this.paymentDetailForm.value.transactionType === 'Ingreso'
      || this.paymentDetailForm.value.transactionType === 'Cuenta por cobrar'
  }


  submitForm() {
    this.loading = true;
    const data = {
      ...this.generalForm.value,
      ...this.serviceForm.value,
      ...this.paymentDetailForm.value
    }
    data.client_id = data.person.includes('Cliente') ? data.person.split('-')[0] : null;
    data.owner_id = data.person.includes('Propietario') ? data.person.split('-')[0] : null;
    data.cashflow_person_id = data.person.includes('Administracion interna') ? data.person.split('-')[0] : null;
    data.amount = !data.amount ? '0' : data.amount.replace(/\D/g, '');
    data.pendingToCollect = !data.pendingToCollect ? '0' : data.pendingToCollect.replace(/\D/g, '');
    data.totalDue = !data.totalDue ? '0' : data.totalDue.replace(/\D/g, '');
    data.date = moment(data.date).format('YYYY-MM-DD');
    const month = new Date(data.date).getMonth()
    data.month = MONTHS[month];
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
      this.generalForm.get('person')?.patchValue(result.person);
      this.generalForm.get('client_id')?.patchValue(result.client_id);
      this.generalForm.get('owner_id')?.patchValue(result.owner_id);
      this.generalForm.get('internalProperty')?.patchValue(result.internalProperty);
      this.generalForm.get('date')?.patchValue(result.date);
      this.generalForm.get('month')?.patchValue(result.month);
      this.generalForm.get('property_id')?.patchValue(result.property_id);
      this.generalForm.get('location')?.patchValue(result.location);
      this.generalForm.get('id')?.patchValue(this.id);

      this.serviceForm.get('canon')?.patchValue(result.canon);
      this.serviceForm.get('contract')?.patchValue(result.contract);
      this.serviceForm.get('guarantee')?.patchValue(result.guarantee);
      this.serviceForm.get('typeOfService')?.patchValue(result.typeOfService);
      this.serviceForm.get('reason')?.patchValue(result.reason);
      this.serviceForm.get('taxPayer')?.patchValue(result.taxPayer);
      this.serviceForm.get('service')?.patchValue(result.service);

      this.paymentDetailForm.get('amount')?.patchValue(result.amount);
      this.paymentDetailForm.get('currency')?.patchValue(result.currency);
      this.paymentDetailForm.get('wayToPay')?.patchValue(result.wayToPay);
      this.paymentDetailForm.get('transactionType')?.patchValue(result.transactionType);
      this.paymentDetailForm.get('totalDue')?.patchValue(result.totalDue);
      this.paymentDetailForm.get('entity')?.patchValue(result.entity);
      this.paymentDetailForm.get('pendingToCollect')?.patchValue(result.pendingToCollect);
      this.paymentDetailForm.get('observations')?.patchValue(result.observations);
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
      bool = this.serviceForm.invalid
    }

    if (this.index === 2 ) {
      bool = this.paymentDetailForm.invalid
    }


    return bool;
  }

  handleChangeSample($event: any) {
    console.log($event)
    console.log($event === this.generalForm.get('person')?.value);
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
}
