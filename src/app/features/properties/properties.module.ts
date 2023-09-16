import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe, NgOptimizedImage} from '@angular/common';
import { MainComponent } from './main/main.component';
import {PropertiesRoutingModule} from "./properties-routing.module";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {SharedModule} from "../../shared/shared.module";
import { CreateComponent } from './create/create.component';
import { PreviewComponent } from './preview/preview.component';
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import { DraggableGridComponent } from './draggable-grid/draggable-grid.component';
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzModalModule} from "ng-zorro-antd/modal";
import { StatusHistoryComponent } from './status-history/status-history.component';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import {NzTagModule} from "ng-zorro-antd/tag";
import { CommissionConfigModalComponent } from './commission-config-modal/commission-config-modal.component';
import {NzSwitchModule} from "ng-zorro-antd/switch";
import { ReorderImagesModalComponent } from './reorder-images-modal/reorder-images-modal.component';
import {NzRadioModule} from "ng-zorro-antd/radio";



@NgModule({
  declarations: [
    MainComponent,
    CreateComponent,
    PreviewComponent,
    DraggableGridComponent,
    StatusHistoryComponent,
    StatusBadgeComponent,
    CommissionConfigModalComponent,
    ReorderImagesModalComponent
  ],
    imports: [
        CommonModule,
        PropertiesRoutingModule,
        NzBreadCrumbModule,
        SharedModule,
        NzStepsModule,
        NzFormModule,
        NzGridModule,
        NzInputModule,
        NzSelectModule,
        ReactiveFormsModule,
        NzButtonModule,
        NzIconModule,
        NzUploadModule,
        NgOptimizedImage,
        NzToolTipModule,
        NzEmptyModule,
        NzDividerModule,
        CdkDropList,
        CdkDrag,
        CdkDropListGroup,
        NzCheckboxModule,
        NzModalModule,
        FormsModule,
        NzTagModule,
        NzSwitchModule,
        NzRadioModule
    ],
  providers: [CurrencyPipe]
})
export class PropertiesModule { }
