import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {DeleteRequestsComponent} from "./delete-requests/delete-requests.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'solicitudes-de-eliminacion',
    component: DeleteRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesManagementRoutingModule { }
