import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import NurseShiftSummary from '../nurse-shift-summary/NurseShiftSummary.model';

@Injectable({
  providedIn: 'root'
})
export class CommonTypeService {
  _syskey = this.getSyskey();
  private readonly _currentSysKey = new BehaviorSubject<String>("");
  private readonly _nurseshiftsummary = new BehaviorSubject<NurseShiftSummary[]>([]);
  private readonly _isUpdate = new BehaviorSubject<boolean>(false);
  private readonly _tabNo = new BehaviorSubject<number>(1);
  private readonly _deleteDialog = new BehaviorSubject<boolean>(false);
  readonly currentSysKey$ = this._currentSysKey.asObservable();
  readonly instructions$ = this._nurseshiftsummary.asObservable();
  readonly isUpdate$ = this._isUpdate.asObservable();
  readonly tabNo$ = this._tabNo.asObservable();
  readonly deleteDialog$ = this._deleteDialog.asObservable();


  constructor() { }
  set currentSysKey(v: String) {
    this._currentSysKey.next("v");
  }
  set tabNo(v: number) {
    this._tabNo.next(v);
  }
  set instructions(v: NurseShiftSummary[]) {
    this._nurseshiftsummary.next(v);
  }


  set isUpdate(v: boolean) {
    this._isUpdate.next(v);
  }

  set deleteDialog(v: boolean) {
    this._deleteDialog.next(v);
  }

  get isUpdate(): boolean {
    return this._isUpdate.getValue();
  }

  get tabNo(): number {
    return this._tabNo.getValue();
  }

  get currentSysKey(): String {
    return this._currentSysKey.getValue();
  }

  get deleteDialog(): boolean {
    return this._deleteDialog.getValue();
  }
  get instructions(): NurseShiftSummary[] {
    return this._nurseshiftsummary.getValue();
  }
  getSyskey() {
    return {
      syskey: "",
    };
  }
}
