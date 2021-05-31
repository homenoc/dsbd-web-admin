import React, {Dispatch, SetStateAction, useState} from "react";
import {
    Button, Card, CardContent, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField,
} from "@material-ui/core";
import {
    BGPRouterDetailData,
    ConnectionDetailData,
    TemplateData, TunnelEndPointRouterIPTemplateData
} from "../../../interface";
import classes from "./ConnectionDialog.module.scss";
import {useSnackbar} from "notistack";
import {Update} from "../../../api/Connection";
import useStyles from "./styles";
import {Open} from "../../../components/Dashboard/Open/Open";

export default function ConnectionGetDialogs(props: {
    connection: ConnectionDetailData,
    template: TemplateData,
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {connection, template, reload} = props
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" variant="outlined" onClick={handleClickOpen}>
                Detail
            </Button>
            <Dialog onClose={handleClose} fullScreen={true} aria-labelledby="customized-dialog-title" open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    Connection Detail
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <ConnectionStatus key={"connectionStatus"} connection={connection}/>
                        </Grid>
                        <Grid item xs={3}>
                            <ConnectionEtc key={"connectionETC"} connection={connection}/>
                        </Grid>
                        <Grid item xs={6}>
                            <ConnectionOpen key={"connection_open"} connection={connection}
                                            template={template} setReload={reload}/>
                        </Grid>
                        <Grid item xs={6}>
                            <ConnectionUserDisplay key={"connection_user_display"} connection={connection}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function ConnectionOpenButton(props: {
    connection: ConnectionDetailData,
    lock: boolean,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {connection, lock, reload} = props;
    const {enqueueSnackbar} = useSnackbar();

    // Update Service Information
    const updateInfo = (open: boolean) => {
        connection.open = open;
        connection.bgp_router = undefined;
        connection.tunnel_endpoint_router_ip = undefined;
        Update(connection).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            reload(true);
        })
    }

    if (!connection.open) {
        return (
            <Button size="small" color="primary" disabled={lock} onClick={() => updateInfo(true)}>
                開通
            </Button>
        )
    } else {
        return (
            <Button size="small" color="secondary" disabled={lock} onClick={() => updateInfo(false)}>
                未開通
            </Button>
        )
    }
}

export function ConnectionOpen(props: {
    connection: ConnectionDetailData,
    template: TemplateData,
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const {connection, template, setReload} = props
    const [connectionCopy, setConnectionCopy] = useState(connection);
    const [lock, setLock] = React.useState(true);
    const classes = useStyles();


    const clickLockInfo = () => {
        setLock(!lock);
    }
    const resetAction = () => {
        setConnectionCopy(connection);
        setLock(true);
    }

    return (
        <div>
            <Card className={classes.root}>
                <CardContent>
                    <br/>
                    <ConnectionOpenL3User key={"connection_open_l3_user"} connection={connectionCopy}
                                          setConnection={setConnectionCopy} lock={lock}/>
                    <ConnectionOpenVPN key={"Open_VPN"} connection={connectionCopy} setConnection={setConnectionCopy}
                                       lock={lock}/>
                    <FormControl variant="outlined" className={classes.formMedium}>
                        <InputLabel id="bgp_router_input">BGP Router</InputLabel>
                        <Select
                            labelId="bgp_router_hostname"
                            id="bgp_router_hostname"
                            label="BGP Router"
                            value={connectionCopy.bgp_router_id}
                            onChange={(event) =>
                                setConnectionCopy({...connectionCopy, bgp_router_id: Number(event.target.value)})
                            }
                            inputProps={{
                                readOnly: lock,
                            }}
                            type="number"
                        >
                            <MenuItem value={0}>なし(初期値)</MenuItem>
                            {
                                template.bgp_router?.map((row: BGPRouterDetailData) => (
                                        <MenuItem key={row.ID + row.hostname} value={row.ID}>{row.hostname}</MenuItem>
                                    )
                                )
                            }
                        </Select>
                    </FormControl>
                    <br/>
                    <FormControl variant="outlined" className={classes.formLong}>
                        <InputLabel id="tunnel_endpoint_router_ip_input">Tunnel EndPoint Router IP</InputLabel>
                        <Select
                            labelId="tunnel_endpoint_router_ip"
                            id="tunnel_endpoint_router_ip"
                            label="Tunnel EndPoint Router IP"
                            value={connectionCopy.tunnel_endpoint_router_ip_id}
                            onChange={(event) =>
                                setConnectionCopy({
                                    ...connectionCopy,
                                    tunnel_endpoint_router_ip_id: Number(event.target.value)
                                })
                            }
                            inputProps={{
                                readOnly: lock,
                            }}
                            type="number"
                        >
                            <MenuItem value={0}>なし(初期値)</MenuItem>
                            {
                                template.tunnel_endpoint_router_ip?.map(
                                    (row: TunnelEndPointRouterIPTemplateData) => (
                                        <MenuItem key={row.ID + row.ip} value={row.ID}>
                                            {row.tunnel_endpoint_router.hostname}<b>({row.ip})</b>
                                        </MenuItem>
                                    )
                                )
                            }
                        </Select>
                    </FormControl>
                    <br/>
                    <Button size="small" color="secondary" disabled={!lock} onClick={clickLockInfo}>ロック解除</Button>
                    <Button size="small" disabled={lock} onClick={resetAction}>Reset</Button>
                    <ConnectionOpenButton key={"connection_open_button"} connection={connectionCopy} lock={lock}
                                          reload={setReload}/>
                </CardContent>
            </Card>
        </div>
    )
}

export function ConnectionOpenVPN(props: {
    connection: ConnectionDetailData,
    setConnection: Dispatch<SetStateAction<ConnectionDetailData>>,
    lock: boolean,
}) {
    const {connection, setConnection, lock} = props
    const classes = useStyles();

    if (!connection.connection_template) {
        return null
    } else {
        return (
            <div>
                <TextField
                    className={classes.formLong}
                    required
                    id="outlined-required"
                    label="対向終端アドレス"
                    InputProps={{
                        readOnly: lock,
                    }}
                    value={connection.term_ip}
                    variant="outlined"
                    onChange={event => {
                        setConnection({...connection, term_ip: event.target.value});
                    }}
                />
                <br/>
            </div>
        )
    }
}

export function ConnectionOpenL3User(props: {
    connection: ConnectionDetailData,
    setConnection: Dispatch<SetStateAction<ConnectionDetailData>>,
    lock: boolean,
}) {
    const {connection, setConnection, lock} = props
    const classes = useStyles();

    if (connection.service === undefined || !connection.service.service_template.need_route) {
        return null
    } else {
        return (
            <div>
                <TextField
                    className={classes.formMedium}
                    required
                    id="outlined-required"
                    label="L3 IPv4(HomeNOC側)"
                    InputProps={{
                        readOnly: lock,
                    }}
                    value={connection.link_v4_our}
                    variant="outlined"
                    onChange={event => {
                        setConnection({...connection, link_v4_our: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formMedium}
                    required
                    id="outlined-required"
                    label="L3 IPv4(ユーザ側)"
                    InputProps={{
                        readOnly: lock,
                    }}
                    value={connection.link_v4_your}
                    variant="outlined"
                    onChange={event => {
                        setConnection({...connection, link_v4_your: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formMedium}
                    required
                    id="outlined-required"
                    label="L3 IPv6(HomeNOC側)"
                    InputProps={{
                        readOnly: lock,
                    }}
                    value={connection.link_v6_our}
                    variant="outlined"
                    onChange={event => {
                        setConnection({...connection, link_v6_our: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formMedium}
                    required
                    id="outlined-required"
                    label="L3 IPv6(ユーザ側)"
                    InputProps={{
                        readOnly: lock,
                    }}
                    value={connection.link_v6_your}
                    variant="outlined"
                    onChange={event => {
                        setConnection({...connection, link_v6_your: event.target.value});
                    }}
                />
            </div>
        )
    }
}

export function ConnectionStatus(props: { connection: ConnectionDetailData }): any {
    const classes = useStyles();
    const {connection} = props;
    const serviceCode = connection.service?.group_id + "-" + connection.service?.service_template.type +
        ('000' + connection.service?.service_number).slice(-3) + "-" +
        connection.connection_template.type + ('000' + connection.connection_number).slice(-3);
    const createDate = "作成日: " + connection.CreatedAt;
    const updateDate = "更新日: " + connection.UpdatedAt;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h3>ServiceCode</h3>
                        <Chip
                            className={classes.date}
                            size="small"
                            color="primary"
                            label={serviceCode}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Service Info</h3>
                        <Chip
                            size="small"
                            color="primary"
                            label={connection.connection_template.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Date</h3>
                        <Chip
                            className={classes.date}
                            size="small"
                            color="primary"
                            label={createDate}
                        />
                        <Chip
                            size="small"
                            color="primary"
                            label={updateDate}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export function ConnectionEtc(props: { connection: ConnectionDetailData }): any {
    const classes = useStyles();
    const {connection} = props;

    const getNOC = () => {
        if (connection.noc_id === 0 || connection.noc === undefined) {
            return "どこでもOK"
        } else {
            return connection.noc?.name
        }
    }

    const getNTT = () => {
        if (connection.ntt_template_id === 0 || connection.ntt_template === undefined) {
            return "入力なし"
        } else {
            return connection.ntt_template?.name
        }
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h3>開通情報</h3>
                        <Open open={connection.open}/>
                    </Grid>
                    <Grid item xs={12}>
                        <h3>インターネット接続性</h3>
                        {getNTT()}
                    </Grid>
                    <Grid item xs={12}>
                        <h3>希望NOC</h3>
                        <Chip
                            size="small"
                            color="primary"
                            label={getNOC()}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h3>監視要求</h3>
                        <ConnectionMonitorDisplay key={"ConnectionMonitor"} monitor={connection.monitor}/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export function ConnectionMonitorDisplay(props: { monitor: boolean }) {
    const {monitor} = props

    if (monitor) {
        return (
            <Chip
                size="small"
                color="primary"
                label="必要"
            />
        );
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="不必要"
            />
        );
    }
}

export function ConnectionUserDisplay(props: { connection: ConnectionDetailData }) {
    const {connection} = props

    const distinctionIPAssign = (our: boolean) => {
        if (our) {
            return (
                <td>当団体からアドレスを割当</td>
            );
        } else {
            return (
                <td>貴団体からアドレスを割当</td>
            );
        }
    };
    const getNOCName = () => {
        if (connection.bgp_router_id === 0 || connection.bgp_router === undefined) {
            return "希望NOCなし";
        } else {
            return connection.bgp_router?.noc.name;
        }
    };
    const getFee = (fee: number | null) => {
        if (fee === null || fee === 0) {
            return (
                <td>無料</td>
            );
        } else {
            return (
                <td>{fee}円</td>
            );
        }
    };

    return (
        <div className={classes.contract}>
            <Card className={classes.root}>
                <CardContent>
                    <h2>User側の表示</h2>

                    <table aria-colspan={2}>
                        <thead>
                        <tr>
                            <th colSpan={2}>内容</th>
                        </tr>
                        <tr>
                            <th>サービス種別</th>
                            <td>{connection.connection_template.name}</td>
                        </tr>
                        <tr>
                            <th>利用料金</th>
                            {
                                connection.service !== undefined && getFee(connection.service.fee)
                            }
                        </tr>
                        <tr>
                            <th>当団体からのIPアドレスの割当</th>
                            {
                                connection.service !== undefined &&
                                distinctionIPAssign(connection.service.service_template.need_jpnic)
                            }
                        </tr>
                        </thead>
                    </table>
                    <br/>
                    <table className={classes.contract}>
                        <thead>
                        <tr>
                            <th colSpan={3}>接続情報</th>
                        </tr>
                        <tr>
                            <th>接続方式</th>
                            <td colSpan={2}>{connection.connection_template.name}</td>
                        </tr>
                        <tr>
                            <th>接続NOC</th>
                            <td colSpan={2}>{getNOCName()}</td>
                        </tr>
                        <tr>
                            <th>トンネル終端アドレス（貴団体側）</th>
                            <td colSpan={2}>{connection.term_ip}</td>
                        </tr>
                        <tr>
                            <th>トンネル終端アドレス（当団体側）</th>
                            <td colSpan={2}>{connection.tunnel_endpoint_router_ip?.ip}</td>
                        </tr>
                        <tr>
                            <th colSpan={3}>当団体との間の境界アドレス</th>
                        </tr>
                        <tr>
                            <th/>
                            <th>IPv4アドレス</th>
                            <th>IPv6アドレス</th>
                        </tr>
                        <tr>
                            <th>当団体側</th>
                            <td>{connection.link_v4_our}</td>
                            <td>{connection.link_v6_our}</td>
                        </tr>
                        <tr>
                            <th>貴団体側</th>
                            <td>{connection.link_v4_your}</td>
                            <td>{connection.link_v6_your}</td>
                        </tr>
                        </thead>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}
