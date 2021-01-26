import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GeneralWardModule } from './general-ward/general-ward.module';
import { InpatientMedicalRecordModule } from './inpatient-medical-record/inpatient-medical-record.module';
import { LoginComponent } from './login/login.component';
import { NurseShiftSummaryModule } from './nurse-shift-summary/nurse-shift-summary.module';
import { NursingActivityWorklistModule } from './nursing-activity-worklist/nursing-activity-worklist.module';
import { NursingCareRecordModule } from './nursing-care-record/nursing-care-record.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    InpatientMedicalRecordModule,
    NursingActivityWorklistModule,
    NurseShiftSummaryModule,
    SharedModule,
    NursingCareRecordModule,
    GeneralWardModule,
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
export class AppModule {}
