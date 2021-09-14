import React, {Dispatch, SetStateAction, useEffect} from "react";
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    Grid,
    TextField, useTheme,
} from "@material-ui/core";
import Select from 'react-select';
import {
    ConnectionDetailData,
    DefaultNoticeRegisterData,
    TemplateData,
} from "../../../interface";
import useStyles, {GetSelectTheme} from "./styles";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {Post} from "../../../api/Notice";
import {useSnackbar} from "notistack";
import {MailAutoNoticeSendDialogs} from "../../Group/Mail";

type OptionType = {
    label: string
    value: number
}

export default function NoticeAddDialogs(props: {
    template: TemplateData,
    connection: ConnectionDetailData[] | undefined,
    setReload: Dispatch<SetStateAction<boolean>>
    reload: boolean
}) {
    const {template, connection, reload, setReload} = props
    const [open, setOpen] = React.useState(false);
    const nowDate = new Date()
    const [checkBoxEndDatePermanent, setCheckBoxEndDatePermanent] = React.useState(true);
    const [data, setData] = React.useState(DefaultNoticeRegisterData);
    const [email, setEmail] = React.useState<string>("");
    const [openMailSendDialog, setOpenMailSendDialog] = React.useState(false)
    const [templateUser, setTemplateUser] = React.useState<OptionType[]>([]);
    const [templateGroup, setTemplateGroup] = React.useState <OptionType[]>([]);
    const [templateNOC, setTemplateNOC] = React.useState<OptionType[]>([]);
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const tmpSelectTheme = GetSelectTheme(useTheme());

    useEffect(() => {
        if (template !== undefined) {
            setData({
                ...data, start_time: nowDate.getFullYear() + '-' + ('00' + (nowDate.getMonth() + 1)).slice(-2) +
                    '-' + ('00' + (nowDate.getDate())).slice(-2) + " " + ('00' + (nowDate.getHours())).slice(-2) +
                    ":" + ('00' + (nowDate.getMinutes())).slice(-2) + ":00"
            });
            if (template.user !== undefined) {
                let templateTmp: OptionType[] = []
                for (const tmp of template.user) {
                    templateTmp.push({value: tmp.ID, label: tmp.name + "(" + tmp.name_en + ")"})
                }
                setTemplateUser(templateTmp);
            }
            if (template.group !== undefined) {
                let templateTmp: OptionType[] = []
                for (const tmp of template.group) {
                    templateTmp.push({value: tmp.ID, label: tmp.org + "(" + tmp.org_en + ")"})
                }
                setTemplateGroup(templateTmp);
            }
            if (template.nocs !== undefined) {
                let templateTmp: OptionType[] = []
                for (const tmp of template.nocs) {
                    templateTmp.push({value: tmp.ID, label: tmp.name})
                }
                setTemplateNOC(templateTmp);
            }
        }
        setReload(false);
    }, [reload]);

    const handleBeginDateChange = (date: Date | null) => {
        if (date !== null) {
            setData({
                ...data, start_time: date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) +
                    '-' + ('00' + (date.getDate())).slice(-2) + " " + ('00' + (date.getHours())).slice(-2) +
                    ":" + ('00' + (date.getMinutes())).slice(-2) + ":00"
            });
            console.log()
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date !== null) {
            setData({
                ...data, end_time: date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) +
                    '-' + ('00' + (date.getDate())).slice(-2) + " " + ('00' + (date.getHours())).slice(-2) +
                    ":" + ('00' + (date.getMinutes())).slice(-2) + ":00"
            });
        }
    };

    const handleEndDatePermanentCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxEndDatePermanent(event.target.checked);
        if (event.target.checked) {
            setData({...data, end_time: undefined});
        } else {
            setData({...data, end_time: ""});
        }
    }

    const getEMail = () => {
        // Mail用
        let emails = ""

        for (const tmpUserID of data.user_id) {
            const u = template.user?.filter(d => d.ID === tmpUserID);
            if (u !== undefined) {
                if (emails.indexOf(u[0].email) === -1) {
                    console.log(u[0].email)
                    emails += "," + u[0].email;
                }
            }
        }
        for (const tmpGroupID of data.group_id) {
            const tmpUser = template.user?.filter(d => d.group_id === tmpGroupID && d.level < 3);
            if (tmpUser !== undefined) {
                if (emails.indexOf(tmpUser[0].email) === -1) {
                    emails += "," + tmpUser[0].email
                }
            }
        }
        for (const tmpNOCID of data.noc_id) {
            // const tmpBGP
            const tmpConnections = connection?.filter(d => d.bgp_router?.noc_id === tmpNOCID && d.enable);
            if (tmpConnections !== undefined) {
                for (const tmpConnection of tmpConnections) {
                    const tmpUser = template.user?.filter(d => d.group_id === tmpConnection.service?.group_id && d.level < 3);
                    if (tmpUser !== undefined) {
                        if (emails.indexOf(tmpUser[0].email) === -1) {
                            emails += "," + tmpUser[0].email;
                        }
                    }
                }
            }
        }
        return emails.slice(1);
    }

    const request = () => {
        console.log(data);

        setEmail(getEMail());

        Post(data).then(res => {
            if (res.error === "") {
                enqueueSnackbar("登録しました。", {variant: "success"});
                setOpenMailSendDialog(true);
                // setOpen(false);
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
            setReload(true);
        })
    }

    return (
        <div>
            <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
                追加
            </Button>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    通知機能の追加
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                id="title"
                                label="Title"
                                style={{margin: 8}}
                                className={classes.wrapTitleText}
                                value={data.title}
                                placeholder="Title"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={event => {
                                    setData({...data, title: event.target.value});
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="message"
                                label="Message"
                                placeholder="Message"
                                style={{margin: 8}}
                                className={classes.wrapText}
                                value={data.data}
                                multiline
                                rows={10}
                                onChange={event => {
                                    setData({...data, data: event.target.value});
                                }}
                                variant="outlined"
                            />
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </Grid>
                        <Grid item xs={12}>
                            <h2>通知期間</h2>
                        </Grid>
                        <Grid item xs={3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    margin="normal"
                                    id="begin-date-picker-dialog"
                                    label="掲示開始日"
                                    format="yyyy/MM/dd HH:mm"
                                    ampm={false}
                                    minDate={nowDate}
                                    value={data.start_time}
                                    onChange={handleBeginDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkBoxEndDatePermanent}
                                        onChange={handleEndDatePermanentCheckBoxChange}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="接続終了日が未定"
                            />
                            <br/>
                            {
                                !checkBoxEndDatePermanent &&
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDateTimePicker
                                        margin="normal"
                                        id="begin-date-picker-dialog"
                                        label="掲示終了日"
                                        format="yyyy/MM/dd HH:mm"
                                        ampm={false}
                                        minDate={data.start_time}
                                        value={data.end_time}
                                        onChange={handleEndDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            }
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                        <Grid item xs={12}>
                            <h2>通知先</h2>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        value={data.everyone}
                                        onChange={event => setData({...data, everyone: event.target.checked})}
                                    />
                                }
                                label="全体に通知"
                            />
                            {
                                !data.everyone && <div>
                                    <div>優先度は<b>{"User > Group > NOC"}</b>の順に通知処理を行います。</div>
                                    <br/>
                                    <h3>ユーザ</h3>
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={templateUser}
                                        className="basic-multi-select"
                                        classNamePrefix="user"
                                        onChange={event => {
                                            let tmpData: number[] = [];
                                            for (const tmp of event) {
                                                tmpData.push(tmp.value);
                                            }
                                            setData({...data, user_id: tmpData})
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...tmpSelectTheme
                                            },
                                        })}
                                    />
                                    <h3>グループ</h3>
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={templateGroup}
                                        className="basic-multi-select"
                                        classNamePrefix="group"
                                        onChange={event => {
                                            let tmpData: number[] = [];
                                            for (const tmp of event) {
                                                tmpData.push(tmp.value);
                                            }
                                            setData({...data, group_id: tmpData});
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...tmpSelectTheme
                                            },
                                        })}
                                    />
                                    <h3>NOC</h3>
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={templateNOC}
                                        className="basic-multi-select"
                                        classNamePrefix="noc"
                                        onChange={event => {
                                            let tmpData: number[] = [];
                                            for (const tmp of event) {
                                                tmpData.push(tmp.value);
                                            }
                                            setData({...data, noc_id: tmpData});
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...tmpSelectTheme
                                            },
                                        })}
                                    />
                                </div>
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Option</h2>
                            <FormControlLabel
                                control={<Checkbox
                                    color="secondary"
                                    value={data.important}
                                    onChange={event => setData({...data, important: event.target.checked})}
                                />}
                                label="重要"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    color="primary"
                                    value={data.info}
                                    onChange={event => setData({...data, info: event.target.checked})}
                                />}
                                label="情報"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    color="secondary"
                                    value={data.fault}
                                    onChange={event => setData({...data, fault: event.target.checked})}
                                />}
                                label="障害"
                                labelPlacement="top"
                            />
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        登録
                    </Button>
                    <Button autoFocus onClick={() => enqueueSnackbar("E-Mail: " + getEMail(), {variant: "info"})}>
                        送信メールアドレスの確認
                    </Button>
                </DialogActions>
            </Dialog>
            <MailAutoNoticeSendDialogs
                setOpen={setOpenMailSendDialog}
                open={openMailSendDialog}
                mails={email}
                template={template?.mail_template}
                title={data.title}
                body={data.data}
            />
        </div>
    );
}
