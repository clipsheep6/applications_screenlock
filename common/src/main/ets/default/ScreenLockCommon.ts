/*
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
import Log from './Log';
import FileIo from '@ohos.fileio';
import  { LunarCalendar }  from "./LunarCalendar"

const TAG = 'ScreenLock-ScreenLockCommon';
const DFAULT_SIZE = 4096;
const CHAR_CODE_AT_INDEX = 0;

export enum ScreenLockStatus {
    Locking = 1,
    Unlock = 2,
    RecognizingFace = 3,
    FaceNotRecognized = 4
}

export function ReadConfigFile(fileName) {
    Log.showInfo(TAG, `readConfigFile fileName:${fileName}`);
    try {
        let stream = FileIo.createStreamSync(fileName, 'r');
        Log.showInfo(TAG, `readConfigFile stream:` + stream);
        let buf = new ArrayBuffer(DFAULT_SIZE);
        let len = stream.readSync(buf);
        Log.showInfo(TAG, `readConfigFile len:` + len);
        let arr = new Uint8Array(buf);
        let charAt = ' '.charCodeAt(CHAR_CODE_AT_INDEX);
        for (let i = len;i < DFAULT_SIZE; i++) {
            arr[i] = charAt;
        }
        let content = String.fromCharCode.apply(null, arr);
        stream.closeSync();
        Log.showInfo(TAG, `readConfigFile content:` + JSON.stringify(content));
        return JSON.parse(content);
    } catch (error) {
        Log.showInfo(TAG, `readConfigFile error:` + JSON.stringify(error));
    }
}

export function ConvertLunarCalendar(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay) {
    let InitialLunarTime = 1949
    let LastHexadecimalDigit = 0xf
    let HexadecimalFirstDigit = 0xf0000
    let ConvertToHexDigit = 0x8000
    let ConvertToHex = 0x8
    let lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
        lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
        HeavenlyStemsAnd = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
        EarthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    function ConvertLunarCalendar(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay) {
        GregorianCalendarMonth -= 1;
        let daySpan = (Date.UTC(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay) - Date.UTC(InitialLunarTime, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
        let OutputLunarYear, OutputLunarMonth, OutputLunarDay;
        for (let j = 0; j < LunarCalendar.length; j++) {
            daySpan -= lunarYearDays(LunarCalendar[j]);
            if (daySpan <= 0) {
                OutputLunarYear = InitialLunarTime + j;
                daySpan += lunarYearDays(LunarCalendar[j]);
                break
            }
        }

        for (let k = 0; k < lunarYearMonths(LunarCalendar[OutputLunarYear - InitialLunarTime]).length; k++) {
            daySpan -= lunarYearMonths(LunarCalendar[OutputLunarYear - InitialLunarTime])[k];
            if (daySpan <= 0) {
                if (hasLeapMonth(LunarCalendar[OutputLunarYear - InitialLunarTime]) > -1 && hasLeapMonth(LunarCalendar[OutputLunarYear - InitialLunarTime]) <= k) {
                    if (hasLeapMonth(LunarCalendar[OutputLunarYear - InitialLunarTime]) < k) {
                        OutputLunarMonth = k;
                    } else if (hasLeapMonth(LunarCalendar[OutputLunarYear - InitialLunarTime]) === k) {
                        OutputLunarMonth = '闰' + k;
                    } else {
                        OutputLunarMonth = k + 1;
                    }
                } else {
                    OutputLunarMonth = k + 1;
                }
                daySpan += lunarYearMonths(LunarCalendar[OutputLunarYear - InitialLunarTime])[k];
                break
            }
        }
        OutputLunarDay = daySpan;
        if (hasLeapMonth(LunarCalendar[OutputLunarYear - InitialLunarTime]) > -1 && (typeof (OutputLunarMonth) === 'string' && OutputLunarMonth.indexOf('闰') > -1)) {
            let reg = /\d/.exec(OutputLunarMonth)
            OutputLunarMonth = `闰${lunarMonth[Number(reg)- 1]}`
        } else {
            OutputLunarMonth = lunarMonth[OutputLunarMonth - 1];
        }
        OutputLunarYear = getHeavenlyStemsAnd(OutputLunarYear) + getEarthlyBranches(OutputLunarYear);
        if (OutputLunarDay < 11) {
            OutputLunarDay = `${lunarDay[10]}${lunarDay[OutputLunarDay-1]}`
        } else if (OutputLunarDay > 10 && OutputLunarDay < 20) {
            OutputLunarDay = `${lunarDay[9]}${lunarDay[OutputLunarDay-11]}`
        } else if (OutputLunarDay === 20) {
            OutputLunarDay = `${lunarDay[1]}${lunarDay[9]}`
        } else if (OutputLunarDay > 20 && OutputLunarDay < 30) {
            OutputLunarDay = `${lunarDay[11]}${lunarDay[OutputLunarDay-21]}`
        } else if (OutputLunarDay === 30) {
            OutputLunarDay = `${lunarDay[2]}${lunarDay[9]}`
        }
        return {
            lunarYear: OutputLunarYear,
            lunarMonth: OutputLunarMonth,
            lunarDay: OutputLunarDay,
        }
    }

    function hasLeapMonth(OutputLunarYear) {
        if (OutputLunarYear & LastHexadecimalDigit) {
            return OutputLunarYear & LastHexadecimalDigit
        } else {
            return -1
        }
    }

    function leapMonthDays(OutputLunarYear) {
        if (hasLeapMonth(OutputLunarYear) > -1) {
            return (OutputLunarYear & HexadecimalFirstDigit) ? 30 : 29
        } else {
            return 0
        }
    }

    function lunarYearDays(OutputLunarYear) {
        let totalDays = 0;
        for (let i = ConvertToHexDigit; i > ConvertToHex; i >>= 1) {
            let monthDays = (OutputLunarYear & i) ? 30 : 29;
            totalDays += monthDays;
        }
        if (hasLeapMonth(OutputLunarYear) > -1) {
            totalDays += leapMonthDays(OutputLunarYear);
        }

        return totalDays
    }

    function lunarYearMonths(OutputLunarYear) {
        let monthArr = [];
        for (let i = ConvertToHexDigit; i > ConvertToHex; i >>= 1) {
            monthArr.push((OutputLunarYear & i) ? 30 : 29);
        }
        if (hasLeapMonth(OutputLunarYear)) {
            monthArr.splice(hasLeapMonth(OutputLunarYear), 0, leapMonthDays(OutputLunarYear));
        }

        return monthArr
    }

    function getHeavenlyStemsAnd(OutputLunarYear) {
        let HeavenlyStemsAndKey = (OutputLunarYear - 3) % 10;
        if (HeavenlyStemsAndKey === 0) HeavenlyStemsAndKey = 10;
        return HeavenlyStemsAnd[HeavenlyStemsAndKey - 1]
    }

    function getEarthlyBranches(OutputLunarYear) {
        let EarthlyBranchesKey = (OutputLunarYear - 3) % 12;
        if (EarthlyBranchesKey === 0) EarthlyBranchesKey = 12;
        return EarthlyBranches[EarthlyBranchesKey - 1]
    }

    return ConvertLunarCalendar(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay)
}