import React, {useEffect, useState} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {useSnackbar} from "notistack";
import {GetAll} from "../../api/Support";
import {TicketDetailData} from "../../interface";
import {Grid} from "@material-ui/core";
import Ticket from "../../components/Dashboard/Ticket/Ticket";
import Request from "../../components/Dashboard/Request/Request";


export default function Dashboard() {
    const {enqueueSnackbar} = useSnackbar();
    const [reload, setReload] = useState(true)
    const [ticket, setTicket] = useState<TicketDetailData[]>()
    const [request, setRequest] = useState<TicketDetailData[]>()

    useEffect(() => {
        if (reload) {
            GetAll().then(res => {
                if (res.error === "") {
                    const data = res.data;
                    setTicket(data.filter((item: TicketDetailData) => !item.solved));
                    setRequest(data.filter((item: TicketDetailData) => !item.solved && !item.request_reject));
                    setReload(false);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
        }
    }, [reload]);

    return (
        <DashboardComponent title="Dashboard">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Ticket key={"ticket"} data={ticket} setReload={setReload}/>
                </Grid>
                <Grid item xs={12}>
                    <Request key={"request"} data={request} setReload={setReload}/>
                </Grid>
            </Grid>
        </DashboardComponent>
    );
}
