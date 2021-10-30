import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ExchangeRates } from './exchange-rates/exchange-rates.component';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './header/material/material.module';

const token = environment.api_key
const uri = environment.uri

@NgModule({
  imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, MaterialModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          link: httpLink.create({
            uri, headers: new HttpHeaders()
              .set('authorization', `Bearer ${token}`)
          }),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
  declarations: [AppComponent, ExchangeRates, HeaderComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }