import useStyles from "./styles";
import {GroupDetailData, ServiceDetailData, TemplateData} from "../../../interface";
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip,
    Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, makeStyles,
    Paper, Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ServiceGetDialogs from "../../Service/ServiceDetail/ServiceDialog";
import {Delete, Put} from "../../../api/Service";
import {useSnackbar} from "notistack";
import {TransitionProps} from "@material-ui/core/transitions";
import {RowConnectionCheck} from "./Connection";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    flex: {
        // display: flex,
    }
});

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function ChipGet(props: { open: boolean, enable: boolean }) {
    const {open, enable} = props;

    if (!enable) {
        return (
            <Chip
                size="small"
                color="secondary"
                label="無効"
            />
        )
    } else {

        if (open) {
            return (
                <Chip
                    size="small"
                    color="primary"
                    label="開通"
                />
            )
        } else {
            return (
                <Chip
                    size="small"
                    color="secondary"
                    label="未開通"
                />
            )
        }
    }
}

function RowService(props: {
    service: ServiceDetailData,
    groupID: number,
    template: TemplateData,
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {service, groupID, template, reload} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const serviceCode = groupID + "-" + service.service_template.type + ('000' + service.service_number).slice(-3);

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="left">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell align="left">
                    {service.ID}
                </TableCell>
                <TableCell
                    align="left">{serviceCode}</TableCell>
                <TableCell align="left">{service.service_template.name}</TableCell>
                <TableCell align="left">
                    <ChipGet open={service.open} enable={service.enable}/>
                </TableCell>
                <TableCell align="left">{service.asn}</TableCell>
                <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                        <ServiceGetDialogs key={service.ID + "Dialog"} service={service} reload={reload}
                                           template={template}/>
                        &nbsp;
                        <DeleteDialog key={"service_delete_alert_dialog_" + service.ID} id={service.ID}
                                      reload={reload}/>
                        &nbsp;
                        <EnableDialog key={"service_enable_alert_dialog_" + service.ID} service={service}
                                      reload={reload}/>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <RowConnectionCheck key={service.ID + "Connection"} template={template} service={service}
                                                groupID={groupID} reload={reload}/>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function DeleteDialog(props: {
    id: number
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {id, reload} = props
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const deleteService = () => {
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
                TransitionComponent={Transition}
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
                    <Button onClick={deleteService} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function EnableDialog(props: {
    service: ServiceDetailData
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {service, reload} = props;
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const updateService = () => {
        let tmp = service;
        tmp.enable = !service.enable
        Put(service.ID, tmp).then(res => {
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
                    service.enable &&
                    <div>Disable</div>
                }
                {
                    !service.enable &&
                    <div>Enable</div>
                }
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Enable</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {
                            service.enable &&
                            <div>有効から無効に変更します。</div>
                        }
                        {
                            !service.enable &&
                            <div>無効から有効に変更します。</div>
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
    template: TemplateData,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, template, reload} = props;
    const classes = useStyles();

    if (data.services !== undefined) {
        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <div className={classes.column}>
                        <Typography className={classes.heading}>Service</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
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
                                        <RowService key={row.ID} template={template} service={row} groupID={data.ID}
                                                    reload={reload}/>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
        )
    }
};
