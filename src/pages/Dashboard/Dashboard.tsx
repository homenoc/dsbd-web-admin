import React, {useEffect, useState} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {useSnackbar} from "notistack";
import {GetAll as SupportGetAll} from "../../api/Support";
import {GetAll as ServiceGetAll} from "../../api/Service";
import {GetAll as ConnectionGetAll} from "../../api/Connection";
import {
    ConnectionDetailData,
    ServiceDetailData,
    TemplateData,
    TicketDetailData
} from "../../interface";
import {Grid} from "@material-ui/core";
import Ticket from "../../components/Dashboard/Ticket/Ticket";
import Request from "../../components/Dashboard/Request/Request";
import {GetTemplate} from "../../api/Group";
import Service from "../../components/Dashboard/Service/Service";
import Connection from "../../components/Dashboard/Connection/Connection";
import {Group} from "../../components/Dashboard/Group/Group";


export default function Dashboard() {
    const {enqueueSnackbar} = useSnackbar();
    const [reload, setReload] = useState(true)
    const [ticket, setTicket] = useState<TicketDetailData[]>()
    const [request, setRequest] = useState<TicketDetailData[]>()
    const [service, setService] = useState<ServiceDetailData[]>()
    const [connection, setConnection] = useState<ConnectionDetailData[]>()
    const [template, setTemplate] = useState<TemplateData>()

    useEffect(() => {
        if (reload) {
            SupportGetAll().then(res => {
                if (res.error === "") {
                    const data = res.data;
                    setTicket(data.filter((item: TicketDetailData) => !item.solved));
                    setRequest(data.filter((item: TicketDetailData) => !item.solved && !item.request_reject));
                    setReload(false);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
            ServiceGetAll().then(res => {
                if (res.error === "") {
                    const data = res.data;
                    setService(data.filter((item: ServiceDetailData) => item.enable && !item.pass));
                    setReload(false);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
            ConnectionGetAll().then(res => {
                if (res.error === "") {
                    const data = res.data;
                    setConnection(data.filter((item: ConnectionDetailData) => item.enable && !item.open));
                    setReload(false);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
        }
    }, [reload]);

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
        <DashboardComponent title="Dashboard">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Ticket key={"ticket"} data={ticket} setReload={setReload}/>
                </Grid>
                <Grid item xs={12}>
                    <Request key={"request"} data={request} setReload={setReload}/>
                </Grid>
                <Grid item xs={12}>
                    <Service key={"service"} data={service} template={template} setReload={setReload}/>
                </Grid>
                <Grid item xs={12}>
                    <Connection key={"connection"} data={connection} template={template} setReload={setReload}/>
                </Grid>
                <Grid item xs={12}>
                    <Group key={"group"} data={template?.group} setReload={setReload}/>
                </Grid>
            </Grid>
        </DashboardComponent>
    );
}
