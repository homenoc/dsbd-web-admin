import {IPData, PlanData, TemplateData} from "../../../../interface";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import useStyles from "../styles";
import {useSnackbar} from "notistack";
import {
    Box, Button,
    Card,
    CardContent, Collapse, Grid, IconButton, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {Enable} from "../../../../components/Dashboard/Open/Open";
import {DeleteIP, DeletePlan, PutIP, PutPlan} from "../../../../api/Service";
import {DeleteAlertDialog} from "../../../../components/Dashboard/Alert/Alert";
import {AddAssignIPDialog} from "./IPAdd";

export function IPOpenButton(props: {
    ip: IPData,
    lockInfo: boolean,
    setLockInfo: Dispatch<SetStateAction<boolean>>
    reload: Dispatch<SetStateAction<boolean>>
    template: TemplateData
}): any {
    const {ip, lockInfo, setLockInfo, reload} = props;
    const {enqueueSnackbar} = useSnackbar();

    // Update IP Information
    const updateInfo = (open: boolean) => {
        ip.open = open;
        PutIP(ip).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            setLockInfo(true);
            reload(true);
        })
    }

    if (!ip.open) {
        return (
            <Button size="small" color="primary" disabled={lockInfo} onClick={() => updateInfo(true)}>
                有効
            </Button>
        )
    } else {
        return (
            <Button size="small" color="secondary" disabled={lockInfo} onClick={() => updateInfo(false)}>
                無効
            </Button>
        )
    }
}

export function ServiceIPBase(props: {
    serviceID: number,
    ip: IPData[] | undefined,
    reload: Dispatch<SetStateAction<boolean>>
    template: TemplateData
}): any {
    const {ip, serviceID, reload, template} = props;

    if (ip === undefined) {
        return (
            <Card>
                <CardContent>
                    <h3>IP</h3>
                    <p><b>情報なし</b></p>
                </CardContent>
            </Card>
        )
    } else {
        return (
            <ServiceIP key={serviceID} serviceID={serviceID} ip={ip} reload={reload} template={template}/>
        )
    }
}

