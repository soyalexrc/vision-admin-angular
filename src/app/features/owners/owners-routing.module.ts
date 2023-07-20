import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnersRoutingModule { }
