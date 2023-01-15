import axios from 'axios'
import { restfulApiConfig } from './Config'
import {
  JPNICRegistrationData,
  JPNICReturnData,
  JPNICSearchData,
} from '../interface'

export function Post(
  data: JPNICRegistrationData
): Promise<{ error: string; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/jpnic', data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
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

export function Get(url: string): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/jpnic/' + url, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
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

export function ReturnAddress(
  data: JPNICReturnData
): Promise<{ error: string; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/jpnic', data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
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

export function GetHandle(
  handle: string
): Promise<{ error: string; data: any }> {
  return axios
    .get(restfulApiConfig.apiURL + '/jpnic/handle/' + handle, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
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

export function GetAll(
  data: JPNICSearchData
): Promise<{ error: string; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/jpnic/search', data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
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
