import axios from "axios";
import {restfulApiConfig} from "./Config";
import {IPData, JPNICData, PlanData, ServiceDetailData} from "../interface";

export function Put(id: number, data: ServiceDetailData): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + "/service/" + id, data, {
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

export function PutIP(data: IPData): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + '/ip/' + data.ID,
        data, {
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

export function PutPlan(data: PlanData): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + '/plan/' + data.ID,
        data, {
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

export function PutJPNICAdmin(id: number, data: JPNICData): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + "/jpnic_admin/" + id, data, {
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

export function PostJPNICTech(id: number, data: JPNICData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/service/" + id + "/jpnic_tech", data, {
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

export function DeleteJPNICTech(id: number): Promise<{ error: string; data: any }> {
    return axios.delete(restfulApiConfig.apiURL + "/jpnic_tech/" + id, {
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

export function PutJPNICTech(id: number, data: JPNICData): Promise<{ error: string; data: any }> {
    return axios.put(restfulApiConfig.apiURL + "/jpnic_tech/" + id, data, {
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

export function Get(id: string): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/service/" + id, {
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

export function GetAll(): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/service", {
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
