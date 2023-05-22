import axios from 'axios'
import { restfulApiConfig } from './Config'

export function PostSubscribe(
  groupID: number,
  plan: string
): Promise<{ error: string; data: any }> {
  return axios
    .post(
      restfulApiConfig.apiURL + '/group/' + groupID + '/payment/subscribe',
      { plan },
      {
        headers: {
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        },
      }
    )
    .then((res) => {
      return {
        error: '',
        data: res.data.url,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function GetPayment(
  groupID: number
): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/group/' + groupID + '/payment', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.url,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}


export function GetCustomerDashboard(
  groupID: number
): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/group/' + groupID + '/payment/customer', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.url,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function GetSubscribeDashboard(
  groupID: number
): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/group/' + groupID + '/payment/subscribe', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.url,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
