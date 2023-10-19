import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Client} from "../../../core/interfaces/client";
import {ClientService} from "../../../core/services/client.service";
import {OwnerService} from "../../../core/services/owner.service";
import {UserService} from "../../../core/services/user.service";
import {AdviserService} from "../../../core/services/adviser.service";
import {AllyService} from "../../../core/services/ally.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FileService} from "../../../core/services/file.service";
import {UiService} from "../../../core/services/ui.service";

interface SelectionOption {
  id: string | number;
  email: string;
  type: string;
  label: string;
}

@Component({
  selector: 'app-require-signature-modal',
  templateUrl: './require-signature-modal.component.html',
  styleUrls: ['./require-signature-modal.component.scss']
})
export class RequireSignatureModalComponent implements OnInit {
  loading = false;
  @Input() show = false;
  @Input() filePath = '';
  @Output() onCompleted: EventEmitter<any> = new EventEmitter<any>();
  emailToSend = '';
  selectionOptions: SelectionOption[] = [];

  filterByOptions: string[] = [
    'Clientes',
    'Propietarios',
    'Aliados',
    'Asesores externos',
  ];

  form!: FormGroup;
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private clientService: ClientService,
    private ownerService: OwnerService,
    private adviserService: AdviserService,
    private allieService: AllyService,
    private uiService: UiService,
    private fileService: FileService,
    private fb: FormBuilder,
    private userService: UserService,
  ) {

  }


  ngOnInit() {
    this.form = this.fb.group({
      filterBy: ['', Validators.required],
      sendTo: [{}, Validators.required]
    })
  }

  handleOk() {
    this.loading = true;
    this.fileService.sendDigitalSignatureRequest(this.sendTo, this.filePath, this.userService.currentUser.value.username!).subscribe(res => {
      this.uiService.createMessage('success', res.message)
      this.form.get('filterBy')?.patchValue('');
      this.form.get('sendTo')?.patchValue({});
      this.onCompleted.emit();
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
    this.loading = false;
    }, () => {
      this.loading = false;
    })
  }

  handleCancel() {

  }

  handleChangeSelectFilterBy(value: string) {
    switch (value) {
      case 'Clientes':
        this.loading = true;
        this.clientService.getAll().subscribe(res => {
          this.loading = false;
          this.selectionOptions = res.map(client => {
            return {
              label: client.name,
              email: 'sample@sample.com',
              id: client.id,
              type: this.filterBy,
            }
          });
        })
        break;

      case 'Propietarios':
        this.loading = true;
        this.ownerService.getAll().subscribe(res => {
          this.loading = false;
          this.selectionOptions = res.map(owner => {
            return {
              label: `${owner.firstName} ${owner.lastName}`,
              id: owner.id,
              email: owner.email,
              type: this.filterBy,
            }
          });
        })
        break;

      case 'Aliados':
        this.loading = true;
        this.allieService.getAll().subscribe(res => {
          this.loading = false;
          this.selectionOptions = res.map(ally => {
            return {
              label: `${ally.firstName} ${ally.lastName}`,
              id: ally.id,
              email: ally.email,
              type: this.filterBy,
            }
          });
        })
        break;

      case 'Asesores externos':
        this.loading = true;
        this.adviserService.getAll().subscribe(res => {
          this.loading = false;
          this.selectionOptions = res.map(adviser => {
            return {
              label: `${adviser.firstName} ${adviser.lastName}`,
              id: adviser.id,
              email: adviser.email,
              type: this.filterBy,
            }
          });
        })
        break;

      default:
        break;
    }
  }

  get filterBy() {
    return this.form.get('filterBy')?.value;
  }

  get sendTo() {
    return this.form.get('sendTo')?.value;
  }

  getFilterByLabel() {
    switch (this.filterBy) {
      case 'Clientes':
        return 'Seleccionar cliente';

      case 'Propietarios':
        return 'Seleccionar propietario';

      case 'Aliados':
        return 'Seleccionar aliado';

      case 'Asesores externos':
        return 'Seleccionar asesor externo';

      default:
        return '';
    }
  }
}
