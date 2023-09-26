import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../core/services/ui.service";
import {SERVICE_OPTIONS} from "../../utils/services";
import {ServicesService} from "../../../core/services/services.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-config-services-modal',
  templateUrl: './config-services-modal.component.html',
  styleUrls: ['./config-services-modal.component.scss']
})
export class ConfigServicesModalComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  @Output() onFinished: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() showModal: boolean = false;
  @Input() servicesLoading: boolean = false;
  @Input() services: any[] = [];
  showTitleAndSubServices = false;
  loadingSubServices = false


  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private uiService: UiService,
    private userService: UserService,
    private modal: NzModalService,
  ) {
  }


  ngOnInit() {
    this.form = this.fb.group({
      serviceId: [null, Validators.required],
      serviceTitle: ['', Validators.required],
      subServices: this.fb.array([])
    })
  }


  handleOkModal(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      if (data.serviceId) {
        this.servicesService.updateService(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.form.reset();
          this.showTitleAndSubServices = false;
          this.onFinished.emit();
          this.onClose.emit();
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      } else {
        this.servicesService.createService(data).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.form.reset();
          this.showTitleAndSubServices = false;
          this.onFinished.emit();
          this.onClose.emit();
        }, () => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      }
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  handleCancel() {
    this.form.reset();
    this.showTitleAndSubServices = false;
    this.onCancel.emit(false)
  }

  protected readonly SERVICE_OPTIONS = SERVICE_OPTIONS;

  handleSelectService(value: any) {
    if (value === 0) {
      this.form.get('serviceTitle')?.reset();
      this.subServices.clear();
      this.showTitleAndSubServices = true;
    } else if (value > 0) {
      this.subServices.clear();
      this.loadingSubServices = true;
      this.showTitleAndSubServices = true;
      this.form.get('serviceTitle')?.patchValue(this.services.find(service => service.id === value)?.title)
      this.servicesService.getSubServicesByServiceId(value).subscribe(result => {
        result.forEach((subService) => {
          this.addSubService(subService.title, subService.id)
        })
      }, _ => {
        this.loadingSubServices = false;
      }, () => {
        this.loadingSubServices = false;
      })
    }
  }

  get subServices() {
    return this.form.controls["subServices"] as FormArray;
  }

  get serviceTitle() {
    return this.form.get('serviceTitle')?.value;
  }

  get serviceId() {
    return this.form.get('serviceId')?.value;
  }

  addSubService(title = '', id: null | number = null) {
    const subService = this.fb.group({
      title: [title, Validators.required],
      id: [id]
    })

    this.subServices.push(subService);
  }

  deleteSubService(position: number) {
    const hasId = Boolean(this.subServices.at(position).value.id);
    if (!hasId) {
      this.subServices.removeAt(position);
    } else {
      const optionName = this.subServices.at(position).value.title;
      const id = this.subServices.at(position).value.id;
      //   TODO servicio de eliminado de subservice con pop confirm
      this.modal.confirm({
        nzTitle: 'Atencion',
        nzAutofocus: 'ok',
        nzContent: `Se eliminara la opcion "${optionName}", quieres continuar?`,
        nzCancelText: 'Cancelar',
        nzOkText: 'Aceptar',
        nzOnOk: () => new Promise((resolve, reject) => {
          this.loadingSubServices = true;
          this.servicesService.deleteSubService(id).subscribe(result => {
              this.subServices.clear()
              this.handleSelectService(this.form.get('serviceId')?.value);
              this.uiService.createMessage('success', result.message);
              setTimeout(() => resolve(), 500)
            }, (error) => {
              this.uiService.createMessage('error', error.error.message);
              setTimeout(() => resolve(), 500)
              this.loadingSubServices = false
            },
            () => {
              this.loadingSubServices = false
            })
        })
      });
    }
  }

  onlyIfIsAdmin() {
    return this.userService.onlyIfIsAdmin()
  }
}
