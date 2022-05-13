import React, {Dispatch, SetStateAction, useEffect} from "react";
import {DefaultMailSendData, MailTemplateData} from "../../interface";
import {useSnackbar} from "notistack";
import {Post} from "../../api/Mail";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid, MenuItem, Select, SelectChangeEvent,
    TextField
} from "@mui/material";

export function MailAutoSendDialogs(props: {
    open: string,
    setOpen: Dispatch<SetStateAction<string>>
    mails: string
    template: MailTemplateData[] | undefined
    org: string
}) {
    const {open, setOpen, template, mails, org} = props
    const [data, setData] = React.useState(DefaultMailSendData);
    const [toMail, setToMail] = React.useState("");
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (open !== "") {
            setToMail(mails);

            if (template !== undefined) {
                const getMailTemplate = template.filter(item => item.process_id === open);
                const mailSignature = template.filter(item => item.process_id === "signature");
                if (getMailTemplate !== undefined && mailSignature !== undefined) {
                    let message = getMailTemplate[0].message.replace('{GROUP_NAME}', org);
                    message += mailSignature[0].message;
                    console.log(getMailTemplate[0].subject)
                    setData({
                        to_mail: "",
                        subject: getMailTemplate[0].subject,
                        content: message,
                    });
                }
            }

        }
    }, [open]);

    const request = () => {
        // data.group_id = baseData.ID
        console.log(data);
        const mailArray = mails.split(',');
        for (const mail of mailArray) {
            if (mail !== "") {
                Post({
                    to_mail: mail,
                    subject: data.subject,
                    content: data.content
                }).then(res => {
                    if (res.error === "") {
                        console.log(res.data);
                        enqueueSnackbar('Request Success', {variant: "success"});
                    } else {
                        enqueueSnackbar(res.error, {variant: "error"});
                    }
                })
            }
        }
        setOpen("");
    }

    return (
        <div>
            <Dialog
                onClose={() => setOpen("")}
                fullWidth={true}
                aria-labelledby="customized-dialog-title"
                open={open !== ""}
                PaperProps={{
                    style: {
                        backgroundColor: "#2b2a2a",
                    },
                }}>
                <DialogTitle id="mail-auto-send-dialog-title">
                    Mail送信
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                id="to"
                                label="To"
                                variant="outlined"
                                value={toMail}
                                onChange={(event) => {
                                    setToMail(event.target.value)
                                }}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                id="title"
                                label="Mail Subject"
                                variant="outlined"
                                inputProps={{maxLength: 100}}
                                fullWidth={true}
                                value={data.subject}
                                onChange={(event) => {
                                    setData({...data, subject: event.target.value})
                                }}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                id="message"
                                label="Mail Body"
                                multiline
                                rows={8}
                                fullWidth={true}
                                inputProps={{maxLength: 1000}}
                                variant="outlined"
                                value={data.content}
                                onChange={(event) => {
                                    setData({...data, content: event.target.value})
                                }}

                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen("")} color="secondary">
                        キャンセル
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        送信
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function MailSendDialogs(props: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    mails: string
    template: MailTemplateData[] | undefined
    org: string
}) {
    const {open, setOpen, template, mails, org} = props
    const [data, setData] = React.useState(DefaultMailSendData);
    const [processID, setProcessID] = React.useState("");
    const [toMail, setToMail] = React.useState(mails);
    const {enqueueSnackbar} = useSnackbar();

    const request = () => {
        // data.group_id = baseData.ID
        console.log(data);
        const mailArray = mails.split(',');
        for (const mail of mailArray) {
            Post({
                to_mail: mail,
                subject: data.subject,
                content: data.content
            }).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                } else {
                    enqueueSnackbar(res.error, {variant: "error"});
                }
            })
        }
        setOpen(false);
    }

    const handleChangeProcessID = (event: SelectChangeEvent<any>) => {
        setProcessID(event.target.value);
        const mailSignature = template?.filter(item => item.process_id === "signature");
        const getMailTemplate = template?.filter(item => item.process_id === event.target.value);
        if (getMailTemplate !== undefined && mailSignature !== undefined) {
            let message = getMailTemplate[0].message.replace('{GROUP_NAME}', org);
            message += mailSignature[0].message;

            setData({
                to_mail: "",
                subject: getMailTemplate[0].subject,
                content: message
            })
        }
    };

    return (
        <div>
            <Dialog
                onClose={() => setOpen(false)}
                fullWidth={true}
                aria-labelledby="customized-dialog-title"
                open={open}
                PaperProps={{
                    style: {
                        backgroundColor: "#2b2a2a",
                    },
                }}>
                <DialogTitle id="mail-auto-send-dialog-title">
                    Mail送信
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Select
                                labelId="mail-template-label"
                                id="mail-template-select"
                                value={processID}
                                onChange={handleChangeProcessID}
                            >
                                {
                                    template?.map(tmp =>
                                        <MenuItem
                                            key={"mail_template_" + tmp.process_id}
                                            value={tmp.process_id}
                                        >
                                            {tmp.process_id}({tmp.subject})
                                        </MenuItem>
                                    )
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="to"
                                label="To"
                                variant="outlined"
                                value={mails}
                                onChange={(event) => {
                                    setToMail(event.target.value)
                                }}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                id="title"
                                label="Mail Subject"
                                variant="outlined"
                                inputProps={{maxLength: 100}}
                                fullWidth={true}
                                value={data.subject}
                                onChange={(event) => {
                                    setData({...data, subject: event.target.value})
                                }}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                id="message"
                                label="Mail Body"
                                multiline
                                rows={8}
                                fullWidth={true}
                                inputProps={{maxLength: 1000}}
                                variant="outlined"
                                value={data.content}
                                onChange={(event) => {
                                    setData({...data, content: event.target.value})
                                }}

                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        キャンセル
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        送信
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function MailAutoNoticeSendDialogs(props: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    mails: string
    template: MailTemplateData[] | undefined
    title: string
    body: string
}) {
    const {open, setOpen, template, mails, title, body} = props
    const [data, setData] = React.useState(DefaultMailSendData);
    const [toMail, setToMail] = React.useState("");
    const {enqueueSnackbar} = useSnackbar();
    const templateID = "notice"

    useEffect(() => {
        if (open) {
            setToMail(mails);

            if (template !== undefined) {
                const getMailTemplate = template.filter(item => item.process_id === templateID);
                const mailSignature = template.filter(item => item.process_id === "signature");
                if (getMailTemplate !== undefined && mailSignature !== undefined) {
                    let message = getMailTemplate[0].message.replace('{TITLE}', title);
                    message = message.replace('{BODY}', body);
                    message += mailSignature[0].message;
                    console.log(getMailTemplate[0].subject)
                    let subject = getMailTemplate[0].subject.replace('{TITLE}', title);
                    setData({
                        to_mail: "",
                        subject: subject,
                        content: message,
                    });
                }
            }
        }
    }, [open]);

    const request = () => {
        // data.group_id = baseData.ID
        console.log(data);
        const mailArray = mails.split(',');
        for (const mail of mailArray) {
            if (mail !== "") {
                Post({
                    to_mail: mail,
                    subject: data.subject,
                    content: data.content
                }).then(res => {
                    if (res.error === "") {
                        console.log(res.data);
                        enqueueSnackbar('Request Success', {variant: "success"});
                    } else {
                        enqueueSnackbar(res.error, {variant: "error"});
                    }
                })
            }
        }
        setOpen(false);
    }

    return (
        <div>
            <Dialog
                onClose={() => setOpen(false)}
                fullWidth={true}
                aria-labelledby="customized-dialog-title"
                open={open}
                PaperProps={{
                    style: {
                        backgroundColor: "#2b2a2a",
                    },
                }}>
                <DialogTitle id="mail-auto-send-dialog-title">
                    Mail送信
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                id="to"
                                label="To"
                                variant="outlined"
                                value={toMail}
                                onChange={(event) => {
                                    setToMail(event.target.value)
                                }}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                id="title"
                                label="Mail Subject"
                                variant="outlined"
                                inputProps={{maxLength: 100}}
                                fullWidth={true}
                                value={data.subject}
                                onChange={(event) => {
                                    setData({...data, subject: event.target.value})
                                }}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                id="message"
                                label="Mail Body"
                                multiline
                                rows={8}
                                fullWidth={true}
                                inputProps={{maxLength: 1000}}
                                variant="outlined"
                                value={data.content}
                                onChange={(event) => {
                                    setData({...data, content: event.target.value})
                                }}

                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        キャンセル
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        送信
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
