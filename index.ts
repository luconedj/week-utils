export default class WeekUtil {
  dow: number = 1;
  doy: number = 4;
  firstDay: number = 1;
  lastDay: number = 7;
  /**
   * 构造函数
   * @param dow 默认值：1
   * @param doy 默认值：4
   */
  constructor(dow?: number, doy?: number) {
    if(dow === 0 && doy === 6) {
      this.dow = dow
      this.doy = doy

      this.firstDay = 0;
      this.lastDay = 6
    }
  }

  /**
   * 返回指定年份、指定周数的开始及结束时间 {weekStart: Date, weekEnd: Date}
   * @param year 指定年份
   * @param n 指定周数
   */
  getWeekDate(year: number, n: number) {
    const start = this.dayOfYearFromWeeks(year, n, this.firstDay, this.dow, this.doy);
    const end = this.dayOfYearFromWeeks(year, n, this.lastDay, this.dow, this.doy);
    return {
      weekStart: this.getDayOfYear(year, start.dayOfYear),
      weekEnd: this.getDayOfYear(year, end.dayOfYear)
    };
  }

  getWeekTest() {
    const res = this.dayOfYearFromWeeks(2019, 28, 1, this.dow, this.doy);
    return res.dayOfYear;
  }

  dayOfYearFromWeeks(
    year: number,
    week: number,
    weekday: number,
    dow: number,
    doy: number
  ) {
    let localWeekday = (7 + weekday - dow) % 7,
      weekOffset = this.firstWeekOffset(year, dow, doy),
      dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
      resYear,
      resDayOfYear;

    if (dayOfYear <= 0) {
      resYear = year - 1;
      resDayOfYear = this.daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > this.daysInYear(year)) {
      resYear = year + 1;
      resDayOfYear = dayOfYear - this.daysInYear(year);
    } else {
      resYear = year;
      resDayOfYear = dayOfYear;
    }

    return {
      year: resYear,
      dayOfYear: resDayOfYear
    };
  }

  getDayOfYear(year: number, n: number) {
    let startOfYear = new Date(year, 0, 1);
    startOfYear.setDate(startOfYear.getDate() + (n - 1));
    return startOfYear;
  }

  /**
   * 返回指定日期的周数，默认当前时间
   * @param date 指定日期
   */
  curWeek(date?: Date) {
    let mom = new Date()
    if (date) {
      mom = date
    }
    const week = this.localeWeek(mom)
    return week
  }

  localeWeek(mom: Date) {
    return this.weekOfYear(mom, this.dow, this.doy).week
  }

  weekOfYear(mom: Date, dow: number, doy: number) {
    var weekOffset = this.firstWeekOffset(mom.getFullYear(), dow, doy),
      week = Math.floor((this.dayOfYear(mom) - weekOffset - 1) / 7) + 1,
      resWeek,
      resYear

    if (week < 1) {
      resYear = mom.getFullYear() - 1
      resWeek = week + this.weeksInYear(resYear, dow, doy)
    } else if (week > this.weeksInYear(mom.getFullYear(), dow, doy)) {
      resWeek = week - this.weeksInYear(mom.getFullYear(), dow, doy)
      resYear = mom.getFullYear() + 1
    } else {
      resYear = mom.getFullYear()
      resWeek = week
    }

    return {
      week: resWeek,
      year: resYear
    }
  }

  dayOfYear (mom: Date) {
    const dayOfYear = Math.round((this.startOf('day', mom) - this.startOf('year', mom)) / 864e5) + 1;
    return dayOfYear;
  }

  startOf(untis: string, mom: Date) {
    let time: number = 0;
    switch (untis) {
      case 'year':
        time = new Date(mom.getFullYear(), 0, 1).valueOf();
        break;
      case 'day':
        time = new Date(mom.getFullYear(), mom.getMonth(), mom.getDate()).valueOf();
        break;
    }

    return time;
  }

  /**
   * 返回指定年份的总周数
   * @param input 指定年份
   */
  localWeeks(input: number) {
    return this.weeksInYear(input, this.dow, this.doy);
  }

  weeksInYear(year: number, dow: number, doy: number) {
    const weekOffset = this.firstWeekOffset(year, dow, doy)
    const weekOffsetNext = this.firstWeekOffset(year + 1, dow, doy)
    return (this.daysInYear(year) - weekOffset + weekOffsetNext) / 7
  }

  firstWeekOffset(year: number, dow: number, doy: number) {
    const fwd = 7 + dow - doy;
    const fwdlw = (7 + this.createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
  }

  createUTCDate(y: number, m: number, d: number) {
    let date;
    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0) {
      date = new Date(Date.UTC.apply(null, [y + 400, m, d]));
      if (isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
      }
    } else {
      date = new Date(Date.UTC.apply(null, [y, m, d]));
    }
    return date;
  }

  daysInYear(year: number) {
    return this.isLeapYear(year) ? 366 : 365;
  }

  isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}