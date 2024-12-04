import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlashMessagesService, FlashMessagesModule } from 'angular2-flash-messages';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {DpDatePickerModule} from 'ng2-date-picker'
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { TasksService } from './services/tasks.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { TaskGroupComponent } from './components/task-group/task-group.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { TaskSettingsComponent } from './components/task-settings/task-settings.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { TaskFiltersComponent } from './components/task-filters/task-filters.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TaskGroupComponent,
    AddTaskComponent,
    TaskSettingsComponent,
    TaskItemComponent,
    TaskFiltersComponent,
    TaskDetailsComponent,
    GoogleLoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlashMessagesModule,
    MatIconModule,
    DpDatePickerModule,
    DragDropModule
  ],
  providers: [
    ValidateService,
    AuthService,
    TasksService,
    FlashMessagesService,
    AuthGuard,
    [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
