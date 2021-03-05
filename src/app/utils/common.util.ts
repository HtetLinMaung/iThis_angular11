import PaginationUtil from './pagination.util';
import * as moment from 'moment';
import DateUtil from './date.util';
import { AppStoreService } from '../app-store.service';
import { HttpService } from '../framework/http.service';

export default class CommonUtil extends PaginationUtil {
  convertTzToDate(date: string) {
    return date ? moment(date).format('DD/MM/yyyy') : '';
  }

  getDateUtil(date: string) {
    return new DateUtil(date);
  }
}
