import axios from "axios";
import {restfulApiConfig} from "./Config";

export function Put(id: number, data: any): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + "/group/" + id, data, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.group
        };
    }).catch(err => {
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}

export function DeleteSubscription(id: number): Promise<{ error: string; data: any }> {
    return axios.delete(restfulApiConfig.apiURL + "/group/" + id + "/subscription", {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.group
        };
    }).catch(err => {
        console.log(err);
        return {
            error: "[" + err.response.status + "] " + err.response.data.error,
            data: null
        };
    })
}

export function Get(id: string): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/group/" + id, {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
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

export function GetTemplate(): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/template", {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
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

export function GetAll(): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/group", {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
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
