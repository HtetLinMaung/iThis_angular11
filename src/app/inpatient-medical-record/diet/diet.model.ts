export default class Diet {
  constructor(
    public syskey = 0,
    public no = '1',
    public dietEnteralFeed = '',
    public notedBy = '',
    public remark = '',
    public date = '',
    public time = '',
    public patientId = '',
    public patientName = '',
    public adNo = '',
    public rgsNo = '',
    public key = new Date().toISOString()
  ) {}
}
