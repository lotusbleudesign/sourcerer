import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OverviewComponent } from './overview/overview.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { LanguagesComponent } from './languages/languages.component';

const token = environment.api_key;
const uri = environment.uri;

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          link: httpLink.create({
            uri,
            headers: new HttpHeaders().set('authorization', `Bearer ${token}`),
          }),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
  declarations: [AppComponent, HeaderComponent, OverviewComponent, RepositoriesComponent, LanguagesComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
