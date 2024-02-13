import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthModule } from './components/auth/auth.module';
import { RequestInterceptors } from './interceptors/request.interceptors';
import { ResponseInterceptors } from './interceptors/response.interceptors';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot(),
    AuthModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptors, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptors, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
