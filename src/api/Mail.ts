import axios from "axios";
import {restfulApiConfig} from "./Config";
import {MailSendData} from "../interface";

export function Post(data: MailSendData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/mail", data, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data
        };
    }).catch(err => {
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}
