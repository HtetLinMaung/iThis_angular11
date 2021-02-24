export default class GeneralWard {
  constructor(
    public syskey = 0,
    public intervention = '',
    public problemName = '',
    public fmtInitialDate = '',
    public patientName = '',
    public fmtOutcomeMet = 'No',
    public fmtDayAt = 0,
    public fmtNightAt = 0,
    public type = 0,
    public pId = 0,
    public rgsNo = 0,
    public initialDate = '',
    public headerDesc = '',
    public dayNurse = false,
    public dayNurseAt = 0,
    public dayNurseId = '',
    public dayNurseName = '',
    public nightNurse = false,
    public nightNurseAt = 0,
    public nightNurseId = '',
    public nightNurseName = '',
    public outcomeMet = false,
    public detailSyskey = 0
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
