import React, {Dispatch, SetStateAction} from "react";
import {useSnackbar} from "notistack";
import {Delete, Put} from "../../../api/Connection";
import {
    Box,
    Button, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "@mui/material";
import {ConnectionDetailData, ServiceDetailData, TemplateData} from "../../../interface";
import ConnectionGetDialogs from "../../Connection/ConnectionDetail/ConnectionDialog";

export function RowConnectionCheck(props: {
    service: ServiceDetailData,
    groupID: number,
    template: TemplateData,
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {service, groupID, template, reload} = props;

    if (service.connections === undefined) {
        return (
            <div>
                <p>データがありません。</p>
            </div>
        )
    } else {
        return (
            <div>
                <Typography variant="h6" gutterBottom component="div">
                    Connection
                </Typography>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Service Code</TableCell>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="left">Tag</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            service.connections.map((rowConnection: ConnectionDetailData) => (
                                <RowConnection
                                    key={rowConnection.ID}
                                    template={template}
                                    service={service}
                                    connection={rowConnection}
                                    groupID={groupID}
                                    reload={reload}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        )
    }
}

function RowConnection(props: {
    service: ServiceDetailData,
    connection: ConnectionDetailData,
    groupID: number,
    template: TemplateData,
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {service, connection, groupID, template, reload} = props;
    const serviceCode = groupID + "-" + service.service_template.type + ('000' + service.service_number).slice(-3) +
        "-" + connection.connection_template.type + ('000' + connection.connection_number).slice(-3);

    return (
        <TableRow key={connection.ID}>
            <TableCell component="th" scope="row" align="left">
                {connection.ID}
            </TableCell>
            <TableCell align="left">{serviceCode}</TableCell>
            <TableCell align="left">{connection.connection_template.name}</TableCell>
            <TableCell align="left">
                {
                    !connection.enable &&
                    <Chip
                        size="small"
                        color="secondary"
                        label="無効"
                    />
                }
                {
                    connection.enable && connection.open &&
                    <Chip
                        size="small"
                        color="primary"
                        label="開通"
                    />
                }
                {
                    connection.enable && !connection.open &&
                    <Chip
                        size="small"
                        color="secondary"
                        label="未開通"
                    />
                }
            </TableCell>
            <TableCell align="right">
                <Box display="flex" justifyContent="flex-end">
                    <ConnectionGetDialogs
                        key={"connection_get_dialog"}
                        connection={connection}
                        service={service}
                        template={template}
                        reload={reload}/>
                    &nbsp;
                    <DeleteDialog
                        key={"connection_delete_alert_dialog_" + connection.ID}
                        id={connection.ID}
                        reload={reload}/>
                    &nbsp;
                    <EnableDialog
                        key={"connection_enable_alert_dialog_" + connection.ID}
                        connection={connection}
                        reload={reload}/>
                </Box>
            </TableCell>
        </TableRow>
    );
}

export function DeleteDialog(props: {
    id: number
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {id, reload} = props
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const deleteConnection = () => {
        Delete(id).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
            setOpen(false);
            reload(true);
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" variant="outlined" color={"secondary"} onClick={handleClickOpen}>Delete</Button>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">削除</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        本当に削除しますか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={deleteConnection} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function EnableDialog(props: {
    connection: ConnectionDetailData
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {connection, reload} = props;
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const updateConnection = () => {
        let tmp = connection;
        tmp.enable = !connection.enable
        Put(connection.ID, tmp).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
            setOpen(false);
            reload(true);
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" variant="outlined" onClick={handleClickOpen}>
                {
                    connection.enable && "Disable"
                }
                {
                    !connection.enable && "Enable"
                }
            </Button>
            <Dialog
                open={open}
                // TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="connection-enable-dialog-title"
                aria-describedby="connection-enable-dialog-description"
            >
                <DialogTitle id="connection-enable-dialog-title">Enable</DialogTitle>
                <DialogContent>
                    <DialogContentText id="connection-enable-dialog-description">
                        {
                            connection.enable && "有効から無効に変更します。"
                        }
                        {
                            !connection.enable && "無効から有効に変更します。"
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={updateConnection} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
