import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./auth/sign-up/sign-up.page').then((m) => m.SignUpPage),
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./config/account/account.page').then((m) => m.AccountPage),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./config/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'my-recipes',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/recipes/my-recipes/my-recipes.page').then(
        (m) => m.MyRecipesPage
      ),
  },

  {
    path: 'recipes',
    loadComponent: () =>
      import('./features/recipes/list/list.page').then((m) => m.ListPage),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/recipes/favorites/favorites.page').then(
        (m) => m.FavoritesPage
      ),
  },
  {
    path: 'recipe',
    loadComponent: () =>
      import('./features/recipes/recipe/recipe.page').then((m) => m.RecipePage),
  },
  {
    path: 'new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/recipes/new/new.page').then((m) => m.NewPage),
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/shoppingList/cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: 'ia',
    loadComponent: () =>
      import('./features/recipes/ia/ia.page').then((m) => m.IaPage),
  },
  {
    path: 'agenda',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/agenda/planning/planning.page').then(
        (m) => m.PlanningPage
      ),
  },
  {
    path: 'cook',
    loadComponent: () =>
      import('./features/recipes/cook/cook.page').then((m) => m.CookPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'my-recipes',
    loadComponent: () =>
      import('./features/recipes/my-recipes/my-recipes.page').then(
        (m) => m.MyRecipesPage
      ),
  },
];
