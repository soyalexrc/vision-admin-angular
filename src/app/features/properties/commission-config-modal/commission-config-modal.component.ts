import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PropertyReview} from "../../../core/interfaces/property";
import {PropertyService} from "../../../core/services/property.service";
import {Subscription} from "rxjs";
import {formatCurrency} from "@angular/common";
import {UserService} from "../../../core/services/user.service";
import {User} from "../../../core/interfaces/user";
import {SERVICE_OPTIONS} from "../../../shared/utils/services";

type AllowedSelection = 'Percentage' | 'Amount'


type ComponentChange<T, P extends keyof T> = {
  previousValue: T[P];
  currentValue: T[P];
  firstChange: boolean;
}

type ComponentChanges<T> = {
  [P in keyof T]?: ComponentChange<T, P>
}

@Component({
  selector: 'app-commission-config-modal',
  templateUrl: './commission-config-modal.component.html',
  styleUrls: ['./commission-config-modal.component.scss']
})
export class CommissionConfigModalComponent implements OnInit, OnChanges{
  @Input() show!: boolean;
  @Input() status!: string;
  property: PropertyReview | null = null;
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  loading = false
  propertySubscription = new Subscription();
  allowedEdition: AllowedSelection = 'Percentage'

  form!: FormGroup;
  advisers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getAdvisers();
    this.form = this.fb.group({
      finalPrice: ['', Validators.required],
      commissionPercentage: ['', Validators.required],
      commissionAmount: ['', Validators.required],
      propertyAdviser: ['', Validators.required],
      clientAdviser: ['', Validators.required],
      propertyAdviserAttention: [true, Validators.required],
      propertyAdviserExhibition: [true, Validators.required],
      propertyAdviserBusinessClosing: [true, Validators.required],
      propertyAdviserAdminProcedure: [true, Validators.required],
      clientAdviserAttention: [true, Validators.required],
      clientAdviserExhibition: [true, Validators.required],
      clientAdviserBusinessClosing: [true, Validators.required],
      clientAdviserAdminProcedure: [true, Validators.required],

      propertyAdviserFinalCommission: [''],
      clientAdviserFinalCommission: [''],
    })

    this.propertySubscription = this.propertyService.currentPropertyReview.subscribe(property => {
      console.log(property)
      this.property = property
      // this.getFinalPrice?.patchValue(this.property?.price);
      if (property?.operationType === 'Alquiler') {
        this.getCommissionAmount?.patchValue(this.property?.price);
        this.calculateCommissionByAmount()
          //   sacar porcentaje basado en este precio
      }
    })
  }

  ngOnChanges(changes: ComponentChanges<CommissionConfigModalComponent>) {
    console.log(this.status);
  }

  handleCancelSetCommission() {

  }




  getTooltipCommissionAmount(): string {
    if (this.property?.operationType === 'Alquiler') {
      return `Esta propiedad se cerro en ALQUILER, por el monto de ${formatCurrency(Number(this.property?.price), 'en', '$')}`
    }
    return `Esta propiedad se cerro en VENTA por el monto de ${formatCurrency(Number(this.property?.price), 'en', '$')}`;
  }

  getAdvisers() {
    this.userService.getAll().subscribe(result => {
      this.advisers = result;
    })
  }

  getAdviserLabel(adviser: User) {
    return `${adviser.first_name} ${adviser.last_name} (${adviser.username})`;
  }


  calculateCommissionByAmount() {
    if (this.allowedEdition === 'Percentage') return;
    const finalPrice = Number(this.getFinalPrice?.value);
    const commissionAmount = Number(this.getCommissionAmount?.value);

    if (!commissionAmount) return;

    console.log({
      finalPrice,
      commissionAmount
    })

    let substraction = finalPrice - commissionAmount;
    let division = substraction / finalPrice;

    console.log({
      substraction,
      division
    })

    // TODO calcular procentaces correctamente
    this.getCommissionPercentage?.patchValue(this.roundUp(Math.abs((division * 100) - 100), 2))
  }

  calculateCommissionByPercentage() {
    if (this.allowedEdition === 'Amount') return;

    const finalPrice = Number(this.getFinalPrice?.value);
    const commissionPercentage = Number(this.getCommissionPercentage?.value)

    console.log({
      finalPrice,
      commissionPercentage
    })

    if (!commissionPercentage) return;

    let multiply = commissionPercentage / 100;

    console.log({
      multiply
    })

    this.getCommissionAmount?.patchValue(multiply * finalPrice);

  }

  get getCommissionAmount() {
    return this.form.get('commissionAmount');
  }
  get getFinalPrice() {
    return this.form.get('finalPrice');
  }

  get getCommissionPercentage() {
    return this.form.get('commissionPercentage');
  }

  calculateBothCommissions() {
    this.calculateCommissionByPercentage();
    // this.calculateCommissionByAmount();
  }

  roundUp(num: number, precision: number) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }
}
