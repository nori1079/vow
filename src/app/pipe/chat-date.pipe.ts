import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'chatDate'
})
export class ChatDatePipe implements PipeTransform {

  transform(date: number): string {
    moment.locale('jp');
    return moment(date).format('LLLL');
  }
}
