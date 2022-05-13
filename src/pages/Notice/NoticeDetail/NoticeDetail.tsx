import React, {Dispatch, SetStateAction, useEffect} from "react";
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    Grid, TextField,
} from "@mui/material";
import {
    NoticeData, TemplateData,
} from "../../../interface";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {Put} from "../../../api/Notice";
import {useSnackbar} from "notistack";
import {StyledTextFieldWrap, StyledTextFieldWrapTitle} from "../../../style";
import {DateTimePicker, LocalizationProvider} from "@mui/lab";

export default function NoticeDetailDialogs(props: {
    template: TemplateData,
    noticeData: NoticeData,
    setReload: Dispatch<SetStateAction<boolean>>
    reloadTemplate: boolean
}) {
    const {noticeData, reloadTemplate, setReload} = props
    const [open, setOpen] = React.useState(false);
    const nowDate = new Date()
    const [checkBoxEndDatePermanent, setCheckBoxEndDatePermanent] = React.useState(false);
    const [data, setData] = React.useState<NoticeData>(noticeData);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        setData({
            ...data, start_time: nowDate.getFullYear() + '-' + ('00' + (nowDate.getMonth() + 1)).slice(-2) +
                '-' + ('00' + (nowDate.getDate())).slice(-2) + " " + nowDate.getHours() + ":" + nowDate.getMinutes() +
                ":00"
        });
        if (noticeData.end_time === "9999-12-31T14:59:59Z") {
            setCheckBoxEndDatePermanent(true);
        }
    }, [reloadTemplate]);

    const handleBeginDateChange = (date: Date | null) => {
        if (date !== null) {
            setData({
                ...data, start_time: date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) +
                    '-' + ('00' + (date.getDate())).slice(-2) + " " + ('00' + (date.getHours())).slice(-2) +
                    ":" + ('00' + (date.getMinutes())).slice(-2) + ":00"
            });
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
            setData({...data, end_time: ""});
        } else {
            setData({...data, end_time: ""});
        }
    }

    const request = () => {
        console.log(data);
        const tmp = new Date(data.start_time);
        console.log(tmp);
        Put(noticeData.ID, data).then(res => {
            if (res.error === "") {
                enqueueSnackbar("登録しました。", {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
            setOpen(false);
            setReload(true);
        })
    }

    return (
        <div>
            <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
                Detail
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
                            <StyledTextFieldWrapTitle
                                id="title"
                                label="Title"
                                style={{margin: 8}}
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
                            <StyledTextFieldWrap
                                id="message"
                                label="Message"
                                placeholder="Message"
                                style={{margin: 8}}
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="掲示開始日"
                                    key="begin-date-picker-dialog"
                                    value={data.start_time}
                                    inputFormat="yyyy/MM/dd HH:mm"
                                    onChange={handleBeginDateChange}
                                    renderInput={(params) => (
                                        <TextField {...params} helperText="Clear Initial State"/>
                                    )}
                                />
                            </LocalizationProvider>
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
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        clearable
                                        key="finish-date-picker-dialog"
                                        label="掲示終了日"
                                        value={data.end_time}
                                        inputFormat="yyyy/MM/dd HH:mm"
                                        // minDate={data.start_time}
                                        onChange={handleEndDateChange}
                                        renderInput={(params) => (
                                            <TextField {...params} helperText={params?.inputProps?.placeholder}/>
                                        )}
                                    />
                                </LocalizationProvider>
                            }
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                        <Grid item xs={12}>
                            <h2>通知先</h2>
                            <p>通知先を変更する場合は、該当通知を削除してから再追加してください。</p>
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Option</h2>
                            <FormControlLabel
                                control={<Checkbox
                                    color="secondary"
                                    checked={data.important}
                                    onChange={event => setData({...data, important: event.target.checked})}
                                />}
                                label="重要"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    color="primary"
                                    checked={data.info}
                                    onChange={event => setData({...data, info: event.target.checked})}
                                />}
                                label="情報"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    color="secondary"
                                    checked={data.fault}
                                    onChange={event => setData({...data, fault: event.target.checked})}
                                />}
                                label="障害"
                                labelPlacement="top"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        更新
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
