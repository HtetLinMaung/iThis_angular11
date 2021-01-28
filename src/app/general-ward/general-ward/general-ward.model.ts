export default class GeneralWard {
  constructor(
    public syskey = 0,
    public intervention = '',
    public problemName = '',
    public initialDate = '',
    public outcomeMet = 'n',
    public detailList: GeneralWardDetail[] = [],
    public type = 0,
    public dayNurseFrequency = 0,
    public nightNurseFrequency = 0
  ) {}
}

export class GeneralWardDetail {
  constructor(
    public syskey = 0,
    public parentId = 0,
    public dayNurse = false,
    public nightNurse = false,
    public dayNurseAt = '',
    public nightNurseAt = ''
  ) {}
}
