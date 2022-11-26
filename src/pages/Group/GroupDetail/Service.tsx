import {GroupDetailData, ServiceDetailData} from "../../../interface";
import {
    Accordion,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ServiceGetDialogs from "../../Service/ServiceDetail/ServiceDialog";
import {Delete, Put} from "../../../api/Service";
import {useSnackbar} from "notistack";
import {RowConnectionCheck} from "./Connection";
import {StyledAccordionDetails, StyledDiv1, StyledTableRowRoot, StyledTypographyHeading} from "../../../style";
import {GetServiceWithTemplate} from "../../../api/Tool";


export function ChipGet(props: {
    open: boolean,
    pass: boolean,
    enable: boolean
}) {
    const {pass, enable} = props;

    if (!enable) {
        return (
            <Chip
                size="small"
                color="secondary"
                label="無効"
            />
        )
    }
    if (!pass) {
        return (
            <Chip
                size="small"
                color="secondary"
                label="未審査"
            />
        )
    }
    return (
        <Chip
            size="small"
            color="primary"
            label="審査OK"
        />
    )


}

function RowService(props: {
    service: ServiceDetailData,
    autoMail: Dispatch<SetStateAction<string>>,
    groupID: number,
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {service, autoMail, groupID, reload} = props;
    const [open, setOpen] = React.useState(false);
    const serviceCode = groupID + "-" + service.service_type + ('000' + service.service_number).slice(-3);

    return (
        <React.Fragment>
            <StyledTableRowRoot>
                <TableCell align="left">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell align="left">
                    {service.ID}
                </TableCell>
                <TableCell align="left">{serviceCode}</TableCell>
                <TableCell align="left">{GetServiceWithTemplate(service.service_type)?.name}</TableCell>
                <TableCell align="left">
                    <ChipGet open={service.pass} pass={service.pass} enable={service.enable}/>
                    &nbsp;
                    {
                        service.enable && service.add_allow &&
                      <Chip
                        size="small"
                        color="primary"
                        label="接続申請追加許可中"
                      />
                    }
                </TableCell>
                <TableCell align="left">{service.asn}</TableCell>
                <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                        {
                            !service.pass &&
                          <ExaminationDialog
                            key={"service_examination_dialog_" + service.ID}
                            autoMail={autoMail}
                            id={service.ID}
                            service={service}
                            reload={reload}
                          />
                        }
                        &nbsp;
                        <ServiceGetDialogs
                            key={"service_get_dialog_" + service.ID}
                            service={service}
                            reload={reload}
                        />
                        &nbsp;
                        <DeleteDialog
                            key={"service_delete_alert_dialog_" + service.ID}
                            id={service.ID}
                            reload={reload}
                        />
                        &nbsp;
                        <EnableDialog
                            key={"service_enable_alert_dialog_" + service.ID}
                            service={service}
                            reload={reload}
                        />
                    </Box>
                </TableCell>
            </StyledTableRowRoot>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <RowConnectionCheck
                                key={service.ID + "Connection"}
                                service={service}
                                groupID={groupID}
                                reload={reload}
                            />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function ExaminationDialog(props: {
    id: number
    autoMail?: Dispatch<SetStateAction<string>>,
    service: ServiceDetailData
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {id, autoMail, service, reload} = props;
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const updateService = () => {
        service.pass = true;
        Put(id, service).then(res => {
            if (res.error === "") {
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
            if (autoMail !== undefined) {
                autoMail("pass_service");
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
            <Button size="small" variant="outlined" color={"primary"} onClick={handleClickOpen}>審査OK</Button>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-examination-title"
                aria-describedby="alert-dialog-examination-description"
            >
                <DialogTitle id="alert-dialog-examination-title">審査通過</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-examination-description">
                        審査を通過させますか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={updateService} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function DeleteDialog(props: {
    id: number
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {id, reload} = props
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const deleteService = () => {
        Delete(id).then(res => {
            if (res.error === "") {
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
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
                aria-labelledby="alert-delete-dialog-title"
                aria-describedby="alert-delete-dialog-description"
            >
                <DialogTitle id="alert-delete-dialog-title">削除</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-delete-dialog">
                        本当に削除しますか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={deleteService} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function EnableDialog(props: {
    service: ServiceDetailData
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {service, reload} = props;
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const updateService = () => {
        const tmp = service;
        tmp.enable = !service.enable
        Put(service.ID, tmp).then(res => {
            if (res.error === "") {
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
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
                    service.enable && "Disable"
                }
                {
                    !service.enable && "Enable"
                }
            </Button>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="enable dialog"
                aria-describedby="enable dialog"
            >
                <DialogTitle id="alert-dialog-enable-title">Enable</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-enable-text">
                        {
                            service.enable && "有効から無効に変更します。"
                        }
                        {
                            !service.enable && "無効から有効に変更します。"
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={updateService} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default function Service(props: {
    data: GroupDetailData,
    autoMail: Dispatch<SetStateAction<string>>,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, autoMail, reload} = props;

    if (data.services !== undefined) {
        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <StyledDiv1>
                        <StyledTypographyHeading>Service</StyledTypographyHeading>
                    </StyledDiv1>
                </AccordionSummary>
                <StyledAccordionDetails>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell/>
                                    <TableCell align="left">ID</TableCell>
                                    <TableCell align="left">Service Code</TableCell>
                                    <TableCell align="left">Type</TableCell>
                                    <TableCell align="left">Tag</TableCell>
                                    <TableCell align="left">ASN</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.services.map((row: ServiceDetailData) => (
                                        <RowService
                                            key={"service_row_" + row.ID}
                                            autoMail={autoMail}
                                            service={row}
                                            groupID={data.ID}
                                            reload={reload}/>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </StyledAccordionDetails>
            </Accordion>
        )
    }
}
