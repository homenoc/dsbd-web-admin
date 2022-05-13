import axios from "axios";
import {restfulApiConfig} from "./Config";
import {PaymentDetailData} from "../interface";

export function Post(data: PaymentDetailData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/payment", data, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.service
        };
    }).catch(err => {
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}

export function Delete(id: number): Promise<{ error: string; data: any }> {
    return axios.delete(restfulApiConfig.apiURL + "/payment/" + id, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.service
        };
    }).catch(err => {
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}

export function Put(id: number, data: PaymentDetailData): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + "/payment/" + id, data, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
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

export function GetAll(): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/payment", {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        }
    }).then(res => {
        console.log(res.data);
        return {
            error: "",
            data: res.data.payment
        };
    }).catch(err => {
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}

export function Refund(id: number): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/payment/" + id + "/refund", {}, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.service
        };
    }).catch(err => {
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}