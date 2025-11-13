import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'homescreen',
    loadChildren: () => import('./pages/homescreen/homescreen.module').then( m => m.HomescreenPageModule)
  },
  {
    path: 'chatbot',
    loadChildren: () => import('./pages/chatbot/chatbot.module').then( m => m.ChatbotPageModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'register2',
    loadChildren: () => import('./pages/register2/register2.module').then( m => m.Register2PageModule)
  },
  {
    path: 'register3',
    loadChildren: () => import('./pages/register3/register3.module').then( m => m.Register3PageModule)
  },
  
   {
     path: '',
     redirectTo: 'welcome',
     pathMatch: 'full'
   },  {
    path: 'register-organizer',
    loadChildren: () => import('./pages/register-organizer/register-organizer.module').then( m => m.RegisterOrganizerPageModule)
  },

  




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
