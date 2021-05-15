import axios from "axios";
import {restfulApiConfig} from "./Config";
import {GroupDetailData} from "../interface";

export function GetAll(): Promise<{ error: string, data: any }> {
    return axios.get(restfulApiConfig.apiURL + "/notice", {
        headers: {
            'Content-Type': 'application/json',
            ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }
    }).then(res => {
        console.log(res.data);
        return {
            error: "",
            data: res.data.notice
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}
