import {Chip} from "@material-ui/core";
import React from "react";
import {GroupDetailData} from "../../../interface";

export function GroupStatusStr(data: GroupDetailData): string {
    let str: string = "";

    if (!data.pass) {
        str = "グループの審査中"
    } else if (data.add_allow) {
        str = "Service情報の申請許可中"
    } else if (data.services !== undefined && data.services.filter(value => !value.pass).length > 0) {
        str = "Service情報の審査中"
    } else if (data.services !== undefined && data.services.filter(value => value.add_allow).length > 0) {
        str = "Connection情報の申請許可中"
    } else if (data.services !== undefined) {
        let open = true;
        for (const tmpService of data.services) {
            if (tmpService.connections !== undefined) {
                for (const tmpConnection of tmpService.connections) {
                    if (!tmpConnection.open) {
                        open = false;
                        break;
                    }
                }
                if (!open) {
                    break;
                }
            }
        }
        if (!open) {
            str = "開通作業中"
        } else {
            str = "現在、申込ステータスなし"
        }
    }

    return str;
}

export function GroupStudent(props: { student: boolean, date: string }): any {
    const {student, date} = props;
    if (student) {
        const label = {date} + "まで";
        return (
            <Chip
                size="small"
                color="primary"
                label={label}
            />
        );
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="社会人"
            />
        );
    }
}

export function GroupFee(props: { fee: number }): any {
    const {fee} = props;
    if (fee === 0 || fee === null) {
        return (
            <Chip
                size="small"
                color="primary"
                label="無料"
            />
        );
    } else {
        const label = fee + "円";
        return (
            <Chip
                size="small"
                color="secondary"
                label={label}
            />
        );
    }
}

