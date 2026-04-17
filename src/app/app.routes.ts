import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth-guard';
import { canActivateChildGuard } from './guards/can-activate-child-guard';
import { canDeactivateGuard } from './guards/can-deactivate-guard';
import { canMatchGuard } from './guards/can-match-guard';


export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.Login) },
  { path: 'nosotros', loadComponent: () => import('./features/nosotros/nosotros').then(m => m.Nosotros) },
  { path: 'suscripcion', loadComponent: () => import('./features/suscripcion/suscripcion').then(m => m.Suscripcion) },
  { path: 'tienda', loadComponent: () => import('./features/tienda/tienda').then(m => m.Tienda) },
  { path: 'torneos', loadComponent: () => import('./shared/torneos/torneos').then(m => m.Torneos) },
  { 
    path: 'registros', 
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
    loadComponent: () => import('./features/registros/registros').then(m => m.Registros)
  },
  { 
    path: 'admin',
    canActivate: [adminGuard],
    canMatch: [canMatchGuard],
    canActivateChild: [canActivateChildGuard],
    canDeactivate: [canDeactivateGuard],
    loadComponent: () => import('./features/admin/admin').then(m => m.AdminComponent)
  },
  { path: '**', redirectTo: '' }
];