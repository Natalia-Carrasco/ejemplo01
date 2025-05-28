import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { ProductListComponent } from './product/product-list/product-list.component';
import { FormsModule } from "@angular/forms"

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import { StarComponent } from './product/product-list/star/star.component';

import { HttpClientModule } from '@angular/common/http';
import { DefaultPipe } from './shared/image.pipe';



registerLocaleData(localeEsCL, 'es-CL');

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    StarComponent,
    DefaultPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBootstrapIconsModule.pick(allIcons),
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide:
      LOCALE_ID,
    useValue:
      'es-CL'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
