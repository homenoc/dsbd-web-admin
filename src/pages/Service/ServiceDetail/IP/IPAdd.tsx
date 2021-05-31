import {
    DefaultAddIP,
    DefaultServiceAddIPv4PlanData,
    ServiceAddIPData,
    ServiceAddIPv4PlanData, TemplateData
} from "../../../../interface";
import React, {Dispatch, SetStateAction} from "react";
import useStyles from "../../../Group/GroupDetail/styles";
import {useSnackbar} from "notistack";
import {
    Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel,
    FormLabel, Grid, MenuItem,
    Paper, Select,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import {PostIP} from "../../../../api/Service";

export function AddAssignIPDialog(props: {
    serviceID: number
    reload: Dispatch<SetStateAction<boolean>>
    template: TemplateData
}) {
    const {serviceID, reload, template} = props;
    const [checkBoxIPv4, setCheckBoxIPv4] = React.useState(false);
    const [data, setData] = React.useState(DefaultAddIP);
    const [ipv4PlanSubnetCount, setIPv4PlanSubnetCount] = React.useState(0);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleIPv4CheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxIPv4(event.target.checked);
        if (!event.target.checked) {
            setIPv4PlanSubnetCount(0);
            setData({end_date: undefined, ip: "", name: "", plan: [], start_date: "", version: 4})
        } else {
            setData({end_date: undefined, ip: "", name: "", plan: [], start_date: "", version: 6})
        }
    }

    const getSubnetID = (type: number) => {
        if (data.ip === undefined || data.ip.length === 0) {
            return "None";
        } else {
            //Todo データ不正検知
            if (type === 4) {
                const dataCheck = template.ipv4?.filter(item => item.subnet === data.ip);
                if (dataCheck === undefined || dataCheck.length !== 1) {
                    console.log("Warning: Illegal data\n")
                }
            } else if (type === 6) {
                const dataCheck = template.ipv6?.filter(item => item.subnet === data.ip);
                if (dataCheck === undefined || dataCheck.length !== 1) {
                    console.log("Warning: Illegal data\n")
                }
            }

            return data.ip
        }
    }

    const request = () => {
        PostIP(serviceID, data).then(res => {
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
        <div>
            <Button size="small" variant="outlined" color={"primary"} onClick={handleClickOpen}>追加</Button>
            <br/>
            <Dialog
                open={open}
                keepMounted
                maxWidth={"xl"}
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="customized-dialog-title">
                    Connection Detail
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <div>
                                <FormLabel component="legend">IPアドレスの追加</FormLabel>
                                <br/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checkBoxIPv4}
                                            onChange={handleIPv4CheckBoxChange}
                                            name="ipv4_assign"
                                            color="primary"
                                        />
                                    }
                                    label="IPv4アドレス"
                                />
                                {
                                    checkBoxIPv4 && (
                                        <div>
                                            <br/>
                                            <form className={classes.rootForm} noValidate autoComplete="off">
                                                <TextField
                                                    className={classes.formMedium}
                                                    required
                                                    id="ipv4_network_name"
                                                    label="Network名"
                                                    value={data.name}
                                                    variant="outlined"
                                                    inputProps={{
                                                        maxLength: 12,
                                                    }}
                                                    onChange={(event) =>
                                                        setData({...data, name: event.target.value})}
                                                />
                                            </form>
                                            <FormControl component="fieldset">
                                                <Select aria-label="gender" id="ipv4_subnet" value={getSubnetID(4)}
                                                        onChange={(event) => {
                                                            const dataCheck = template.ipv4?.find(item => item.subnet === String(event.target.value));
                                                            if (dataCheck !== undefined) {
                                                                setIPv4PlanSubnetCount(dataCheck.quantity);
                                                            }
                                                            setData({...data, ip: String(event.target.value)})
                                                        }}
                                                >
                                                    <MenuItem value={"None"} disabled={true}>なし</MenuItem>
                                                    {
                                                        template.ipv4?.map((map, index) => (
                                                            !map.hide &&
                                                            <MenuItem key={index}
                                                                      value={map.subnet}>{(map.subnet)}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )}
                                <br/>
                                {
                                    !checkBoxIPv4 && (
                                        <div>
                                            <br/>
                                            <form className={classes.rootForm} noValidate autoComplete="off">
                                                <TextField
                                                    className={classes.formMedium}
                                                    required
                                                    id="ipv6_network_name"
                                                    value={data.name}
                                                    label="Network名"
                                                    variant="outlined"
                                                    inputProps={{
                                                        maxLength: 24,
                                                    }}
                                                    onChange={(event) =>
                                                        setData({...data, name: event.target.value})}
                                                />
                                            </form>
                                            <FormControl component="fieldset">
                                                <Select aria-label="gender" id="ipv6_subnet" value={getSubnetID(6)}
                                                        onChange={(event) =>
                                                            setData({...data, ip: String(event.target.value)})}
                                                >
                                                    <MenuItem value={"None"} disabled={true}>なし</MenuItem>
                                                    {
                                                        template.ipv6?.map((map, index) => (
                                                            !map.hide &&
                                                            <MenuItem key={index}
                                                                      value={map.subnet}>{(map.subnet)}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )}
                                <br/>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <AddJPNICIPv4Plan data={data} setData={setData} subnetCount={ipv4PlanSubnetCount}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export function AddJPNICIPv4Plan(props: {
    data: ServiceAddIPData
    setData: Dispatch<SetStateAction<ServiceAddIPData>>
    subnetCount: number
}) {
    const {data, setData, subnetCount} = props;
    const [inputPlan, setInputPlan] = React.useState(DefaultServiceAddIPv4PlanData);
    const [planSum, setPlanSum] = React.useState(DefaultServiceAddIPv4PlanData);
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();


    const add = () => {
        let tmpPlan: ServiceAddIPv4PlanData[] | undefined;

        if (inputPlan.name === "") {
            enqueueSnackbar('Planの名前が入力されていません', {variant: "error"});
        }
        if (inputPlan.after < 1) {
            enqueueSnackbar('直後のアドレス数が不正です。', {variant: "error"});
        }
        if (inputPlan.half_year < 1) {
            enqueueSnackbar('半年後のアドレス数が不正です。', {variant: "error"});
        }
        if (inputPlan.one_year < 1) {
            enqueueSnackbar('１年後の名前が入力されていません', {variant: "error"});
        }

        if (data.plan === undefined || data.plan?.length === 0) {
            tmpPlan = [inputPlan];
        } else {
            tmpPlan = data.plan;
            if (tmpPlan !== undefined)
                tmpPlan.push(inputPlan);
        }
        setData({...data, plan: tmpPlan});
        setPlanSum({
            name: "",
            after: planSum.after + inputPlan.after,
            half_year: planSum.half_year + inputPlan.half_year,
            one_year: planSum.one_year + inputPlan.one_year
        })
    }

    const deletePlan = (index: number) => {
        let tmpPlan: ServiceAddIPv4PlanData[] | undefined;

        if (!(data.plan === undefined || data.plan?.length === 0)) {
            tmpPlan = data.plan;
            if (tmpPlan !== undefined) {
                setPlanSum({
                    name: "",
                    after: planSum.after - tmpPlan[index].after,
                    half_year: planSum.half_year - tmpPlan[index].half_year,
                    one_year: planSum.one_year - tmpPlan[index].one_year
                })
                tmpPlan?.splice(index, 1)
                setData({...data, plan: tmpPlan});
            }
        }
    }

    return (
        <div>
            {
                subnetCount !== 0 &&
                <div>
                    <FormLabel component="legend">1.1.2. IPv4のネットワークプランをお知らせください</FormLabel>
                    <br/>
                    <div> IPv4アドレスの割り当てには、JPNICの定めるIPアドレスの利用率を満たして頂く必要がございます。</div>
                    <div>最低でも割り当てから3カ月以内に25%、6カ月以内に25%、1年以内に50％をご利用いただく必要があります。</div>
                    <div>以下のフォームにIPアドレスの利用計画をご記入ください。</div>
                    <br/>
                    <form className={classes.rootForm} noValidate autoComplete="off">
                        <TextField
                            className={classes.formMedium}
                            required
                            id="outlined-required"
                            label="Name"
                            value={inputPlan.name}
                            variant="outlined"
                            onChange={event => {
                                setInputPlan({...inputPlan, name: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryTooShort}
                            required
                            id="outlined-required"
                            label="直後"
                            value={inputPlan.after}
                            type="number"
                            variant="outlined"
                            onChange={event => {
                                setInputPlan({...inputPlan, after: parseInt(event.target.value)});
                            }}
                        />
                        <TextField
                            className={classes.formVeryTooShort}
                            required
                            id="outlined-required"
                            label="半年後"
                            value={inputPlan.half_year}
                            type="number"
                            variant="outlined"
                            onChange={event => {
                                setInputPlan({...inputPlan, half_year: parseInt(event.target.value)});
                            }}
                        />
                        <TextField
                            className={classes.formVeryTooShort}
                            required
                            id="outlined-required"
                            label="1年後"
                            value={inputPlan.one_year}
                            type="number"
                            variant="outlined"
                            onChange={event => {
                                setInputPlan({...inputPlan, one_year: parseInt(event.target.value)});
                            }}
                        />
                        <br/>
                        <Button size="small" variant="contained" color="primary" onClick={add}>追加</Button>
                    </form>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">直後</TableCell>
                                    <TableCell align="right">半年後</TableCell>
                                    <TableCell align="right">１年後</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.plan?.map((row, index) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.after}</TableCell>
                                        <TableCell align="right">{row.half_year}</TableCell>
                                        <TableCell align="right">{row.one_year}</TableCell>
                                        <TableCell>
                                            <Button size="small" color="secondary"
                                                    onClick={() => deletePlan(index)}>削除</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow key={"sum"}>
                                    <TableCell component="th" scope="row"><b>合計</b></TableCell>
                                    <TableCell align="right"><b>{planSum.after}</b></TableCell>
                                    <TableCell align="right"><b>{planSum.half_year}</b></TableCell>
                                    <TableCell align="right"><b>{planSum.one_year}</b></TableCell>
                                </TableRow>
                                <TableRow key={"min_and_max"}>
                                    <TableCell component="th" scope="row"><b>(必要最低IP数/最大IP数)</b></TableCell>
                                    <TableCell align="right"><b>{subnetCount / 4}/{subnetCount}</b></TableCell>
                                    <TableCell align="right"><b>{subnetCount / 4}/{subnetCount}</b></TableCell>
                                    <TableCell align="right"><b>{subnetCount / 2}/{subnetCount}</b></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            }
        </div>
    )
}