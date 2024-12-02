import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./auth/sign-up/sign-up.page').then( m => m.SignUpPage)
  },
  {
    path: 'account',
    loadComponent: () => import('./config/account/account.page').then( m => m.AccountPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./config/settings/settings.page').then( m => m.SettingsPage)
  },
];
