import { ConnectionDetailData, ServiceDetailData } from '../interface'

export const DateToString1 = (date: Date) => {
  return (
    date.getFullYear() +
    '-' +
    ('00' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('00' + date.getDate()).slice(-2) +
    ' ' +
    ('00' + date.getHours()).slice(-2) +
    ':' +
    ('00' + date.getMinutes()).slice(-2) +
    ':00'
  )
}

export const GenServiceCodeOnlyService = (service: ServiceDetailData) =>
  service.group_id +
  '-' +
  service.service_type +
  ('000' + service.service_number).slice(-3)

export const GenServiceCode = (connection: ConnectionDetailData) =>
  connection.service?.group_id +
  '-' +
  connection.service?.service_type +
  ('000' + connection.service?.service_number).slice(-3) +
  '-' +
  connection.connection_type +
  ('000' + connection.connection_number).slice(-3)

export const getStringFromDate = (data: string | undefined): string => {
  let str = '無期限'
  if (data === undefined) {
    return '取得エラー'
  }
  if (!data.match(/9999-12-31/)) {
    const date = new Date(Date.parse(data))
    str =
      date.getFullYear() +
      '-' +
      ('0' + (1 + date.getMonth())).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2) +
      ' ' +
      ('0' + date.getHours()).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2) +
      ':' +
      ('0' + date.getSeconds()).slice(-2)
  }
  return str
}
