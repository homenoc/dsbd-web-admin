import axios from 'axios'
import { restfulApiConfig } from './Config'

export function Post(
  data: any
): Promise<{ error: string | undefined; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/support', data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
        data: res.data,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function Put(
  id: number,
  data: any
): Promise<{ error: string | undefined; data: any }> {
  return axios
    .put(restfulApiConfig.apiURL + '/support/' + id, data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: undefined,
        data: res.data.group,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function Get(id: number): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/support/' + id, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.ticket[0],
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function GetAll(): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/support', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.tickets,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
