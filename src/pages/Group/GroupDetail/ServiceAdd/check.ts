import {ServiceAddData, ServiceAddJPNICData, TemplateData} from "../../../../interface";

export function check(data: ServiceAddData, template: TemplateData): string {
    // check service template id
    if (data.service_template_id === 0) {
        return "サービスが選択されていません。"
    }
    // check services
    const dataExtra = template.services?.filter(item => item.ID === data.service_template_id);
    // need jpnic form
    if (!(dataExtra === undefined || dataExtra.length !== 1) && dataExtra[0].need_jpnic) {
        let err: string;

        // check assign ip form
        if (data.ip === undefined || data.ip.length === 0) {
            return "申請IPアドレスが正しく入力されていません。";
        }
        for (const ip of data.ip) {
            console.log(ip);
            if (ip.version === 4) {
                const dataExtra = template.ipv4?.filter(item => item.subnet === ip.ip);
                if (dataExtra === undefined || dataExtra.length !== 1) {
                    return "テンプレートデータが読みだせません。";
                } else {
                    const quantity = dataExtra[0].quantity
                    console.log(dataExtra[0].quantity);
                    if (ip.plan === undefined) {
                        return "IPv4のプランがありません。";
                    }
                    let after = 0;
                    let half_year = 0;
                    let one_year = 0;

                    for (const plan of ip.plan) {
                        after += plan.after;
                        half_year += plan.half_year;
                        one_year += plan.one_year;
                    }
                    if (after < quantity / 4) {
                        return "直後のv4プランが適切ではありません。"
                    }
                    if (half_year < quantity / 2) {
                        return "半年後のv4プランが適切ではありません。"
                    }
                    if (one_year < quantity / 2) {
                        return "1年後のv4プランが適切ではありません。"
                    }
                    if (ip.name === "") {
                        return "IPv4のネットワーク名が入力されていません。"
                    }
                }
            } else if (ip.version === 6) {
                const dataExtra = template.ipv6?.filter(item => item.subnet === ip.ip);
                console.log(dataExtra);
            }
        }

        // check jpnic form
        if (data.org === undefined || data.org === "") {
            return "1.2.1. JPNICの登録情報の団体名が入力されていません。";
        }
        if (data.org_en === undefined || data.org_en === "") {
            return "1.2.1. JPNICの登録情報の団体名(English)が入力されていません。";
        }
        if (data.postcode === undefined || data.postcode === "") {
            return "1.2.1. JPNICの登録情報の郵便番号が入力されていません。";
        }
        if (data.address === undefined || data.address === "") {
            return "1.2.1. JPNICの登録情報の住所が入力されていません。";
        }
        if (data.address_en === undefined || data.address_en === "") {
            return "1.2.1. JPNICの登録情報の住所(English)が入力されていません。";
        }

        // check jpnic_admin form
        if (data.jpnic_admin === undefined) {
            return "1.2.2. 管理者連絡窓口が入力されていません。";
        }

        err = checkJPNIC(data.jpnic_admin, "1.2.2. 管理者連絡窓口の");
        if (err !== "") {
            return err;
        }

        // check jpnic_tech form
        if (data.jpnic_tech === undefined || data.jpnic_tech.length === 0) {
            return "1.2.3.技術連絡担当者が入力されていません。";
        }

        for (const jpnic of data.jpnic_tech) {
            err = checkJPNIC(data.jpnic_admin, "1.2.3. 技術連絡担当者の");
            if (err !== "") {
                return err;
            }
        }
    }
    // need global as
    if (!(dataExtra === undefined || dataExtra.length !== 1) && dataExtra[0].need_global_as) {
        // check ASN
        if (data.asn === undefined || data.asn === 0) {
            return "AS番号が入力されていません。"
        }
        // check IP
        if (data.ip === undefined || data.ip.length === 0) {
            return "申請IPアドレスが正しく入力されていません。";
        }
    }

    // if no error
    return "";
}

function checkJPNIC(data: ServiceAddJPNICData, errorMessage: string): string {
    if (data.org === "") {
        return errorMessage + "団体名が入力されていません。";
    }
    if (data.org_en === "") {
        return errorMessage + "団体名(English)が入力されていません。";
    }
    if (data.name === "") {
        return errorMessage + "名前が入力されていません。";
    }
    if (data.name_en === "") {
        return errorMessage + "名前(English)が入力されていません。";
    }
    if (data.postcode === "") {
        return errorMessage + "郵便番号が入力されていません。";
    }
    if (data.address === "") {
        return errorMessage + "住所が入力されていません。";
    }
    if (data.address_en === "") {
        return errorMessage + "住所(English)が入力されていません。";
    }
    if (data.tel === "") {
        return errorMessage + "電話番号が入力されていません。";
    }
    if (data.mail === "") {
        return errorMessage + "メールが入力されていません。";
    }
    if (data.country === "") {
        return errorMessage + "居住国が入力されていません。";
    }

    return ""
}