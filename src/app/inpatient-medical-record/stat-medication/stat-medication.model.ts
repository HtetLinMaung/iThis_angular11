export default class StatMedication {
  constructor(
    public syskey: number = 0,
    public route: string = '',
    public medication: string = '',
    public doseCount: number = 1,
    public doseDesc: string = '',
    public prescriptionRemark: string = '',
    public timeAdmin: string = '',
    public givenBy: string = '',
    public task: string = '',
    public drRemark: string = '',
    public stockId: string = '',
    public remark: string = '',
    public routeDesc: string = '',
    public confirmDate: string = '',
    public fmtTimeAdmin: string = '',
    public patientId: string = '',
    public patientName: string = '',
    public adNo: string = '',
    public confirmTime = ''
  ) {}
}
