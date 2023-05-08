import axios from 'axios'
import { restfulApiConfig } from './Config'
import { ConnectionAddData, ConnectionDetailData } from '../interface'

export function Post(
  id: number,
  data: ConnectionAddData
): Promise<{ error: string; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/service/' + id + '/connection', data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.service,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function Delete(id: number): Promise<{ error: string; data: any }> {
  return axios
    .delete(restfulApiConfig.apiURL + '/connection/' + id, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.service,
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
  data: ConnectionDetailData
): Promise<{ error: string; data: any }> {
  return axios
    .put(restfulApiConfig.apiURL + '/connection/' + id, data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.service,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}

export function Update(
  data: ConnectionDetailData
): Promise<{ error: string; data: any }> {
  return axios
    .put(restfulApiConfig.apiURL + '/connection/' + data.ID, data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.service,
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
    .get(restfulApiConfig.apiURL + '/connection/' + id, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.connection[0],
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
    .get(restfulApiConfig.apiURL + '/connection', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.connection,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
