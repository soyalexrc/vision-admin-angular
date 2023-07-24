import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {OperationsResumeComponent} from "./operations-resume/operations-resume.component";
import {CreateComponent} from "./create/create.component";

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowRoutingModule { }
