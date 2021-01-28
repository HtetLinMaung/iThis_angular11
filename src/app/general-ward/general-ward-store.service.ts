import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import GeneralWard from './general-ward/general-ward.model';

@Injectable({
  providedIn: 'root',
})
export class GeneralWardStoreService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);
  private readonly _generalWards = new BehaviorSubject<GeneralWard[]>([]);
  private readonly _isUpdate = new BehaviorSubject<boolean>(false);
  private readonly _tabNo = new BehaviorSubject<number>(1);
  private readonly _deleteDialog = new BehaviorSubject<boolean>(false);

  readonly currentSysKey$ = this._currentSysKey.asObservable();
  readonly generalWards$ = this._generalWards.asObservable();
  readonly isUpdate$ = this._isUpdate.asObservable();
  readonly tabNo$ = this._tabNo.asObservable();
  readonly deleteDialog$ = this._deleteDialog.asObservable();

  constructor() {}

  set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  set generalWards(v: GeneralWard[]) {
    this._generalWards.next(v);
  }

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

  get generalWards(): GeneralWard[] {
    return this._generalWards.getValue();
  }

  get currentSysKey(): number {
    return this._currentSysKey.getValue();
  }

  get deleteDialog(): boolean {
    return this._deleteDialog.getValue();
  }
}