export function ServiceIP(props: {
    serviceID: number,
    ip: IPData[],
    reload: Dispatch<SetStateAction<boolean>>
    template: TemplateData
}): any {
    const {ip, serviceID, reload, template} = props;
    const classes = useStyles();

    return (
        <Card className={classes.rootTable}>
            <CardContent>
                <h3>IP</h3>
                <TableContainer component={Paper}>
                    <AddAssignIPDialog key={"add_assign_ip_dialog"} serviceID={serviceID} reload={reload}
                                       template={template}/>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">IP</TableCell>
                                <TableCell align="right">Open</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ip.map((row) => (
                                    <ServiceIPRow key={row.ID} serviceID={serviceID} ip={row}
                                                  reload={reload} template={template}/>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}

export function ServiceIPRow(props: {
    serviceID: number,
    ip: IPData,
    reload: Dispatch<SetStateAction<boolean>>
    template: TemplateData
}): any {
    const {ip, serviceID, reload, template} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const [lockInfo, setLockInfo] = React.useState(true);
    const [ipCopy, setIPCopy] = useState(ip);
    const [deleteIP, setDeleteIP] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const clickLockInfo = () => {
        setLockInfo(!lockInfo);
    }
    const resetAction = () => {
        setIPCopy(ip);
        setLockInfo(true);
    }

    const updateInfo = () => {
        PutIP(ip).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            setLockInfo(true);
            reload(true);
        })
    }

    useEffect(() => {
        if (deleteIP) {
            DeleteIP(ip.ID).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                } else {
                    console.log(res.error);
                    enqueueSnackbar(String(res.error), {variant: "error"});
                }
                reload(true);
            })
            setDeleteIP(false);
        }
    }, [deleteIP]);

    return (
        <React.Fragment>
            <TableRow className={classes.rootTable}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {ip.ID}
                </TableCell>
                <TableCell align="left">{ip.name}</TableCell>
                <TableCell align="left">{ip.ip}</TableCell>
                <TableCell align="right">
                    <Enable open={ip.open}/>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formShort}
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    defaultValue={ip.name}
                                    InputProps={{
                                        readOnly: lockInfo,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setIPCopy({...ipCopy, name: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formShort}
                                    required
                                    id="outlined-required"
                                    label="IP"
                                    defaultValue={ip.ip}
                                    InputProps={{
                                        readOnly: lockInfo,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setIPCopy({...ipCopy, ip: event.target.value});
                                    }}
                                />
                            </form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <Button size="small" color="secondary" disabled={!lockInfo}
                                            onClick={clickLockInfo}>ロック解除</Button>
                                    <Button size="small" disabled={lockInfo} onClick={resetAction}>Reset</Button>
                                    <IPOpenButton ip={ipCopy} lockInfo={lockInfo} setLockInfo={setLockInfo}
                                                  reload={reload} template={template}/>
                                    <Button size="small" disabled={lockInfo} onClick={updateInfo}>更新</Button>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <DeleteAlertDialog key={"ip_delete_alert_dialog_" + ip.ID}
                                                       setDeleteProcess={setDeleteIP}/>
                                </Grid>
                            </Grid>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>直後</TableCell>
                                        <TableCell>半年後</TableCell>
                                        <TableCell>1年後</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <ServiceIPPlanBase serviceID={serviceID} plan={ip.plan} reload={reload}/>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function ServiceIPPlanBase(props: {
    serviceID: number,
    plan: PlanData[] | undefined,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {plan, serviceID, reload} = props;

    if (plan === undefined || plan === null) {
        return (
            <p><b>情報なし</b></p>
        )
    } else {
        return (
            plan.map((row) => (
                <ServiceIPPlanRow key={row.ID} serviceID={serviceID} plan={row} reload={reload}/>
            ))
        )
    }
}

export function ServiceIPPlanRow(props: {
    serviceID: number,
    plan: PlanData,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {plan, reload} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const [lockInfo, setLockInfo] = React.useState(true);
    const [ipPlanCopy, setIPPlanCopy] = useState(plan);
    const [deleteIPPlan, setDeleteIPPlan] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const clickLockInfo = () => {
        setLockInfo(!lockInfo);
    }
    const resetAction = () => {
        setIPPlanCopy(plan);
        setLockInfo(true);
    }

    // Update Plan Information
    const updateInfo = () => {
        PutPlan(ipPlanCopy).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            setLockInfo(true);
            reload(true);
        })
    }

    useEffect(() => {
        if (deleteIPPlan) {
            DeletePlan(plan.ID).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                    setLockInfo(true)
                } else {
                    console.log(res.error);
                    enqueueSnackbar(String(res.error), {variant: "error"});
                }
                reload(true);
            })
            setDeleteIPPlan(false);
        }
    }, [deleteIPPlan]);

    return (
        <React.Fragment>
            <TableRow className={classes.rootTable}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {plan.ID}
                </TableCell>
                <TableCell align="left">{plan.name}</TableCell>
                <TableCell align="right">{plan.after}</TableCell>
                <TableCell align="right">{plan.half_year}</TableCell>
                <TableCell align="right">{plan.one_year}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formShort}
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    defaultValue={plan.name}
                                    InputProps={{
                                        readOnly: lockInfo,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setIPPlanCopy({...ipPlanCopy, name: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryVeryShort}
                                    required
                                    id="outlined-required"
                                    label="直後"
                                    defaultValue={plan.after}
                                    InputProps={{
                                        readOnly: lockInfo,
                                    }}
                                    type="number"
                                    variant="outlined"
                                    onChange={event => {
                                        setIPPlanCopy({...ipPlanCopy, after: Number(event.target.value)});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryVeryShort}
                                    required
                                    id="outlined-required"
                                    label="半年後"
                                    defaultValue={plan.half_year}
                                    InputProps={{
                                        readOnly: lockInfo,
                                    }}
                                    type="number"
                                    variant="outlined"
                                    onChange={event => {
                                        setIPPlanCopy({...ipPlanCopy, half_year: Number(event.target.value)});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryVeryShort}
                                    required
                                    id="outlined-required"
                                    label="1年後"
                                    defaultValue={plan.one_year}
                                    InputProps={{
                                        readOnly: lockInfo,
                                    }}
                                    type="number"
                                    variant="outlined"
                                    onChange={event => {
                                        setIPPlanCopy({...ipPlanCopy, one_year: Number(event.target.value)});
                                    }}
                                />
                            </form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Button size="small" color="secondary" disabled={!lockInfo}
                                            onClick={clickLockInfo}>ロック解除</Button>
                                    <Button size="small" disabled={lockInfo} onClick={resetAction}>Reset</Button>
                                    <Button size="small" disabled={lockInfo} onClick={updateInfo}>Apply</Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DeleteAlertDialog key={"plan_delete_alert_dialog_" + plan.ID}
                                                       setDeleteProcess={setDeleteIPPlan}/>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
