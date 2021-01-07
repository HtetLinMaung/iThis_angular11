import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Instruction from './Instruction.model';

@Injectable({
  providedIn: 'root',
})
export class InstructionStoreService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);
  private readonly _instructions = new BehaviorSubject<Instruction[]>([]);
  private readonly _isUpdate = new BehaviorSubject<boolean>(false);
  private readonly _tabNo = new BehaviorSubject<number>(1);

  readonly currentSysKey$ = this._currentSysKey.asObservable();
  readonly instructions$ = this._instructions.asObservable();
  readonly isUpdate$ = this._isUpdate.asObservable();
  readonly tabNo$ = this._tabNo.asObservable();

  constructor() {}

  set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  set instructions(v: Instruction[]) {
    this._instructions.next(v);
  }

  set tabNo(v: number) {
    this._tabNo.next(v);
  }

  set isUpdate(v: boolean) {
    this._isUpdate.next(v);
  }

  get isUpdate(): boolean {
    return this._isUpdate.getValue();
  }

  get tabNo(): number {
    return this._tabNo.getValue();
  }
}
