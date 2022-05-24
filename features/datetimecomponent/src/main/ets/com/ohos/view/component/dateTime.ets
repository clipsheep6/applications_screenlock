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

import Log from '../../../../../../../../../common/src/main/ets/default/Log'
import ViewModel from '../../vm/dateTimeViewModel'
import Constants from '../../common/constants'
import { ScreenLockStatus } from '../../../../../../../../../common/src/main/ets/default/ScreenLockCommon'
import deviceInfo from '@ohos.deviceInfo';

var deviceTypeInfo = deviceInfo.deviceType;
const TAG = 'ScreenLock-DateTime'

function sloarToLunar(sy, sm, sd) {
  let lunarYearArr = [
    0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
    0x0d520
  ],
    lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
    tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  function sloarToLunar(sy, sm, sd) {
    sm -= 1;
    let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
    let ly, lm, ld;
    for (let j = 0; j < lunarYearArr.length; j++) {
      daySpan -= lunarYearDays(lunarYearArr[j]);
      if (daySpan <= 0) {
        ly = 1949 + j;
        daySpan += lunarYearDays(lunarYearArr[j]);
        break
      }
    }

    for (let k = 0; k < lunarYearMonths(lunarYearArr[ly - 1949]).length; k++) {
      daySpan -= lunarYearMonths(lunarYearArr[ly - 1949])[k];
      if (daySpan <= 0) {
        if (hasLeapMonth(lunarYearArr[ly - 1949]) > -1 && hasLeapMonth(lunarYearArr[ly - 1949]) <= k) {
          if (hasLeapMonth(lunarYearArr[ly - 1949]) < k) {
            lm = k;
          } else if (hasLeapMonth(lunarYearArr[ly - 1949]) === k) {
            lm = '闰' + k;
          } else {
            lm = k + 1;
          }
        } else {
          lm = k + 1;
        }
        daySpan += lunarYearMonths(lunarYearArr[ly - 1949])[k];
        break
      }
    }
    ld = daySpan;
    if (hasLeapMonth(lunarYearArr[ly - 1949]) > -1 && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
      let reg = /\d/.exec(lm)
      lm = `闰${lunarMonth[Number(reg)- 1]}`
    } else {
      lm = lunarMonth[lm - 1];
    }
    ly = getTianGan(ly) + getDiZhi(ly);
    if (ld < 11) {
      ld = `${lunarDay[10]}${lunarDay[ld-1]}`
    } else if (ld > 10 && ld < 20) {
      ld = `${lunarDay[9]}${lunarDay[ld-11]}`
    } else if (ld === 20) {
      ld = `${lunarDay[1]}${lunarDay[9]}`
    } else if (ld > 20 && ld < 30) {
      ld = `${lunarDay[11]}${lunarDay[ld-21]}`
    } else if (ld === 30) {
      ld = `${lunarDay[2]}${lunarDay[9]}`
    }
    return {
      lunarYear: ly,
      lunarMonth: lm,
      lunarDay: ld,
    }
  }

  function hasLeapMonth(ly) {
    if (ly & 0xf) {
      return ly & 0xf
    } else {
      return -1
    }
  }

  function leapMonthDays(ly) {
    if (hasLeapMonth(ly) > -1) {
      return (ly & 0xf0000) ? 30 : 29
    } else {
      return 0
    }
  }

  function lunarYearDays(ly) {
    let totalDays = 0;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      let monthDays = (ly & i) ? 30 : 29;
      totalDays += monthDays;
    }
    if (hasLeapMonth(ly) > -1) {
      totalDays += leapMonthDays(ly);
    }

    return totalDays
  }

  function lunarYearMonths(ly) {
    let monthArr = [];
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      monthArr.push((ly & i) ? 30 : 29);
    }
    if (hasLeapMonth(ly)) {
      monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
    }

    return monthArr
  }

  function getTianGan(ly) {
    let tianGanKey = (ly - 3) % 10;
    if (tianGanKey === 0) tianGanKey = 10;
    return tianGan[tianGanKey - 1]
  }

  function getDiZhi(ly) {
    let diZhiKey = (ly - 3) % 12;
    if (diZhiKey === 0) diZhiKey = 12;
    return diZhi[diZhiKey - 1]
  }

  return sloarToLunar(sy, sm, sd)
}

@Component
export default struct DateTime {
  @State mViewModel: ViewModel = new ViewModel()
  @Prop isShowDate: boolean
  @State year: string = ''
  @State month: string = ''
  @State day: string = ''
  @State isPhone: boolean= false

  aboutToAppear() {
    Log.showInfo(TAG, `aboutToAppear`)
    this.mViewModel.ViewModelInit()
    this.year =
    sloarToLunar(this.mViewModel.dateVal.year, this.mViewModel.dateVal.month, this.mViewModel.dateVal.day).lunarYear
    this.month =
    sloarToLunar(this.mViewModel.dateVal.year, this.mViewModel.dateVal.month, this.mViewModel.dateVal.day).lunarMonth
    this.day =
    sloarToLunar(this.mViewModel.dateVal.year, this.mViewModel.dateVal.month, this.mViewModel.dateVal.day).lunarDay
    if (deviceTypeInfo == 'phone') {
      this.isPhone = true
    }
  }

  aboutToDisappear() {
    Log.showInfo(TAG, `aboutToDisappear`)
    this.mViewModel.stopPolling()
  }

  build() {
    Column() {
      Text(this.mViewModel.timeVal)
        .fontSize($r('app.float.time_fontsize'))
        .fontColor($r('app.color.date_time_color'))
        .margin({ top: $r('app.float.time_top_margin'), bottom: $r('app.float.time_bottom_margin') })
        .fontWeight(this.isPhone ? 300 : FontWeight.Normal)
        .fontFamily("Digit")
      if (this.isShowDate) {
        Row() {
          if (this.isPhone) {
            Text(this.mViewModel.dateVal.month + "月" + this.mViewModel.dateVal.day + "日")
              .fontSize($r('app.float.date_fontsize'))
              .fontColor($r('app.color.date_time_color'))
          } else {
            Text($r('app.string.yyyy_mm_dd', this.mViewModel.dateVal.year, this.mViewModel.dateVal.month, this.mViewModel.dateVal.day))
              .fontSize($r('app.float.date_fontsize'))
              .fontColor($r('app.color.date_time_color'))
          }

          Text(this.mViewModel.weekVal).fontSize($r('app.float.date_fontsize'))
            .fontColor($r('app.color.date_time_color'))
        }.height($r('app.float.date_week_area_height'))

        Row() {
          Text(this.year + '年' + this.month + '月' + this.day)
            .height($r("app.float.date_lunar_calendar_height"))
            .fontColor(Color.White)
            .fontSize($r("app.float.date_lunar_calendar_fontSize"))
            .margin({ top: 6 })
        }
      }
    }
    .width(Constants.FULL_CONTAINER_WIDTH)
  }
}