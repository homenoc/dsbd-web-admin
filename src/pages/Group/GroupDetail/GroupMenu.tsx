import {Button, Menu, MenuItem} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";
import {GroupDetailData} from "../../../interface";
import useStyles from "./styles";
import {Put} from "../../../api/Group";
import {useSnackbar} from "notistack";

export function GroupStatusButton(props: { data: GroupDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const {data, reload} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeStatus = (status: number) => {
        data.status = status;

        Put(data.ID, data).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            handleClose();
            reload(true);
        })
    };

    const changePassStatus = (pass: boolean) => {
        data.pass = pass;
        Put(data.ID, data).then(res => {
            if (res.error === "") {
                console.log(res.data);
            } else {
                console.log(res.error);
            }

            handleClose();
            reload(true);
        })
    };


    if (data.pass) {
        if (data.status === 2) {
            return (
                <Button
                    className={classes.button1}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => changeStatus(3)}
                    color={"primary"}
                    variant="contained"
                >
                    サービス審査完了
                </Button>
            )
        } else if (data.status === 4) {
            return (
                <Button
                    className={classes.button1}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => changeStatus(0)}
                    color={"primary"}
                    variant="outlined"
                >
                    開通作業の完了
                </Button>
            )
        }

        return (
            <div>
                <Button
                    className={classes.button1}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    color={"primary"}
                    variant="outlined"
                >
                    Status変更処理
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => changeStatus(0)}>(0)申込Statusなし</MenuItem>
                    <MenuItem onClick={() => changeStatus(1)}>(1)[新規]サービス情報</MenuItem>
                    <MenuItem onClick={() => changeStatus(3)}>(3)[新規]接続情報</MenuItem>
                    <MenuItem onClick={() => changePassStatus(false)}>未審査状態に戻す</MenuItem>
                </Menu>
            </div>
        )
    } else {
        return (
            <Button
                className={classes.button1}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => changePassStatus(true)}
                color={"primary"}
                variant="contained"
            >
                審査
            </Button>
        )
    }
}

export function GroupLockButton(props: { data: GroupDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const {data, reload} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const changeLock = (lock: boolean) => {
        data.lock = lock;

        Put(data.ID, data).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            reload(true);
        })
    };


    if (data.lock) {
        return (
            <Button
                className={classes.button1}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => changeLock(false)}
                color={"secondary"}
                variant="outlined"
            >
                変更を禁止
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
                変更を許可
            </Button>
        )
    }
}

export function GroupAbolition(): any {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                className={classes.button1}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                color={"secondary"}
                variant="outlined"
            >
                廃止処理
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>審査落ち</MenuItem>
                <MenuItem onClick={handleClose}>ユーザより廃止</MenuItem>
                <MenuItem onClick={handleClose}>運営委員より廃止</MenuItem>
            </Menu>
        </div>
    );
}
