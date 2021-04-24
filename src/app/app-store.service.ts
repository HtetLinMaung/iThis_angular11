import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Doctor } from './framework/doctor-dialog/doctor.model';
import PatientData from './framework/patient-dialog/patient.model';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  private readonly _loading = new BehaviorSubject<boolean>(false);
  private readonly _pId = new BehaviorSubject<number>(0);
  private readonly _patientInfo = new BehaviorSubject<Patient>(
    new Patient('', '', '')
  );
  private readonly _doctor = new BehaviorSubject<Doctor>(new Doctor());
  private readonly _doctorDialog = new BehaviorSubject<boolean>(false);
  private readonly _doctors = new BehaviorSubject<Doctor[]>([]);
  private readonly _userId = new BehaviorSubject<string>('0');
  private readonly _isDoctorRank = new BehaviorSubject<boolean>(true);
  private readonly _rgsNo = new BehaviorSubject<number>(0);
  private readonly _drID = new BehaviorSubject<number>(0);
  private readonly _patientDialog = new BehaviorSubject<boolean>(false);
  private readonly _patients = new BehaviorSubject<PatientData[]>([]);
  private readonly _patientDetail = new BehaviorSubject<any>({
    patientId: '',
    patientName: '',
    adNos: [{ text: '-', value: '-' }],
    adNo: '-',
    headerData: [],
    infoDialog: false,
    patientAge: 0,
    ADDate: '',
    room: '',
    doctor: '',
    speciality: '',
    patientType: '',
  });
  private readonly _menus = new BehaviorSubject<any[]>([]);
  private readonly _onPatientChanged = new BehaviorSubject<any>(() => {});
  private readonly _fetchPatientByRgsNo = new BehaviorSubject<any>(() => {});
  private readonly _onAdNoChanged = new BehaviorSubject<any>(() => {});
  private readonly _onClear = new BehaviorSubject<any>(() => {});
  private readonly _patientTypes = new BehaviorSubject<any[]>([]);

  readonly loading$ = this._loading.asObservable();
  readonly pId$ = this._pId.asObservable();
  readonly patientInfo$ = this._patientInfo.asObservable();
  readonly doctor$ = this._doctor.asObservable();
  readonly doctorDialog$ = this._doctorDialog.asObservable();
  readonly doctors$ = this._doctors.asObservable();
  readonly isDoctorRank$ = this._isDoctorRank.asObservable();
  readonly rgsNo$ = this._rgsNo.asObservable();
  readonly drID$ = this._drID.asObservable();
  readonly patientDialog$ = this._patientDialog.asObservable();
  readonly patients$ = this._patients.asObservable();
  readonly patientDetail$ = this._patientDetail.asObservable();
  readonly menus$ = this._menus.asObservable();
  readonly onPatientIdChanged$ = this._onPatientChanged.asObservable();
  readonly fetchPatientByRgsNo$ = this._fetchPatientByRgsNo.asObservable();
  readonly onAdNoChanged$ = this._onAdNoChanged.asObservable();
  readonly onClear$ = this._onClear.asObservable();
  readonly patientTypes$ = this._patientTypes.asObservable();
  readonly userId$ = this._userId.asObservable();

  constructor() {}

  set pId(v: number) {
    this._pId.next(v);
  }

  get pId(): number {
    return this._pId.getValue();
  }

  set patientInfo(v: Patient) {
    this._patientInfo.next(v);
  }

  get patientInfo(): Patient {
    return this._patientInfo.getValue();
  }

  set doctor(v: Doctor) {
    this._doctor.next(v);
  }

  get doctor(): Doctor {
    return this._doctor.getValue();
  }

  set doctorDialog(v: boolean) {
    this._doctorDialog.next(v);
  }

  get doctorDialog(): boolean {
    return this._doctorDialog.getValue();
  }

  set doctors(v: Doctor[]) {
    this._doctors.next(v);
  }

  get doctors(): Doctor[] {
    return this._doctors.getValue();
  }

  set isDoctorRank(v: boolean) {
    this._isDoctorRank.next(v);
  }

  get isDoctorRank(): boolean {
    return this._isDoctorRank.getValue();
  }

  set rgsNo(v: number) {
    this._rgsNo.next(v);
  }

  get rgsNo(): number {
    return this._rgsNo.getValue();
  }

  set drID(v: number) {
    this._drID.next(v);
  }

  get drID(): number {
    return this._drID.getValue();
  }

  set patientDialog(v: boolean) {
    this._patientDialog.next(v);
  }

  get patientDialog(): boolean {
    return this._doctorDialog.getValue();
  }

  set patients(v: PatientData[]) {
    this._patients.next(v);
  }

  get patients(): PatientData[] {
    return this._patients.getValue();
  }

  set patientDetail(v: any) {
    this._patientDetail.next(v);
  }

  get patientDetail(): any {
    return this._patientDetail.getValue();
  }

  set menus(v: any) {
    this._menus.next(v);
  }

  get menus(): any {
    return this._menus.getValue();
  }

  set onPatientChanged(v: any) {
    this._onPatientChanged.next(v);
  }

  get onPatientChanged(): any {
    return this._onPatientChanged.getValue();
  }

  set fetchPatientByRgsNo(v: any) {
    this._fetchPatientByRgsNo.next(v);
  }

  get fetchPatientByRgsNo(): any {
    return this._fetchPatientByRgsNo.getValue();
  }

  set onAdNoChanged(v: any) {
    this._onAdNoChanged.next(v);
  }

  get onAdNoChanged() {
    return this._onAdNoChanged.getValue();
  }

  set onClear(v: any) {
    this._onClear.next(v);
  }

  get onClear() {
    return this._onClear.getValue();
  }

  set patientTypes(v: any[]) {
    this._patientTypes.next(v);
  }

  get patientTypes(): any[] {
    return this._patientTypes.getValue();
  }

  set userId(v: string) {
    this._userId.next(v);
  }

  get userId(): string {
    return this._userId.getValue();
  }

  set loading(v: boolean) {
    this._loading.next(v);
  }

  get loading() {
    return this._loading.getValue();
  }
}
