import {Button, Menu, MenuItem} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";
import {GroupDetailData} from "../../../interface";
import useStyles from "./styles";
import {Put} from "../../../api/Group";
import {useSnackbar} from "notistack";

export function GroupStatusButton(props: {
    data: GroupDetailData,
    autoMail: Dispatch<SetStateAction<string>>,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, autoMail, reload} = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changePassStatus = (pass: boolean) => {
        data.pass = pass;
        Put(data.ID, data).then(res => {
            if (res.error === "") {
                console.log(res.data);
            } else {
                console.log(res.error);
            }

            if (pass) {
                autoMail("pass_the_examination");
            }

            handleClose();
            reload(true);
        })
    };

    const changeAddAllowStatus = (add_allow: boolean) => {
        data.add_allow = add_allow;
        Put(data.ID, data).then(res => {
            if (res.error === "") {
                console.log(res.data);
            } else {
                console.log(res.error);
            }

            if (add_allow) {
                autoMail("pass_the_examination");
            }

            handleClose();
            reload(true);
        })
    };

    return (
        <div>
            {
                !data.pass &&
                <Button
                    className={classes.button1}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => changePassStatus(true)}
                    color={"primary"}
                    variant="contained"
                >
                    審査OK
                </Button>
            }
            {
                !data.add_allow &&
                <Button
                    className={classes.button1}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => changeAddAllowStatus(true)}
                    color={"primary"}
                    variant="contained"
                >
                    サービス申請許可
                </Button>
            }
            {
                data.add_allow &&
                <Button
                    className={classes.button1}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => changeAddAllowStatus(false)}
                    color={"secondary"}
                    variant="outlined"
                >
                    サービス新規申請を禁止
                </Button>
            }
        </div>
    )
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
