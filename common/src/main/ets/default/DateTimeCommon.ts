/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// 用于将公历日期转换为农历日期。
import { ConvertLunarCalendar } from '../../../../../common/src/main/ets/default/LunarCalendar'

export class DateTimeCommon {

  // 这是一个实例方法，用于获取当前的系统时间。
  // 它接收一个布尔参数 isUsing24hFormat，根据这个参数决定是否使用24小时制。如果不是24小时制，它会将小时数转换为12小时制。
  getSystemTime(isUsing24hFormat: boolean) {
    let dateTime = new Date();
    let hours = dateTime.getHours();
    if (!isUsing24hFormat && hours > 12) {
      hours = hours % 12;
    }
    let minutes = dateTime.getMinutes();
    let time = this.concatTime(hours, minutes)
    return time;
  }

  // 这是一个实例方法，用于获取当前的系统日期，并返回一个包含年、月、日的对象。
  getSystemDate(): {} {
    let dateTime = new Date();
    let result = {
      'year': dateTime.getFullYear(),
      'month': dateTime.getMonth() + 1,
      'day': dateTime.getDate()
    }
    return result
  }

  // 这个方法使用 ConvertLunarCalendar 函数将当前的公历日期转换为农历日期，并返回一个包含农历年、月、日的对象。
  getCalendarDate(): {} {
    let dateTime = new Date();
    let res = {
      'calendarYear': ConvertLunarCalendar( dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate()).lunarYear,
      'calendarMonth': ConvertLunarCalendar( dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate()).lunarMonth,
      'calendarDay': ConvertLunarCalendar( dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate()).lunarDay
    }
    return res
  }

  // 这个方法获取当前日期是星期几，并返回对应的星期名称。
  getSystemWeek() {
    let dateTime = new Date();
    let days = dateTime.getDay();
    let week = this.convert(days)
    return week
  }

  // 这是一个实例方法，用于将小时和分钟拼接成时间字符串格式，例如 "08:09"。
  concatTime(hours, minutes): string{
    return `${this.fill(hours)}:${this.fill(minutes)}`;
  };

  // 这是一个辅助方法，用于确保时间的显示格式，如果数字小于10，则在前面添加 "0"。
  fill(value) {
    return (value > 9 ? "" : "0") + value;
  };

  // 这是一个实例方法，用于将数字表示的星期几转换为星期的名称。
  // 这里使用了 $r 函数，这可能是一个资源获取函数，用于获取本地化的星期名称。
  convert(days) {
    switch (days) {
      case 0:
        return $r('app.string.sunday');
        break;
      case 1:
        return $r('app.string.monday');
        break;
      case 2:
        return $r('app.string.tuesday');
        break;
      case 3:
        return $r('app.string.wednesday');
        break;
      case 4:
        return $r('app.string.thursday');
        break;
      case 5:
        return $r('app.string.friday');
        break;
      case 6:
        return $r('app.string.saturday');
        break;
      default:
        break;
    }
  }
}

let dateTimeCommon = new DateTimeCommon();

export default dateTimeCommon as DateTimeCommon
