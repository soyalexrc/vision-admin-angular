import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from "./core/layouts/main-layout/main-layout.component";
import {AuthLayoutComponent} from "./core/layouts/auth-layout/auth-layout.component";
import {AuthenticationGuard} from "./core/guards/authentication.guard";
import {RoleBasedGuard} from "./core/guards/role-based.guard";

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthenticationGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: '/inicio'},
      {
        path: 'clientes',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'usuarios',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'administracion',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/administration/administration.module').then(m => m.AdministrationModule)
      },
      {
        path: 'aliados',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/allies/allies.module').then(m => m.AlliesModule)
      },
      {
        path: 'flujo-de-caja',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/cash-flow/cash-flow.module').then(m => m.CashFlowModule)
      },
      {
        path: 'calculo-de-comisiones',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/commission-calculation/commission-calculation.module').then(m => m.CommissionCalculationModule)
      },
      {
        path: 'inicio',
        component: MainLayoutComponent,
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'asesores-externos',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/external-advisers/external-advisers.module').then(m => m.ExternalAdvisersModule)
      },
      {
        path: 'propiedades',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/properties/properties.module').then(m => m.PropertiesModule)
      },
      {
        path: 'propietarios',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/owners/owners.module').then(m => m.OwnersModule)
      },
      {
        path: 'gestion-de-archivos',
        canActivate: [RoleBasedGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./features/files-management/files-management.module').then(m => m.FilesManagementModule)
      },
    ]
  },
  {
    path: 'autenticacion',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'export-pdf',
    canActivateChild: [AuthenticationGuard],
    loadChildren: () => import('./features/pdf/pdf.module').then(m => m.PdfModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
