import {Button, TextField} from "@material-ui/core";
import React, {Dispatch, SetStateAction, useState} from "react";
import {JPNICData} from "../../../interface";
import useStyles from "../../../pages/Service/ServiceDetail/styles";
import {useSnackbar} from "notistack";
import {PutJPNICAdmin, PutJPNICTech} from "../../../api/Service";


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
            PutJPNICAdmin(serviceID, jpnicCopy).then(res => {
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
        } else {
            PutJPNICTech(serviceID, jpnicCopy).then(res => {
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
        }

    }

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
            <Button size="small" color="secondary" disabled={!lockInfo}
                    onClick={clickLockInfo}>ロック解除</Button>
            <Button size="small" disabled={lockInfo} onClick={resetAction}>Reset</Button>
            <Button size="small" color={"primary"} disabled={lockInfo} onClick={updateInfo}>Apply</Button>
        </div>
    );
}

