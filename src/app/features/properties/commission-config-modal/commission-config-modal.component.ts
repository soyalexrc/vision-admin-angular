import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PropertyReview} from "../../../core/interfaces/property";
import {PropertyService} from "../../../core/services/property.service";
import {BehaviorSubject, Subscription} from "rxjs";
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
export class CommissionConfigModalComponent implements OnInit, OnDestroy {
  @Input() show!: boolean;
  @Input() status!: string;
  property: PropertyReview | null = null;
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  loading = false
  propertySubscription = new Subscription();
  allowedEditionSubscription = new Subscription();
  allowedEdition: BehaviorSubject<AllowedSelection> = new BehaviorSubject<AllowedSelection>('Percentage')
  typeOFAllowedEdition = false;

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
      commissionPercentage: [{value: '', disabled: false}, Validators.required],
      commissionAmount: [{value: '', disabled: true}, Validators.required],
      subtotalCommissionAmount: [{value: '', disabled: true}, Validators.required],
      operationExpense: [''],
      operationExpenseDetail: [''],
      propertyAdviser: ['', Validators.required],
      clientAdviser: ['', Validators.required],
      propertyAdviserAttention: [{value: true, disabled: true}, Validators.required],
      propertyAdviserExhibition: [{value: true, disabled: true}, Validators.required],
      propertyAdviserBusinessClosing: [{value: true, disabled: true}, Validators.required],
      propertyAdviserAdminProcedure: [{value: true, disabled: true}, Validators.required],
      clientAdviserAttention: [{value: true, disabled: true}, Validators.required],
      clientAdviserExhibition: [{value: true, disabled: true}, Validators.required],
      clientAdviserBusinessClosing: [{value: true, disabled: true}, Validators.required],
      clientAdviserAdminProcedure: [{value: true, disabled: true}, Validators.required],
      commission: ['', Validators.required],
      propertyAdviserFinalCommission: [''],
      clientAdviserFinalCommission: [''],
    })

    // this.allowedEditionSubscription = this.allowedEdition.subscribe(value => {
    //   if (value === 'Amount') {
    //     this.getCommissionPercentage?.disable()
    //     this.getSubtotalCommissionAmount?.enable()
    //     this.typeOFAllowedEdition = true;
    //   } else {
    //     this.getCommissionPercentage?.enable()
    //     this.getSubtotalCommissionAmount?.disable()
    //     this.typeOFAllowedEdition = false;
    //   }
    // })

    this.getCommissionAmount?.valueChanges.subscribe(value => {
      this.propertyAdviserFinalCommission?.patchValue(value / 2);
      this.clientAdviserFinalCommission?.patchValue(value / 2);

      if (value === 0) {
        this.form.get('propertyAdviserAttention')?.patchValue(true)
        this.form.get('propertyAdviserExhibition')?.patchValue(true)
        this.form.get('propertyAdviserBusinessClosing')?.patchValue(true)
        this.form.get('propertyAdviserAdminProcedure')?.patchValue(true)
        this.form.get('clientAdviserAttention')?.patchValue(true)
        this.form.get('clientAdviserExhibition')?.patchValue(true)
        this.form.get('clientAdviserBusinessClosing')?.patchValue(true)
        this.form.get('clientAdviserAdminProcedure')?.patchValue(true)

        this.form.get('propertyAdviserAttention')?.disable()
        this.form.get('propertyAdviserExhibition')?.disable()
        this.form.get('propertyAdviserBusinessClosing')?.disable()
        this.form.get('propertyAdviserAdminProcedure')?.disable()
        this.form.get('clientAdviserAttention')?.disable()
        this.form.get('clientAdviserExhibition')?.disable()
        this.form.get('clientAdviserBusinessClosing')?.disable()
        this.form.get('clientAdviserAdminProcedure')?.disable()
      } else {
        this.form.get('propertyAdviserAttention')?.enable()
        this.form.get('propertyAdviserExhibition')?.enable()
        this.form.get('propertyAdviserBusinessClosing')?.enable()
        this.form.get('propertyAdviserAdminProcedure')?.enable()
        this.form.get('clientAdviserAttention')?.enable()
        this.form.get('clientAdviserExhibition')?.enable()
        this.form.get('clientAdviserBusinessClosing')?.enable()
        this.form.get('clientAdviserAdminProcedure')?.enable()
      }
    })

    this.propertySubscription = this.propertyService.currentPropertyReview.subscribe(property => {
      this.property = property
      // this.getFinalPrice?.patchValue(this.property?.price);
      // if (property?.operationType === 'Alquiler') {
        // this.getSubtotalCommissionAmount?.patchValue(this.property?.price);
        // this.calculateCommissionByAmount()
        //   sacar porcentaje basado en este precio
      // }
    })
  }

  // ngOnChanges(changes: ComponentChanges<CommissionConfigModalComponent>) {
  //   console.log(this.status);
  // }

  ngOnDestroy() {
    this.propertySubscription.unsubscribe();
    this.allowedEditionSubscription.unsubscribe();
  }

  handleCancelSetCommission() {

  }


  getTooltipCommissionAmount(): string {
    if (this.property?.operationType === 'Alquiler') {
      return `Esta propiedad se cerro en ALQUILER, con un monto inicial de ${formatCurrency(Number(this.property?.price), 'en', '$')}`
    }
    return `Esta propiedad se cerro en VENTA con un monto inicial de ${formatCurrency(Number(this.property?.price), 'en', '$')}`;
  }

  getAdvisers() {
    this.userService.getAll(1, 1).subscribe(result => {
      this.advisers = result.rows;
    })
  }

  getAdviserLabel(adviser: User) {
    return `${adviser.firstName} ${adviser.lastName} (${adviser.username})`;
  }


  calculateCommissionByAmount() {
    if (this.allowedEdition.value === 'Percentage') return;
    const finalPrice = Number(this.getFinalPrice?.value);
    const subtotalCommissionAmount = Number(this.getSubtotalCommissionAmount?.value);
    const operationExpense = Number(this.form.get('operationExpense')?.value);

    if (!subtotalCommissionAmount) return;

    let substraction = finalPrice - subtotalCommissionAmount;
    let division = substraction / finalPrice;

    // TODO calcular procentaces correctamente
    this.getCommissionPercentage?.patchValue(this.roundUp(Math.abs((division * 100) - 100), 2))
    this.getCommissionAmount?.patchValue(this.roundUp((Math.abs((division * 100) - 100) - operationExpense), 2));

  }

  calculateCommissionByPercentage() {
    if (this.allowedEdition.value === 'Amount') return;

    const finalPrice = Number(this.getFinalPrice?.value);
    const commissionPercentage = Number(this.getCommissionPercentage?.value)
    const operationExpense = Number(this.form.get('operationExpense')?.value);

    if (!commissionPercentage) return;

    let multiply = commissionPercentage / 100;

    this.getSubtotalCommissionAmount?.patchValue(multiply * finalPrice);
    this.getCommissionAmount?.patchValue((multiply * finalPrice) - operationExpense);

  }

  get getCommissionAmount() {return this.form.get('commissionAmount');}
  get getSubtotalCommissionAmount() {return this.form.get('subtotalCommissionAmount');}
  get getCommission() {return this.form.get('commission');}
  get getFinalPrice() {return this.form.get('finalPrice');}
  get getCommissionPercentage() {return this.form.get('commissionPercentage');}
  get propertyAdviserFinalCommission() {return this.form.get('propertyAdviserFinalCommission');}
  get clientAdviserFinalCommission() {return this.form.get('clientAdviserFinalCommission');}

  calculateBothCommissions() {
    this.calculateCommissionByPercentage();
    this.calculateCommissionByAmount();
  }

  roundUp(num: number, precision: number) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }

  handleCancel() {
    // this.form.reset();
    this.ngOnInit();
    this.onCancel.emit()
  }

  // handleChangeToggleAllowed($event: any) {
  //   if ($event) {
  //     this.allowedEdition.next('Amount')
  //   } else {
  //     this.allowedEdition.next('Percentage')
  //   }
  // }

  handleCalculateDivisionByFeature(event: boolean, type: string) {
    const quarter= (Number(this.getCommissionAmount?.value) / 2) * 0.25;
    const half= (Number(this.getCommissionAmount?.value) / 2);
    if (type === 'client') {
      if (event) {
        if (Number(this.clientAdviserFinalCommission?.value) >= half)  {
          this.clientAdviserFinalCommission?.patchValue(half);
          return
        }
        this.clientAdviserFinalCommission?.patchValue(this.clientAdviserFinalCommission?.value + quarter);
      } else {
        this.clientAdviserFinalCommission?.patchValue(this.clientAdviserFinalCommission?.value - quarter);
        this.propertyAdviserFinalCommission?.patchValue(this.propertyAdviserFinalCommission?.value + quarter);
      }
    } else {
      if (event) {
        if (Number(this.propertyAdviserFinalCommission?.value) >= half)  {
          this.propertyAdviserFinalCommission?.patchValue(half);
          return
        }
        this.propertyAdviserFinalCommission?.patchValue(this.propertyAdviserFinalCommission?.value + quarter);
      } else {
        this.propertyAdviserFinalCommission?.patchValue(this.propertyAdviserFinalCommission?.value - quarter);
        if (this.status === 'Cerrado por Vision doble punta') {
          this.clientAdviserFinalCommission?.patchValue(this.clientAdviserFinalCommission?.value + quarter);
        }
      }
    }
  }

  calculateCommissionByType(type: any) {
    const finalPrice = Number(this.getFinalPrice?.value);
    const operationExpense = Number(this.form.get('operationExpense')?.value);

    if (this.property?.operationType === 'Venta') {
      if (type === 10 || type === 5) {
        this.getCommissionPercentage?.patchValue(type);
        this.calculateCommissionByPercentage();
      } else {
        this.getCommissionAmount?.patchValue(type);
        this.calculateCommissionByAmount();
      }
    } else {
      if (type === 'oneMonth') {
        this.getSubtotalCommissionAmount?.patchValue(finalPrice)
        this.getCommissionAmount?.patchValue(finalPrice - operationExpense)
      } else if (type === 'twoMonths') {
        this.getSubtotalCommissionAmount?.patchValue(finalPrice * 2)
        this.getCommissionAmount?.patchValue((finalPrice * 2) - operationExpense)
      }
    }
  }
}
