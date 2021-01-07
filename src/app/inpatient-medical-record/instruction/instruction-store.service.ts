import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Instruction from './Instruction.model';

@Injectable({
  providedIn: 'root',
})
export class InstructionStoreService {
  private readonly _currentSysKey = new BehaviorSubject<number>(0);
  private readonly _instructions = new BehaviorSubject<Instruction[]>([
    new Instruction(
      new Date().toISOString(),
      new Date().toISOString(),
      'a, b',
      'abc',
      'abc'
    ),
    new Instruction(
      new Date().toISOString(),
      new Date().toISOString(),
      'a, b',
      'abc',
      'abc'
    ),
    new Instruction(
      new Date().toISOString(),
      new Date().toISOString(),
      'a, b',
      'abc',
      'abc'
    ),
  ]);

  readonly currentSysKey$ = this._currentSysKey.asObservable();
  readonly instructions$ = this._instructions.asObservable();

  constructor() {}

  private set currentSysKey(v: number) {
    this._currentSysKey.next(v);
  }

  private set instructions(v: Instruction[]) {
    this._instructions.next(v);
  }

  setCurrentSysKey(v: number) {
    this.currentSysKey = v;
  }

  setInstructions(v: Instruction[]) {
    this.instructions = v;
  }
}
