import {Component, OnInit} from '@angular/core';
import {AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../../core/services/client.service";
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
export class CreateComponent implements OnInit{
  generalForm!: FormGroup;
  operationForm!: FormGroup;
  loading = false;
  isEditing = false;
  id: any;
  index = 0;
  operationOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private uiService: UiService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.buildForms();
    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getClient(this.id)
    } else {
      this.addZone();
      this.addFeature()
    }
  }

  getClient(id: number | string) {
    this.clientService.getById(id).subscribe(result => {
      this.generalForm.get('name')?.patchValue(result.name);
      this.generalForm.get('phone')?.patchValue(result.phone);
      this.generalForm.get('contactFrom')?.patchValue(result.contactFrom);
      this.generalForm.get('isPotentialInvestor')?.patchValue(result.isPotentialInvestor);
      this.generalForm.get('service')?.patchValue(result.service);
      this.generalForm.get('referrer')?.patchValue(result.referrer);

      this.operationForm.get('operationType')?.patchValue(result.operationType);
      this.operationForm.get('propertyOfInterest')?.patchValue(result.propertyOfInterest);
      this.operationForm.get('propertyLocation')?.patchValue(result.propertyLocation);
      this.operationForm.get('typeOfCapture')?.patchValue(result.typeOfCapture);
      this.operationForm.get('aspiredPrice')?.patchValue(result.aspiredPrice);
      this.operationForm.get('typeOfBusiness')?.patchValue(result.typeOfBusiness);
      this.operationForm.get('note')?.patchValue(result.note);
      this.operationForm.get('amountOfPeople')?.patchValue(result.amountOfPeople);
      this.operationForm.get('amountOfNights')?.patchValue(result.amountOfNights);
      this.operationForm.get('amountOfPets')?.patchValue(result.amountOfPets);
      this.operationForm.get('amountOfYounger')?.patchValue(result.amountOfYounger);
      this.operationForm.get('arrivingDate')?.patchValue(result.arrivingDate);
      this.operationForm.get('checkoutDate')?.patchValue(result.checkoutDate);
      this.operationForm.get('reasonOfStay')?.patchValue(result.reasonOfStay);
      this.operationForm.get('requirementStatus')?.patchValue(result.requirementStatus);
      this.operationForm.get('usageProperty')?.patchValue(result.usageProperty);
      this.operationForm.get('typeOfPerson')?.patchValue(result.typeOfPerson);
      this.operationForm.get('personEntry')?.patchValue(result.personEntry);
      this.operationForm.get('personLocation')?.patchValue(result.personLocation);
      this.operationForm.get('personHeadquarters')?.patchValue(result.personHeadquarters);

      result.zonesOfInterest.forEach(zone => {
        this.zonesOfInterest.push(this.fb.group({
          value: [zone, Validators.required]
        }))
      })

      result.essentialFeatures.forEach(feature => {
        this.essentialFeatures.push(this.fb.group({
          value: [feature, Validators.required]
        }))
      })

    })
  }

  buildForms() {
    this.generalForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      contactFrom: ['', Validators.required],
      user_id: [null],
      isPotentialInvestor: [false],
      service: ['', Validators.required],
      referrer: ['']
    })

    this.operationForm = this.fb.group({
      operationType: ['', Validators.required],
      propertyOfInterest: [''],
      propertyLocation: [''],
      typeOfCapture: [''],
      aspiredPrice: [''],
      typeOfBusiness: [''],
      note: [''],
      amountOfPeople: [null],
      amountOfPets: [null],
      amountOfYounger: [null],
      arrivingDate: [null],
      checkoutDate: [null],
      amountOfNights: [null],
      reasonOfStay: [''],
      usageProperty: [''],
      typeOfPerson: [''],
      personEntry: [''],
      personHeadquarters: [''],
      personLocation: [''],
      zonesOfInterest: this.fb.array([]),
      essentialFeatures: this.fb.array([])
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
    if (this.operationForm.dirty && this.operationForm.invalid) {
      steps.second = 'error'
    }


    //  Form finished and valid

    if (this.generalForm.dirty && this.generalForm.valid) {
      steps.first = 'finish'
    }
    if (this.operationForm.dirty && this.operationForm.valid) {
      steps.second = 'finish'
    }

    return steps
  }


  submitForm() {
    console.log(this.generalForm.value);
    console.log(this.operationForm.value);

    if (this.generalForm.valid && this.operationForm.valid) {
      this.loading = true;
      const data = {...this.generalForm.value, ...this.operationForm.value};
      data.zonesOfInterest = data.zonesOfInterest.map((zone: {value: string}) => zone.value);
      data.essentialFeatures = data.essentialFeatures.map((feature: {value: string}) => feature.value);
      data.user_id = this.userService.currentUser?.value.id;
      data.requirementStatus = true;

      if (this.isEditing) {

      } else {
        this.clientService.createOne(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/clientes'])

        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
          this.loading = false;
        }, () => {
          this.loading = false;
        })
      }
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
      bool = this.operationForm.invalid
    }

    if (this.index === 5) {
      bool = false
    }

    return bool;
  }

  handleServiceSelection(value: string) {
    if (value === 'Inmobiliario') {
      this.operationOptions = [
        'Alquiler residencial',
        'Alquiler comercial',
        'Alquiler vacacional',
        'Captacion'
      ]
    }
  }

  get serviceType() {
    return this.generalForm.get('service')?.value;
  }

  get operationType() {
    return this.operationForm.get('operationType')?.value;
  }

  get personType() {
    return this.operationForm.get('typeOfPerson')?.value;
  }

  get zonesOfInterest() {
    return this.operationForm.controls["zonesOfInterest"] as FormArray;
  }

  get essentialFeatures() {
    return this.operationForm.controls["essentialFeatures"] as FormArray;
  }

  get contactFrom() {
    return this.generalForm.get('contactFrom')?.value;
  }


  handleOperationTypeSelect(value: string) {
    console.log(value, this.serviceType)
    if (this.serviceType === 'Inmobiliario' ){
      if (value === 'Alquiler residencial') {
        this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
        this.operationForm.get('usageProperty')?.setValidators([Validators.required]);
        this.operationForm.get('zonesOfInterest')?.setValidators([Validators.required]);
        this.operationForm.get('aspiredPrice')?.setValidators([Validators.required]);
        this.operationForm.get('essentialFeatures')?.setValidators([Validators.required]);
        this.operationForm.get('typeOfPerson')?.setValidators([Validators.required]);
        this.operationForm.get('amountOfPeople')?.setValidators([Validators.required]);
        this.operationForm.get('amountOfYounger')?.setValidators([Validators.required]);
        this.operationForm.get('amountOfPets')?.setValidators([Validators.required]);
      }
    }
  }

  handlePersonTypeSelection(value: string) {
    if (value === 'Juridica') {
      this.operationForm.get('personLocation')?.setValidators([Validators.required]);
      this.operationForm.get('personEntry')?.setValidators([Validators.required]);
      this.operationForm.get('personHeadquarters')?.setValidators([Validators.required]);
    } else {
      this.operationForm.get('personLocation')?.clearValidators();
      this.operationForm.get('personEntry')?.clearValidators();
      this.operationForm.get('personHeadquarters')?.clearValidators();
    }
  }

  addZone() {
    const zoneForm = this.fb.group({
      value: ['', Validators.required]
    })

    this.zonesOfInterest.push(zoneForm);
  }

  deleteZone(index: number) {
    this.zonesOfInterest.removeAt(index);
  }

  addFeature() {
    const feature = this.fb.group({
      value: ['', Validators.required]
    })

    this.essentialFeatures.push(feature);
  }

  deleteFeature(index: number) {
    this.essentialFeatures.removeAt(index);
  }

  handleContactFromSelection(value: string) {
    if (value === 'Referido') {
      this.generalForm.get('contactFrom')?.setValidators([Validators.required])
    } else {
      this.generalForm.get('contactFrom')?.clearValidators()
    }
  }
}
