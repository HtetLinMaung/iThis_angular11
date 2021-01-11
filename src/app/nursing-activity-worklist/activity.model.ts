export default class Activity {
  constructor(
    public syskey: number,
    public procedureName: string,
    public procedure: number,
    public date: string,
    public dueDateChange: string,
    public dueDateRemove: string,
    public fmtDate: string,
    public fmtDueDateChange: string,
    public fmtDueDateRemove: string,
    public size: number,
    public site: number,
    public marking: number,
    public externalLength: number,
    public doctorName: string,
    public doctorId: number,
    public sizeUnit: string,
    public siteUnit: string,
    public markingUnit: string,
    public externalLengthUnit: string,
    public fmtSize: string,
    public fmtSite: string,
    public fmtMarking: string,
    public fmtExternalLength: string
  ) {}
}
