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
  {
    path: 'list',
    loadComponent: () => import('./recipes/list/list.page').then( m => m.ListPage)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./recipes/favorites/favorites.page').then( m => m.FavoritesPage)
  },
  {
    path: 'recipe',
    loadComponent: () => import('./recipes/recipe/recipe.page').then( m => m.RecipePage)
  },
  {
    path: 'new',
    loadComponent: () => import('./recipes/new/new.page').then( m => m.NewPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./shoppingList/cart/cart.page').then( m => m.CartPage)
  },
  {
    path: 'ia',
    loadComponent: () => import('./recipes/ia/ia.page').then( m => m.IaPage)
  },
  {
    path: 'planning',
    loadComponent: () => import('./agenda/planning/planning.page').then( m => m.PlanningPage)
  },
  {
    path: 'cook',
    loadComponent: () => import('./recipes/cook/cook.page').then( m => m.CookPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
];
