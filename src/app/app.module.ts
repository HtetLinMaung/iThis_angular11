import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CommonTypeModule } from './common-type/common-type.module';
import { GeneralWardModule } from './general-ward/general-ward.module';
import { InpatientMedicalRecordModule } from './inpatient-medical-record/inpatient-medical-record.module';
import { LoginComponent } from './login/login.component';
import { NurseShiftSummaryModule } from './nurse-shift-summary/nurse-shift-summary.module';
import { NursingActivityWorklistModule } from './nursing-activity-worklist/nursing-activity-worklist.module';
import { NursingCareRecordModule } from './nursing-care-record/nursing-care-record.module';
import { PatientTypeModule } from './patient-type/patient-type.module';
import { RoomcodeModule } from './roomcode/roomcode.module';
import { RoomrateModule } from './roomrate/roomrate.module';
import { RouteModule } from './route/route.module';
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
    CommonTypeModule,
    RouteModule,
    GeneralWardModule,
    PatientTypeModule,
    RoomrateModule,
    RoomcodeModule,
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
