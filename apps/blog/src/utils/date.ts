import { format as _format } from 'date-fns'

export const format = (date: string, dateFormat = 'MMM do yyyy'): string =>
  _format(new Date(date), dateFormat)
