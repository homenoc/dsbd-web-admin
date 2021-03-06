import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@material-ui/core";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {DefaultServiceJPNICData, JPNICData} from "../../../interface";
import useStyles from "../../../pages/Service/ServiceDetail/styles";
import {useSnackbar} from "notistack";
import {DeleteJPNICTech, PostJPNICTech, PutJPNICAdmin, PutJPNICTech} from "../../../api/Service";
import {DeleteAlertDialog} from "../Alert/Alert";


export function JPNICDetail(props: {
    serviceID: number,
    jpnic: JPNICData,
    jpnicAdmin: boolean,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {jpnic, jpnicAdmin, serviceID, reload} = props;
    const classes = useStyles();
    const [lockInfo, setLockInfo] = React.useState(true);
    const [jpnicCopy, setJPNICCopy] = useState(jpnic);
    const [deleteJPNICTech, setDeleteJPNICTech] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const clickLockInfo = () => {
        setLockInfo(!lockInfo);
    }
    const resetAction = () => {
        setJPNICCopy(jpnic);
        setLockInfo(true);
    }

    // Update Service Information
    const updateInfo = () => {
        if (jpnicAdmin) {
            PutJPNICAdmin(jpnicCopy.ID, jpnicCopy).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                    setLockInfo(true)
                } else {
                    console.log(res.error);
                    enqueueSnackbar(String(res.error), {variant: "error"});
                }

                setLockInfo(true);
                reload(true);
            })
        } else {
            PutJPNICTech(jpnicCopy.ID, jpnicCopy).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                    setLockInfo(true)
                } else {
                    console.log(res.error);
                    enqueueSnackbar(String(res.error), {variant: "error"});
                }

                setLockInfo(true);
                reload(true);
            })
        }
    }

    useEffect(() => {
        if (deleteJPNICTech) {
            DeleteJPNICTech(jpnicCopy.ID).then(res => {
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
            setDeleteJPNICTech(false);
        }
    }, [deleteJPNICTech]);

    return (
        <div className={classes.root}>
            <form className={classes.rootForm} noValidate autoComplete="off">
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="JPNIC Handle"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.jpnic_handle}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, jpnic_handle: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="Org"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.org}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, org: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="Org(English)"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.org_en}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, org_en: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="名前"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.name}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, name: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="名前(English)"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.name_en}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, name_en: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="郵便番号"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.postcode}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, postcode: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formMedium}
                    required
                    id="outlined-required"
                    label="住所"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.address}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, address: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formMedium}
                    required
                    id="outlined-required"
                    label="住所(English)"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.address_en}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, address_en: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="Dept"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.dept}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, dept: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="Dept(English)"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.dept_en}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, dept_en: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="電話番号"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.tel}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, tel: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="Fax"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.fax}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, fax: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formShort}
                    required
                    id="outlined-required"
                    label="Mail"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.mail}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, mail: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="outlined-required"
                    label="住居国"
                    InputProps={{
                        readOnly: lockInfo,
                    }}
                    value={jpnicCopy.country}
                    variant="outlined"
                    onChange={event => {
                        setJPNICCopy({...jpnicCopy, country: event.target.value});
                    }}
                />
            </form>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Button size="small" color="secondary" disabled={!lockInfo}
                            onClick={clickLockInfo}>ロック解除</Button>
                    <Button size="small" disabled={lockInfo} onClick={resetAction}>Reset</Button>
                    <Button size="small" color={"primary"} disabled={lockInfo} onClick={updateInfo}>Apply</Button>
                </Grid>
                {
                    !jpnicAdmin &&
                    <Grid item xs={12} sm={4}>
                        <DeleteAlertDialog key={"delete_alert_dialog_" + jpnicCopy.ID}
                                           setDeleteProcess={setDeleteJPNICTech}/>
                    </Grid>
                }
            </Grid>

        </div>
    );
}

export function JPNICTechAdd(props: {
    serviceID: number,
    jpnicAdmin: JPNICData | undefined,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {jpnicAdmin, serviceID, reload} = props;
    const classes = useStyles();
    const [jpnic, setJPNIC] = useState(DefaultServiceJPNICData);
    const [open, setOpen] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const sameJPNICAdminAction = () => {
        if (jpnicAdmin !== undefined) {
            setJPNIC(jpnicAdmin);
        }
    }

    // Update Service Information
    const addInfo = () => {
        PostJPNICTech(serviceID, jpnic).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            reload(true);
            setOpen(false);
        })
    }

    return (
        <div className={classes.root}>
            <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
                Add
            </Button>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    JPNIC管理連絡窓口の追加
                </DialogTitle>
                <DialogContent dividers>
                    <form className={classes.rootForm} noValidate autoComplete="off">
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="JPNIC Handle"
                            value={jpnic.jpnic_handle}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, jpnic_handle: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="Org"
                            value={jpnic.org}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, org: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="Org(English)"
                            value={jpnic.org_en}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, org_en: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="名前"
                            value={jpnic.name}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, name: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="名前(English)"
                            value={jpnic.name_en}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, name_en: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="郵便番号"
                            value={jpnic.postcode}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, postcode: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formMedium}
                            required
                            id="outlined-required"
                            label="住所"
                            value={jpnic.address}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, address: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formMedium}
                            required
                            id="outlined-required"
                            label="住所(English)"
                            value={jpnic.address_en}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, address_en: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            id="outlined-required"
                            label="Dept"
                            value={jpnic.dept}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, dept: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            id="outlined-required"
                            label="Dept(English)"
                            value={jpnic.dept_en}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, dept_en: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="電話番号"
                            value={jpnic.tel}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, tel: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            id="outlined-required"
                            label="Fax"
                            value={jpnic.fax}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, fax: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formShort}
                            required
                            id="outlined-required"
                            label="Mail"
                            value={jpnic.mail}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, mail: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="outlined-required"
                            label="住居国"
                            value={jpnic.country}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, country: event.target.value});
                            }}
                        />
                    </form>
                    <Button size="small" onClick={sameJPNICAdminAction}>JPNIC管理者連絡窓口のコピー</Button>
                    <Button size="small" color={"primary"} onClick={addInfo}>Apply</Button>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

