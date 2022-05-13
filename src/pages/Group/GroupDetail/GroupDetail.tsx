import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Dashboard from "../../../components/Dashboard/Dashboard";
import {Get, GetTemplate} from "../../../api/Group";
import Users from "./User";
import {
    CircularProgress, Grid
} from "@mui/material";
import {DefaultGroupDetailData, DefaultTemplateData} from "../../../interface";
import Ticket from "../../../components/Dashboard/Ticket/Ticket";
import Request from "../../../components/Dashboard/Request/Request";
import Service from "./Service";
import {GroupProfileInfo, GroupMainMenu, GroupStatus} from "./Group";
import {useSnackbar} from "notistack";
import {GroupMemo} from "./Memo";
import {MailAutoSendDialogs, MailSendDialogs} from "../Mail";
import {StyledDivRoot1} from "../../../style";


function getTitle(id: number, org: string, org_en: string, loading: boolean): string {
    if (loading) {
        return "Loading...";
    } else if (!loading && org === "" && org_en === "") {
        return "No Data...";
    } else {
        return "id: " + id + " " + org + "(" + org_en + ")";
    }
}

export default function GroupDetail() {
    const {enqueueSnackbar} = useSnackbar();
    const [reload, setReload] = useState(true)
    const [loading, setLoading] = useState(true)
    const [group, setGroup] = useState(DefaultGroupDetailData);
    const [template, setTemplate] = useState(DefaultTemplateData);
    const [openMailSendDialog, setOpenMailSendDialog] = useState(false);
    const [openMailAutoSendDialog, setOpenMailAutoSendDialog] = useState("");
    const [sendAutoEmail, setSendAutoEmail] = useState("");
    let id: string | undefined;
    ({id} = useParams());

    useEffect(() => {
        if (reload) {
            Get(id!).then(res => {
                if (res.error === "") {
                    setGroup(res.data);
                    setReload(false);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
        }
    }, [reload]);

    useEffect(() => {
        Get(id!).then(res => {
            if (res.error === "") {
                console.log(res);
                setGroup(res.data);
                let mails = "";
                if (res.data.users != undefined) {
                    for (const user of res.data.users) {
                        if (user.level < 3) {
                            mails += user.email + ",";
                        }
                    }
                }
                setSendAutoEmail(mails);
                setLoading(false);
                setReload(false);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    useEffect(() => {
        GetTemplate().then(res => {
            if (res.error === "") {
                console.log(res);
                setTemplate(res.data);
                console.log(template);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);


    return (
        <Dashboard title={getTitle(group.ID, group.org, group.org_en, loading)}>
            {
                loading ? (
                    <StyledDivRoot1>
                        <CircularProgress/>
                        <div>loading</div>
                    </StyledDivRoot1>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <GroupStatus key={"group_status_" + group.ID} data={group} reload={reload}/>
                        </Grid>
                        <Grid item xs={2}>
                            <GroupMainMenu
                                key={"group_main_menu" + group.ID}
                                data={group}
                                autoMail={setOpenMailAutoSendDialog}
                                reload={setReload}/>
                        </Grid>
                        <Grid item xs={3}>
                            <GroupMemo key={"group_memo_" + group.ID} data={group} reload={setReload}/>
                        </Grid>
                        <Grid item xs={4}>
                            <GroupProfileInfo
                                key={"group_profile_info_" + group.ID}
                                data={group}
                                setOpenMailSendDialog={setOpenMailSendDialog}
                                template={template}
                                setReload={setReload}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Service
                                key={"service_" + group.ID}
                                data={group}
                                autoMail={setOpenMailAutoSendDialog}
                                template={template}
                                reload={setReload}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Ticket key={"ticket_" + group.ID} data={group.tickets} setReload={setReload}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Request key={"request_" + group.ID} data={group.tickets} setReload={setReload}/>
                        </Grid>
                        <Grid item xs={8}>
                            <Users key={"users_" + group.ID} data={group}/>
                        </Grid>
                        <Grid item xs={12}>
                            <MailAutoSendDialogs
                                setOpen={setOpenMailAutoSendDialog}
                                mails={sendAutoEmail}
                                template={template?.mail_template}
                                open={openMailAutoSendDialog}
                                org={group.org}
                            />
                            <MailSendDialogs
                                setOpen={setOpenMailSendDialog}
                                open={openMailSendDialog}
                                mails={sendAutoEmail}
                                template={template?.mail_template}
                                org={group.org}/>
                        </Grid>
                    </Grid>
                )
            }
        </Dashboard>
    );
}
