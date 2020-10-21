import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';
import { AppRoutingModule } from './app-routing.module';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReviewPageComponent } from './pages/review-page/review-page.component';
import { AuthComponent } from './pages/auth/auth.component';
import { SignoutComponent } from './components/signout/signout.component';
import { FourOhFourComponent } from './pages/four-oh-four/four-oh-four.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageHeaderComponent,
    PageFooterComponent,
    CardContainerComponent,
    ReviewPageComponent,
    AuthComponent,
    SignoutComponent,
    FourOhFourComponent,
    DeleteAccountComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
