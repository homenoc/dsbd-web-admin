import axios from 'axios'
import { restfulApiConfig } from './Config'

export function Login(username: string, password: string): Promise<string> {
  return axios
    .post(restfulApiConfig.apiURL + '/login', null, {
      headers: {
        'Content-Type': 'application/json',
        USER: username,
        PASS: password,
      },
    })
    .then((res) => {
      sessionStorage.setItem('ACCESS_TOKEN', res.data.token[0].access_token)
      return ''
    })
    .catch((err) => {
      return err
    })
}

export function Logout(): Promise<string> {
  return axios
    .post(
      restfulApiConfig.apiURL + '/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('ACCESS_TOKEN')!,
        },
      }
    )
    .then(() => {
      return ''
    })
    .catch((err) => {
      return err
    })
}

// export const login = Login
