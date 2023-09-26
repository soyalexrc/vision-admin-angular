import {Component, OnInit} from '@angular/core';
import {AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../../core/services/client.service";
import {UserService} from "../../../core/services/user.service";
import {Service, SubService} from "../../../core/interfaces/service";
import {ServicesService} from "../../../core/services/services.service";
import {Subscription} from "rxjs";
import * as moment from 'moment';

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
  operationForm!: FormGroup;
  loading = false;
  isEditing = false;
  id: any;
  index = 0;
  operationOptions: any[] = [];
  showConfigServicesModal = false;
  services: Service[] = []
  servicesLoading = false;
  subServicesLoading = false
  subServices: SubService[] = [];
  subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    public uiService: UiService,
    private router: Router,
    private userService: UserService,
    private servicesService: ServicesService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.buildForms();
    this.getServices();
    if (!this.router.url.includes('crear')) {
      this.isEditing = true;
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.getClient(this.id)
    } else {
      // this.addZone();
      // this.addFeature()
    }

    this.subscription = this.operationForm.valueChanges.subscribe(form => {
      if (form.arrivingDate && form.checkoutDate) {
        const arrivingDate = moment(form.arrivingDate)
        const checkoutDate = moment(form.checkoutDate)
        const diff = checkoutDate.diff(arrivingDate, 'days')
        this.operationForm.get('amountOfNights')?.patchValue(diff);
      }
    })
  }

  buildForms() {
    this.generalForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      contactFrom: ['', Validators.required],
      user_id: [null],
      isPotentialInvestor: [false],
      service_id: [null, Validators.required],
      serviceName: [''],
      referrer: ['']
    })

    this.operationForm = this.fb.group({
      subService_id: [null, Validators.required],
      subServiceName: ['', Validators.required],
      propertyOfInterest: [''],
      propertyLocation: [''],
      typeOfCapture: [''],
      aspiredPrice: [''],
      typeOfBusiness: [''],
      note: [''],
      propertyDistribution: [''],
      m2: [''],
      remodeledAreas: [''],
      amountOfPeople: [null],
      amountOfPets: [null],
      amountOfYounger: [null],
      arrivingDate: [null],
      interestDate: [null],
      appointmentDate: [null],
      inspectionDate: [null],
      checkoutDate: [null],
      amountOfNights: [{value: null, disabled: true}],
      reasonOfStay: [''],
      usageProperty: [''],
      occupation: [''],
      specificRequirement: [''],
      location: [''],
      company: [''],
      typeOfPerson: [''],
      personEntry: [''],
      personHeadquarters: [''],
      personLocation: [''],
      zonesOfInterest: this.fb.array([]),
      essentialFeatures: this.fb.array([])
    })
  }

  getClient(id: number | string) {
    this.clientService.getById(id).subscribe(result => {
      this.generalForm.get('name')?.patchValue(result.name);
      this.generalForm.get('phone')?.patchValue(result.phone);
      this.generalForm.get('contactFrom')?.patchValue(result.contactFrom);
      this.generalForm.get('isPotentialInvestor')?.patchValue(result.isPotentialInvestor);
      this.generalForm.get('service_id')?.patchValue(result.service_id);
      this.generalForm.get('serviceName')?.patchValue(result.serviceName);
      this.generalForm.get('referrer')?.patchValue(result.referrer);

      this.operationForm.get('subServiceName')?.patchValue(result.subServiceName);
      this.operationForm.get('subService_id')?.patchValue(result.subService_id);
      this.operationForm.get('propertyOfInterest')?.patchValue(result.propertyOfInterest);
      this.operationForm.get('propertyLocation')?.patchValue(result.propertyLocation);
      this.operationForm.get('propertyDistribution')?.patchValue(result.propertyDistribution);
      this.operationForm.get('remodeledAreas')?.patchValue(result.remodeledAreas);
      this.operationForm.get('m2')?.patchValue(result.m2);
      this.operationForm.get('typeOfCapture')?.patchValue(result.typeOfCapture);
      this.operationForm.get('aspiredPrice')?.patchValue(result.aspiredPrice);
      this.operationForm.get('typeOfBusiness')?.patchValue(result.typeOfBusiness);
      this.operationForm.get('note')?.patchValue(result.note);
      this.operationForm.get('occupation')?.patchValue(result.occupation);
      this.operationForm.get('amountOfPeople')?.patchValue(result.amountOfPeople);
      this.operationForm.get('amountOfNights')?.patchValue(result.amountOfNights);
      this.operationForm.get('amountOfPets')?.patchValue(result.amountOfPets);
      this.operationForm.get('amountOfYounger')?.patchValue(result.amountOfYounger);
      this.operationForm.get('specificRequirement')?.patchValue(result.specificRequirement);
      this.operationForm.get('interestDate')?.patchValue(result.interestDate);
      this.operationForm.get('appointmentDate')?.patchValue(result.appointmentDate);
      this.operationForm.get('inspectionDate')?.patchValue(result.inspectionDate);
      this.operationForm.get('arrivingDate')?.patchValue(result.arrivingDate);
      this.operationForm.get('checkoutDate')?.patchValue(result.checkoutDate);
      this.operationForm.get('reasonOfStay')?.patchValue(result.reasonOfStay);
      this.operationForm.get('requirementStatus')?.patchValue(result.requirementStatus);
      this.operationForm.get('usageProperty')?.patchValue(result.usageProperty);
      this.operationForm.get('location')?.patchValue(result.location);
      this.operationForm.get('company')?.patchValue(result.company);
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
      data.zonesOfInterest = data.zonesOfInterest.map((zone: { value: string }) => zone.value);
      data.essentialFeatures = data.essentialFeatures.map((feature: { value: string }) => feature.value);
      data.user_id = this.userService.currentUser?.value.id;
      data.requirementStatus = 'Activo';
      data.aspiredPrice = !data.aspiredPrice ? '0' : data.aspiredPrice.replace(/[^0-9.]+/g, '').trim()


      if (this.isEditing) {
        data.id = this.id;
        this.clientService.updateOne(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.router.navigate(['/clientes'])
        }, (error) => {
          this.loading = false;
          this.uiService.createMessage('error', error.error.message)
        }, () => {
          this.loading = false;
        } )
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
    } else {
      this.logMissingFields();
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

    if (this.index === 1) {
      bool = this.operationForm.invalid
    }

    if (this.index === 5) {
      bool = false
    }

    return bool;
  }

  handleServiceSelection(id: number) {
    this.handleChangeService(id!)
    this.generalForm.get('serviceName')?.patchValue(this.getServiceName(id))
    this.operationForm.get('subServiceName')?.patchValue('');
    this.operationForm.get('subService_id')?.patchValue('');
    // if (id === 'Inmobiliario') {
    //   this.operationOptions = [
    //     'Alquiler residencial',
    //     'Alquiler comercial / industrial',
    //     'Alquiler vacacional',
    //     'Captacion'
    //   ]
    // } else if (id === 'Administrativo') {
    //   this.operationOptions = [
    //     'Administracion de inmueble alquilado',
    //     'Administracion de empresa'
    //   ]
    // } else if (id === 'Limpieza (Ama de llaves)') {
    //   this.operationOptions = [
    //     'Limpieza de inmueble vacacional',
    //     'Limpieza inmueble no vacacional',
    //     'Paquete basico',
    //     'Paquete flexible',
    //     'Paquete plus',
    //     'Paquete premium',
    //     'Lavanderia',
    //     'Planchado',
    //     'Cocina',
    //     'Organizacion de espacios',
    //     'Jardineria'
    //   ]
    // } else if (id === 'Mantenimiento') {
    //   this.operationOptions = [
    //     'Albañilería',
    //     'Plomería'
    //   ]
    // } else if (id === 'Remodelacion') {
    //   this.operationOptions = [
    //     'Remodelacion',
    //   ]
    // } else if (id === 'Contabilidad') {
    //   this.operationOptions = [
    //     'Contabilidad Seniat',
    //     'Contabilidad Seniat Parafiscales',
    //     'Contabilidad Seniat Alcaldia Parafiscales',
    //     'Declaracion ISLR',
    //     'Declaracion definitiva patente',
    //     'Carta de comisario',
    //     'Balance de apertura',
    //     'Informes de aprobacion estado financiero',
    //     'Estados financieros historicos',
    //     'Estados financieros reexpresados',
    //     'Certificacion de ingresos',
    //   ]
    // } else if (id === 'Legal') {
    //   this.operationOptions = [
    //     'Contrato de arrendamiento privado',
    //     'Contrato de arrendamiento notariado',
    //     'Finiquito visado',
    //     'Finiquito sin visado',
    //     'Compraventa registrada',
    //     'Promesa bilateral de compraventa',
    //     'Cedula catastral Naguanagua',
    //     'Cedula catastral Valencia',
    //     'Cedula catastral San Diego',
    //     'Constitucion de empresa CA',
    //     'Constitucion de empresa Pyme',
    //     'Constitucion de Firma Personal',
    //     'Acta de asamblea',
    //     'Permisos de apertura de negocio Naguanagua',
    //     'Permisos de apertura de negocio Valencia',
    //     'Permisos de apertura de negocio San Diego',
    //     'Bomberos Naguanagua',
    //     'Uso conforme Naguanagua',
    //     'Licencia de actividades economicas Naguanagua',
    //     'Licencia de licores Naguanagua',
    //     'Publicidad Naguanagua',
    //     'Poder registrado',
    //     'Declaracion sucesoral',
    //     'Liberacion de hipoteca',
    //     'Permiso de viaje',
    //     'Liberacion de enajenacion tribunales',
    //     'Titulo supletorio',
    //     'Registro de marca SAPI Caracas',
    //     'Inscripcion parafiscales',
    //   ]
    // }
  }

  get serviceType() {
    return this.generalForm.get('service_id')?.value;
  }

  get subService() {
    return this.operationForm.get('subService_id')?.value;
  }

  get serviceName() {
    return this.generalForm.get('serviceName')?.value;
  }

  get subServiceName() {
    return this.operationForm.get('subServiceName')?.value;
  }

  get personType() {
    return this.operationForm.get('typeOfPerson')?.value;
  }

  get personHeadquarters() {
    return this.operationForm.get('personHeadquarters')?.value;
  }

  get typeOfCapture() {
    return this.operationForm.get('typeOfCapture')?.value;
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


  handleOperationTypeSelect(id: number) {
    this.resetOperationForm();
    this.operationForm.get('subServiceName')?.patchValue(this.getSubServiceName(id))
    if (id === 35) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('aspiredPrice')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.operationForm.get('typeOfPerson')?.setValidators([Validators.required]);
      this.operationForm.get('amountOfPeople')?.setValidators([Validators.required]);
      this.operationForm.get('amountOfYounger')?.setValidators([Validators.required]);
      this.operationForm.get('amountOfPets')?.setValidators([Validators.required]);
    } else if (id === 72) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
      this.operationForm.get('aspiredPrice')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.operationForm.get('typeOfCapture')?.setValidators([Validators.required]);
    } else if (id === 73) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('amountOfPeople')?.setValidators([Validators.required]);
      this.operationForm.get('amountOfNights')?.setValidators([Validators.required]);
      this.operationForm.get('reasonOfStay')?.setValidators([Validators.required]);
    } else if (id === 74) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('aspiredPrice')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.operationForm.get('typeOfPerson')?.setValidators([Validators.required]);
      this.operationForm.get('usageProperty')?.setValidators([Validators.required]);
    } else if (id === 75) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
    } else if (id === 76) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
      this.operationForm.get('company')?.setValidators([Validators.required]);
    } else if (this.generalForm.get('service_id')?.value === 7) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
      this.operationForm.get('interestDate')?.setValidators([Validators.required]);
    } else if (this.generalForm.get('service_id')?.value === 9) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
      this.operationForm.get('specificRequirement')?.setValidators([Validators.required]);
    } else if (this.generalForm.get('service_id')?.value === 8) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
      this.operationForm.get('specificRequirement')?.setValidators([Validators.required]);
    } else if (this.generalForm.get('service_id')?.value === 5) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
      this.operationForm.get('company')?.setValidators([Validators.required]);
    } else if (this.generalForm.get('service')?.value === 2) {
      this.operationForm.get('propertyOfInterest')?.setValidators([Validators.required]);
      this.operationForm.get('location')?.setValidators([Validators.required]);
    } else {
      // this.operationForm.get('subService_id')?.patchValue(null);
    }

  }

  handlePersonTypeSelection(value: string) {
    if (value === 'Juridica') {
      this.operationForm.get('personEntry')?.setValidators([Validators.required]);
      this.operationForm.get('personHeadquarters')?.setValidators([Validators.required]);
      this.operationForm.get('occupation')?.clearValidators();
      this.operationForm.get('occupation')?.reset();
    } else {
      this.operationForm.get('occupation')?.setValidators([Validators.required])
      this.operationForm.get('personEntry')?.clearValidators();
      this.operationForm.get('personHeadquarters')?.clearValidators();
      this.operationForm.get('personEntry')?.reset();
      this.operationForm.get('personHeadquarters')?.reset();
    }


  }

  addZone() {
    const zoneForm = this.fb.group({
      value: ['']
    })

    this.zonesOfInterest.push(zoneForm);
  }

  deleteZone(index: number) {
    this.zonesOfInterest.removeAt(index);
  }

  addFeature() {
    const feature = this.fb.group({
      value: ['']
    })

    this.essentialFeatures.push(feature);
  }

  deleteFeature(index: number) {
    this.essentialFeatures.removeAt(index);
  }

  handleContactFromSelection(value: string) {
    if (value === 'Referido') {
      this.generalForm.get('referrer')?.setValidators([Validators.required])
    } else {
      this.generalForm.get('referrer')?.clearValidators()
      this.generalForm.get('referrer')?.reset()
      this.generalForm.get('referrer')?.removeValidators(Validators.required)
    }
  }

  checkService(serviceType: number, subService?: number) {
    if (subService) {
      return this.serviceType === serviceType && this.subService === subService
    } else {
      return this.serviceType === serviceType
    }
  }

  resetOperationForm() {
    this.zonesOfInterest.reset()
    this.essentialFeatures.reset()
    Object.keys(this.operationForm.controls).forEach(controlName => {
      const control = this.operationForm.get(controlName);
      if (controlName !== 'subService_id' &&   controlName !== 'subServiceName') {
        control?.clearValidators()
        control?.reset();
        control?.removeValidators(Validators.required)
      }
    });

  }

  logMissingFields() {
    Object.keys(this.operationForm.controls).forEach(controlName => {
      const control = this.operationForm.get(controlName);
      if (control?.invalid) {
        console.log(`Field '${controlName}' is missing or invalid.`);
      }
    });
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


  handleChangeService(serviceId: number) {
    this.subServicesLoading = true;
    this.servicesService.getSubServicesByServiceId(serviceId).subscribe(result => {
        this.subServices = result;
      }, _ => this.subServicesLoading = false,
      () => this.subServicesLoading = false)
  }

  getServiceName(id: number) {
    return this.services.find(ser => ser.id === id)?.title
  }

  getSubServiceName(id: number) {
    return this.subServices.find(sub => sub.id === id)?.title
  }


}
