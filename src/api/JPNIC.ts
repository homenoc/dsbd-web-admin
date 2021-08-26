import axios from "axios";
import {restfulApiConfig} from "./Config";
import {JPNICRegistrationData} from "../interface";

export function Post(data: JPNICRegistrationData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/jpnic", data, {
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
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}
