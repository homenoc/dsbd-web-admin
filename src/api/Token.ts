import axios from 'axios'
import { restfulApiConfig } from './Config'

export function GetAll(): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/token', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.token,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
