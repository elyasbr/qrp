declare module "react-multi-date-picker" {
  const DatePicker: any;
  export default DatePicker;
}

declare module "react-date-object" {
  export default class DateObject {
    constructor(options?: any);
    convert(calendar: any): DateObject;
    format(pattern?: string): string;
  }
}

declare module "react-date-object/calendars/persian" {
  const persian: any;
  export default persian;
}

declare module "react-date-object/locales/persian_fa" {
  const persian_fa: any;
  export default persian_fa;
}

declare module "react-date-object/calendars/gregorian" {
  const gregorian: any;
  export default gregorian;
}


