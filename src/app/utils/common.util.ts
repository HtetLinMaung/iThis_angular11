import PaginationUtil from './pagination.util';
import * as moment from 'moment';
import DateUtil from './date.util';
import { AppStoreService } from '../app-store.service';
import { HttpService } from '../framework/http.service';
import PatientData from '../framework/patient-dialog/patient.model';
import { Patient } from '../patient.model';

export default class CommonUtil extends PaginationUtil {
  convertTzToDate(date: string) {
    return date ? moment(date).format('DD/MM/yyyy') : '';
  }

  getDateUtil(date: string) {
    return new DateUtil(date);
  }

  setPatientDetail(
    http: HttpService,
    appStoreService: AppStoreService,
    patient: PatientData
  ) {
    http
      .doGet(`patients/adnos/${patient.pId}`)
      .subscribe((data: { text: string; value: string }[]) => {
        appStoreService.patientDetail.adNos = data;
        appStoreService.patientDetail.adNo = patient.rgsNo + '';
        appStoreService.onPatientChanged();
      });
    appStoreService.pId = patient.pId;
    appStoreService.rgsNo = patient.rgsNo;
    appStoreService.drID = parseInt(patient.drID || '0');
    appStoreService.patientDetail.patientId = patient.id;
    appStoreService.patientDetail.patientName = patient.name;
    appStoreService.patientDetail.patientAge = patient.age;
    appStoreService.patientDetail.ADDate = patient.adDate;
    appStoreService.patientDetail.room = patient.roomNo;
    appStoreService.patientDetail.doctor = patient.doctor;
    appStoreService.patientDetail.speciality = patient.speciality;
    appStoreService.patientDetail.patientType = appStoreService.patientTypes.find(
      (v) => v.value == patient.patientType
    ).text;
    appStoreService.patientInfo = new Patient(
      patient.allergy,
      patient.ward,
      patient.bed
    );
  }

  fetchRouteDoseTask(
    http: HttpService,
    store: any
  ): Promise<{
    routes: any[];
    doses: any[];
    drugTasks: any[];
  }> {
    return new Promise((resolve, reject) => {
      try {
        http
          .doGet('inpatient-medical-record/routes')
          .subscribe((routes: any) => {
            http
              .doGet('inpatient-medical-record/doses')
              .subscribe((doses: any) => {
                http
                  .doGet('inpatient-medical-record/drug-tasks')
                  .subscribe((drugTasks: any) => {
                    store.routes = routes.map((v) => ({
                      value: v.syskey + '',
                      text: v.EngDesc,
                      syskey: v.syskey,
                    }));
                    store.doses = doses.map((v) => ({
                      value: v.syskey + '',
                      text: v.Dose,
                      syskey: v.syskey,
                    }));
                    store.drugTasks = drugTasks.map((v) => ({
                      text: v.eng_desc,
                      value: v.task,
                      syskey: v.syskey,
                    }));

                    resolve({ routes, doses, drugTasks } as {
                      routes: any[];
                      doses: any[];
                      drugTasks: any[];
                    });
                  });
              });
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}
