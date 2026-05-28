import axios from 'axios'
import { restfulApiConfig } from './Config'
import { BGPRouterData } from '../interface'

export function Post(
  data: BGPRouterData
): Promise<{ error: string; data: any }> {
  return axios
    .post(restfulApiConfig.apiURL + '/router', data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.bgp_router,
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
    .delete(restfulApiConfig.apiURL + '/router/' + id, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.bgp_router,
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
  data: BGPRouterData
): Promise<{ error: string; data: any }> {
  return axios
    .put(restfulApiConfig.apiURL + '/router/' + id, data, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.bgp_router,
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
    .get(restfulApiConfig.apiURL + '/router/' + id, {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.bgp_router[0],
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
    .get(restfulApiConfig.apiURL + '/router', {
      headers: {
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
      },
    })
    .then((res) => {
      return {
        error: '',
        data: res.data.bgp_router,
      }
    })
    .catch((err) => {
      return {
        error: '[' + err.response.status + '] ' + err.response.data.error,
        data: null,
      }
    })
}
