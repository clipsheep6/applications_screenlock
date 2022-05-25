export function ConvertLunarCalendar(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay) {
    let LunarIndex1 = 2,
        LunarIndex2 = 9,
        LunarIndex3 = 10,
        LunarIndex4 = 11,
        LunarDay1 = 20,
        LunarDay2 = 21,
        Hour = 24,
        Minutes = 60,
        Multiple = 1000,
        InitialLunarTime = 1949

    let lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
        lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
        HeavenlyStemsAnd = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
        EarthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    let LunarCalendar = [
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
    ]

    function ConvertLunarCalendar(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay) {
        GregorianCalendarMonth -= 1;
        let daySpan = (Date.UTC(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay) - Date.UTC(InitialLunarTime, 0, LeapFebruarySmallDay)) / (Hour * Minutes * Minutes * Multiple) + 1;
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
        if (OutputLunarDay < LunarIndex4) {
            OutputLunarDay = `${lunarDay[LunarIndex3]}${lunarDay[OutputLunarDay-1]}`
        } else if (OutputLunarDay > LunarIndex3 && OutputLunarDay < LunarDay1) {
            OutputLunarDay = `${lunarDay[LunarIndex2]}${lunarDay[OutputLunarDay-LunarIndex4]}`
        } else if (OutputLunarDay === LunarDay1) {
            OutputLunarDay = `${lunarDay[1]}${lunarDay[LunarIndex2]}`
        } else if (OutputLunarDay > LunarDay1 && OutputLunarDay < LeapFebruaryBigDay) {
            OutputLunarDay = `${lunarDay[LunarIndex4]}${lunarDay[OutputLunarDay-LunarDay2]}`
        } else if (OutputLunarDay === LeapFebruaryBigDay) {
            OutputLunarDay = `${lunarDay[LunarIndex1]}${lunarDay[LunarIndex2]}`
        }
        return {
            lunarYear: OutputLunarYear,
            lunarMonth: OutputLunarMonth,
            lunarDay: OutputLunarDay,
        }
    }

    function hasLeapMonth(OutputLunarYear) {
        let lastHexadecimalDigit = 0xf
        if (OutputLunarYear & lastHexadecimalDigit) {
            return OutputLunarYear & lastHexadecimalDigit
        } else {
            return -1
        }
    }

    let LeapFebruarySmallDay = 29,
        LeapFebruaryBigDay = 30

    function leapMonthDays(OutputLunarYear) {
        let hexadecimalFirstDigit = 0xf0000
        if (hasLeapMonth(OutputLunarYear) > -1) {
            return (OutputLunarYear & hexadecimalFirstDigit) ? LeapFebruaryBigDay : LeapFebruarySmallDay
        } else {
            return 0
        }
    }

    let ConvertToHexDigit = 0x8000,
        ConvertToHex = 0x8

    function lunarYearDays(OutputLunarYear) {
        let totalDays = 0;
        for (let i = ConvertToHexDigit; i > ConvertToHex; i >>= 1) {
            let monthDays = (OutputLunarYear & i) ? LeapFebruaryBigDay : LeapFebruarySmallDay;
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
            monthArr.push((OutputLunarYear & i) ? LeapFebruaryBigDay : LeapFebruarySmallDay);
        }
        if (hasLeapMonth(OutputLunarYear)) {
            monthArr.splice(hasLeapMonth(OutputLunarYear), 0, leapMonthDays(OutputLunarYear));
        }

        return monthArr
    }

    let Day3 = 3

    function getHeavenlyStemsAnd(OutputLunarYear) {
        let HeavenlyStemsAndKey = (OutputLunarYear - Day3) % LunarIndex3;
        if (HeavenlyStemsAndKey === 0) HeavenlyStemsAndKey = LunarIndex3;
        return HeavenlyStemsAnd[HeavenlyStemsAndKey - 1]
    }

    function getEarthlyBranches(OutputLunarYear) {
        let MonthMultiple = 12
        let EarthlyBranchesKey = (OutputLunarYear - Day3) % MonthMultiple;
        if (EarthlyBranchesKey === 0) EarthlyBranchesKey = MonthMultiple;
        return EarthlyBranches[EarthlyBranchesKey - 1]
    }

    return ConvertLunarCalendar(GregorianCalendarYear, GregorianCalendarMonth, GregorianCalendarDay)
}