import {Chip} from "@material-ui/core";
import React from "react";

export function GroupStatusStr(data: number): string {
    let str: string = "";

    if (data === 1) {
        str = "[サービス]　記入段階"
    } else if (data === 2) {
        str = "[サービス]　審査中"
    } else if (data === 3) {
        str = "[接続]　記入段階"
    } else if (data === 4) {
        str = "開通作業段階"
    }else{
        str="現在、申込ステータスなし"
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

