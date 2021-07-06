import axios from "axios";
import {restfulApiConfig} from "./Config";
import {MemoAddData} from "../interface";

export function Post(id: number, data: MemoAddData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/memo", data, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.service
        };
    }).catch(err => {
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}

export function Delete(id: number): Promise<{ error: string; data: any }> {
    return axios.delete(restfulApiConfig.apiURL + "/memo/" + id, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.service
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}