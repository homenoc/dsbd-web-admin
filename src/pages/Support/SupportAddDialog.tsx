import React, {useEffect} from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel,
    Grid, InputLabel, MenuItem, Radio, RadioGroup, Select,
    TextField,
} from "@material-ui/core";
import {DefaultTemplateData, DefaultTicketAddData, TemplateData} from "../../interface";
import {useSnackbar} from "notistack";
import useStyles from "./style";
import {Post} from "../../api/Support";
import {GetTemplate} from "../../api/Group";

export function SupportAddDialog() {
    const classes = useStyles();
    const [data, setData] = React.useState(DefaultTicketAddData);
    const [open, setOpen] = React.useState(false);
    const [template, setTemplate] = React.useState<TemplateData>(DefaultTemplateData);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        GetTemplate().then(res => {
            if (res.error === "") {
                console.log(res);
                setTemplate(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    const request = () => {
        console.log(data);

        if (data.is_group && data.group_id === 0) {
            enqueueSnackbar("Groupが指定されていません。", {variant: "error"});
            return;
        }
        if (!data.is_group && data.user_id === 0) {
            enqueueSnackbar("Userが指定されていません。", {variant: "error"});
            return;
        }
        if (data.title === "") {
            enqueueSnackbar("タイトルが入力されていません。", {variant: "error"});
            return;
        }
        if (data.data === "") {
            enqueueSnackbar("本文が入力されていません。", {variant: "error"});
            return;
        }
        Post(data).then(res => {
            if (res.error === undefined) {
                enqueueSnackbar("OK", {variant: "success"});
                setOpen(false);
                return;
            } else {
                enqueueSnackbar(res.error, {variant: "error"});
            }
        })
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                チケットの作成
            </Button>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    Support情報の追加
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <h3>ユーザチャットとグループチャットの違い</h3>
                            <div>ユーザチャット: ログインユーザと1対1のチャットになります。</div>
                            <div>グループチャットチャット: ログインユーザのグループとのチャット（基本はこちらでお願いします。）</div>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top"
                                        onChange={(event) => {
                                            setData({...data, is_group: event.target.value === "group"})
                                        }}>
                                <FormControlLabel value={"user"} control={<Radio color="primary"/>} label="ユーザチャット"/>
                                <FormControlLabel value={"group"} control={<Radio color="primary"/>}
                                                  label="グループチャット"/>
                            </RadioGroup>
                            <br/>
                            {
                                data.is_group &&
                                <FormControl className={classes.formSelect}>
                                    <InputLabel>Group指定</InputLabel>
                                    <Select
                                        labelId="group_id"
                                        id="group_id"
                                        onChange={(event) => {
                                            setData({...data, group_id: Number(event.target.value)})
                                        }}
                                    >
                                        {
                                            template.group?.map((row, index) => (
                                                <MenuItem key={index} value={row.ID}>{row.ID}: {row.org}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            }
                            {
                                !data.is_group &&
                                <FormControl className={classes.formSelect}>
                                    <InputLabel>User指定</InputLabel>
                                    <Select
                                        labelId="user_id"
                                        id="user_id"
                                        onChange={(event) => {
                                            setData({...data, user_id: Number(event.target.value)})
                                        }}
                                    >
                                        {
                                            template.user?.map((row, index) => (
                                                <MenuItem key={index} value={row.ID}>{row.ID}: {row.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            }
                            <br/>
                            <TextField
                                className={classes.formVeryLong}
                                id="title"
                                label="Title"
                                multiline
                                rows={1}
                                value={data.title}
                                onChange={event => setData({...data, title: event.target.value})}
                                variant="outlined"
                            />
                            <br/>
                            <TextField
                                className={classes.formVeryLong}
                                id="data"
                                label="内容"
                                multiline
                                rows={6}
                                value={data.data}
                                onChange={event => setData({...data, data: event.target.value})}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button autoFocus onClick={request} color="primary">
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}