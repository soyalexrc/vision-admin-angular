import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {CreateComponent} from "./create/create.component";
import {PreviewComponent} from "./preview/preview.component";
import {StatusHistoryComponent} from "./status-history/status-history.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'crear',
    component: CreateComponent,
  },
  {
    path: ':id',
    component: CreateComponent,
  },
  {
    path: 'vista-previa/:id',
    component: PreviewComponent,
  },
  {
    path: 'historial/:id',
    component: StatusHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule { }
