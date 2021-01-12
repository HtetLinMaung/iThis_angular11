export default class StatMedication {
  constructor(
    public syskey: number = 0,
    public route: string = '',
    public medication: string = '',
    public doseCount: number = 1,
    public doseDesc: string = '',
    public prescriptionRemarks: string = '',
    public timeAdmin: string = '',
    public givenBy: string = '',
    public drRemark: string = ''
  ) {}
}
