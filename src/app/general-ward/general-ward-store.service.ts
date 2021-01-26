import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralWardStoreService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);
  // private readonly _bloods = new BehaviorSubject<Blood[]>([]);
  private readonly _isUpdate = new BehaviorSubject<boolean>(false);
  private readonly _tabNo = new BehaviorSubject<number>(2);
  private readonly _deleteDialog = new BehaviorSubject<boolean>(false);

  readonly currentSysKey$ = this._currentSysKey.asObservable();
  // readonly bloods$ = this._bloods.asObservable();
  readonly isUpdate$ = this._isUpdate.asObservable();
  readonly tabNo$ = this._tabNo.asObservable();
  readonly deleteDialog$ = this._deleteDialog.asObservable();

  constructor() {}

  set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  // set bloods(v: Blood[]) {
  //   this._bloods.next(v);
  // }

  set tabNo(v: number) {
    this._tabNo.next(v);
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

  // get bloods(): Blood[] {
  //   return this._bloods.getValue();
  // }

  get currentSysKey(): number {
    return this._currentSysKey.getValue();
  }

  get deleteDialog(): boolean {
    return this._deleteDialog.getValue();
  }
}
