import { SignoutComponent } from './components/signout/signout.component';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { FourOhFourComponent } from './pages/four-oh-four/four-oh-four.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { ReviewPageComponent } from './pages/review-page/review-page.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'auth',
    pathMatch: 'full',
    component: AuthComponent
  },
  {
    path: 'signOut',
    pathMatch: 'full',
    component: SignoutComponent
  },
  {
    path: 'deleteAccount',
    pathMatch: 'full',
    component: DeleteAccountComponent
  },
  {
    path: 'review/:slug',
    component: ReviewPageComponent
  },
  {
    path: '**',
    component: FourOhFourComponent
  },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
