export default class DateUtil {
  constructor(private date: string) {}

  toClientDate() {
    return `${this.date.slice(6, 8)}/${this.date.slice(4, 6)}/${this.date.slice(
      0,
      4
    )}`;
  }

  toServerDate() {
    const dateArr = this.date.split('/');
    if (dateArr.length != 3) {
      return '';
    }
    return dateArr[2] + dateArr[1] + dateArr[0];
  }
}
