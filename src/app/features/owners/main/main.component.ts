import {AfterViewInit, Component, Host, OnInit, Optional, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {setHeaders} from "../../../shared/utils/generic-table";
import {NzModalService} from "ng-zorro-antd/modal";
import {GenericTableComponent} from "../../../shared/components/generic-table/generic-table.component";
import {Owner} from "../../../core/interfaces/owner";
import {OwnerService} from "../../../core/services/owner.service";
import {UiService} from "../../../core/services/ui.service";
import * as moment from 'moment';
import formatDatesFilter from "../../../shared/utils/formatDatesFilter";
import {DocumentInputDirective} from "../../../shared/directives/document-input.directive";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  loading = true;
  @ViewChild('dataTable') dataTable!: GenericTableComponent;
  data: Partial<Owner>[]  = [];
  headers: any[] = [];
  pageIndex = 1;
  totalItems = 1;
  pageSize = 10;
  showFiltersDrawer = false
  date: any = '';
  isInvestor = null;
  constructor(
    private router: Router,
    private modal: NzModalService,
    private ownerService: OwnerService,
    private uiService: UiService,
    @Host() @Optional() private documentDirective: DocumentInputDirective
  ) {}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getOwners();
  }

  handleEdit(id: number) {
    this.router.navigate([`/propietarios/${id}`])
  }

  handleDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Atencion',
      nzContent: 'Eliminar el elemento ?',
      nzCancelText: 'Cancelar',
      nzOkText: 'Aceptar',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.ownerService.deleteOne(id).subscribe(result => {
          this.uiService.createMessage('success', result.message)
          this.getOwners()
          setTimeout(() => resolve(), 500);
        }, (error) => {
          this.uiService.createMessage('error', error.error.message)
        })
      })
    });
  }

  handleNewOwner() {
    this.router.navigate(['/propietarios/crear']);
  }

  getOwners() {
    this.loading = true;
    this.ownerService.getAllPaginated(
      this.pageIndex,
      this.pageSize,
      this.date[0] ? this.date[0] : '',
      this.date[1] ? this.date[1] : '',
      this.isInvestor === null ? '' : this.isInvestor,
    ).subscribe(data => {
        this.totalItems = data.count;
        this.data = data.rows.map(element => ({
          id: element.id,
          firstName: element.firstName,
          lastName: element.lastName,
          phone: element.phone,
          email: element.email,
          customBirthdate: element.birthdate ? moment(element.birthdate).calendar() : '-',
          ci: element.ci ? element.ci : '-',
          customIsInvestor: element.isInvestor ? 'Si' : 'No'
        }));
        const headers = setHeaders([
          {key: 'firstName', displayName: 'Nombre'},
          {key: 'lastName', displayName: 'Apellido'},
          {key: 'phone', displayName: 'Telefono'},
          {key: 'email', displayName: 'Correo'},
          // {key: 'customBirthdate', displayName: 'Fecha de cumpleanos'},
          {key: 'ci', displayName: 'Cedula de identidad'},
          {key: 'customIsInvestor', displayName: 'Es inversor?'},
        ]);

        this.dataTable.render(headers, this.data);
      },
      () => {
        this.loading = false
      },
      () => {
        this.loading = false
      }
    )
  }

  handlePageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getOwners();
  }

  closeFilterModal() {
    this.showFiltersDrawer = false;
  }

  onChangeDate(date: any[]) {
    if (date.length < 1) {
      this.date = '';
    } else {
      this.date = formatDatesFilter(date);
    }
  }
}
