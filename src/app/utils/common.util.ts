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
        if (!appStoreService.patientTypes.length) {
          http.doGet('patients/patient-types').subscribe((data: any) => {
            appStoreService.patientDetail.patientType = data.patientTypeList.find(
              (v) => v.value == patient.patientType
            ).text;
            appStoreService.onPatientChanged();
          });
        } else {
          appStoreService.patientDetail.patientType = appStoreService.patientTypes.find(
            (v) => v.value == patient.patientType
          ).text;
          appStoreService.onPatientChanged();
        }
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

    appStoreService.patientInfo = new Patient(
      patient.allergy,
      patient.ward,
      patient.bed
    );
  }

  async fetchRouteDoseTaskAsync(
    http: HttpService,
    store: any,
    keys = ['routes', 'doses', 'drug-tasks']
  ): Promise<any> {
    const data: any = {};
    for (const key of keys) {
      data[key] = await http
        .doGet(`inpatient-medical-record/${key}`)
        .toPromise();
    }

    if (keys.includes('routes')) {
      store.routes = data.routes.map((v) => ({
        ...v,
        value: v.syskey + '',
        text: v.EngDesc,
      }));
    }
    if (keys.includes('doses')) {
      store.doses = data.doses.map((v) => ({
        ...v,
        value: v.syskey + '',
        text: v.Dose,
      }));
    }
    if (keys.includes('drug-tasks')) {
      store.drugTasks = data['drug-tasks'].map((v) => ({
        ...v,
        text: v.eng_desc,
        value: v.task,
      }));
    }

    return data;
  }
}
