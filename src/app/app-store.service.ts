import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Doctor } from './framework/doctor-dialog/doctor.model';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  private readonly _pId = new BehaviorSubject<number>(300268449);
  private readonly _patientInfo = new BehaviorSubject<Patient>(
    new Patient('', '', '')
  );
  private readonly _doctor = new BehaviorSubject<Doctor>(new Doctor());
  private readonly _doctorDialog = new BehaviorSubject<boolean>(false);
  private readonly _doctors = new BehaviorSubject<Doctor[]>([]);
  private readonly _isDoctorRank = new BehaviorSubject<boolean>(false);
  private readonly _rgsNo = new BehaviorSubject<number>(0);
  private readonly _drID = new BehaviorSubject<number>(0);

  readonly pId$ = this._pId.asObservable();
  readonly patientInfo$ = this._patientInfo.asObservable();
  readonly doctor$ = this._doctor.asObservable();
  readonly doctorDialog$ = this._doctorDialog.asObservable();
  readonly doctors$ = this._doctors.asObservable();
  readonly isDoctorRank$ = this._isDoctorRank.asObservable();
  readonly rgsNo$ = this._rgsNo.asObservable();
  readonly drID$ = this._drID.asObservable();

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
}
