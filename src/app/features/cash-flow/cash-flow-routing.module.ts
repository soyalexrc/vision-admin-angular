import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {OperationsResumeComponent} from "./operations-resume/operations-resume.component";
import {CreateComponent} from "./create/create.component";
import {TotalAvailableComponent} from "./total-available/total-available.component";
import {CloseCashFlowComponent} from "./close-cash-flow/close-cash-flow.component";

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
    path: 'editar/:id',
    component: CreateComponent,
  },
  {
    path: 'resumen-de-operaciones',
    component: OperationsResumeComponent,
  },
  {
    path: 'total-disponible',
    component: TotalAvailableComponent,
  },
  {
    path: 'cierre-de-caja',
    component: CloseCashFlowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowRoutingModule { }
