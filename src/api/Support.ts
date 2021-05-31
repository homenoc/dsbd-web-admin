import axios from "axios";
import {restfulApiConfig} from "./Config";
import {GroupDetailData} from "../interface";

export function Put(id: number, data: GroupDetailData): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + "/support/" + id, data, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.group
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}


export function Get(id: number): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/support/" + id, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.ticket[0]
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}

export function GetAll(): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/support", {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.tickets
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}
