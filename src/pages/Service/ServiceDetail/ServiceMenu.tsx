import {Button} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";
import useStyles from "./styles";
import {useSnackbar} from "notistack";
import {ServiceDetailData} from "../../../interface";
import {Put} from "../../../api/Service";

export function ServiceAddAllowButton(props: { service: ServiceDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const {service, reload} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const changeLock = (add_allow: boolean) => {
        service.add_allow = add_allow;

        Put(service.ID, service).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            reload(true);
        })
    };


    if (service.add_allow) {
        return (
            <Button
                className={classes.button1}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => changeLock(false)}
                color={"secondary"}
                variant="outlined"
            >
                追加を禁止
            </Button>
        )
    } else {
        return (
            <Button
                className={classes.button1}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => changeLock(true)}
                color={"primary"}
                variant="outlined"
            >
                接続追加を許可
            </Button>
        )
    }
}

export function ServiceLockButton(props: { service: ServiceDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const {service, reload} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const changeLock = (lock: boolean) => {
        service.lock = lock;

        Put(service.ID, service).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            reload(true);
        })
    };


    if (service.lock) {
        return (
            <Button
                className={classes.button1}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => changeLock(false)}
                color={"secondary"}
                variant="outlined"
            >
                ユーザ側の変更を禁止
            </Button>
        )
    } else {
        return (
            <Button
                className={classes.button1}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => changeLock(true)}
                color={"primary"}
                variant="outlined"
            >
                ユーザ側の変更を許可
            </Button>
        )
    }
}
