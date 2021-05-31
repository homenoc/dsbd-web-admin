import {ConnectionAddData, TemplateData} from "../../../../interface";

export function check(data: ConnectionAddData, template: TemplateData): string {
    // check connection template id
    if (data.connection_template_id === 0) {
        return "service codeが選択されていません。"
    }

    // check
    // if(data.)

    // if no error
    return "";
}
