import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from "./core/layouts/main-layout/main-layout.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {AuthLayoutComponent} from "./core/layouts/auth-layout/auth-layout.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/inicio'},
      {
        path: 'clientes',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'usuarios',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'administracion',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/administration/administration.module').then(m => m.AdministrationModule)
      },
      {
        path: 'aliados',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/allies/allies.module').then(m => m.AlliesModule)
      },
      {
        path: 'flujo-de-caja',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/cash-flow/cash-flow.module').then(m => m.CashFlowModule)
      },
      {
        path: 'calculo-de-comisiones',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/commission-calculation/commission-calculation.module').then(m => m.CommissionCalculationModule)
      },
      {
        path: 'inicio',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'asesores-externos',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/external-advisers/external-advisers.module').then(m => m.ExternalAdvisersModule)
      },
      {
        path: 'propiedades',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/properties/properties.module').then(m => m.PropertiesModule)
      },
      {
        path: 'propietarios',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/owners/owners.module').then(m => m.OwnersModule)
      },
    ]
  },
  {
    path: 'autenticacion',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
