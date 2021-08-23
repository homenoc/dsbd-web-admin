import {ConnectionAddData, TemplateData} from "../../../../interface";

export function check(serviceID: number, data: ConnectionAddData, template: TemplateData): string {
    // check connection template id
    if (serviceID === 0) {
        return "Serviceが選択されていません。。"
    }

    // check
    // if(data.)

    // if no error
    return "";
}
