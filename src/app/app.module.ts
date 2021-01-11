import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { InpatientMedicalRecordModule } from './inpatient-medical-record/inpatient-medical-record.module';
import { NurseshiftsummaryComponent } from './nurseshiftsummary/nurseshiftsummary.component';
import { NursingActivityWorklistModule } from './nursing-activity-worklist/nursing-activity-worklist.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, LoginComponent, NurseshiftsummaryComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    InpatientMedicalRecordModule,
    NursingActivityWorklistModule,
    SharedModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
