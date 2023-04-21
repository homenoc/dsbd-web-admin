import axios from 'axios'
import { restfulApiConfig } from './Config'

export function Get(id: string): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/user/' + id, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.users[0],
      }
    })
    .catch((err) => {
      return {
        error: err,
        data: null,
      }
    })
}

export function GetAll(): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/user', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.users,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
