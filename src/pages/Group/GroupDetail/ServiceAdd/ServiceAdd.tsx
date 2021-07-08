import React, {Dispatch, SetStateAction, useEffect} from "react";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography,
} from "@material-ui/core";
import {
    DefaultServiceAddData, DefaultServiceAddIPv4PlanData, DefaultServiceAddJPNICData, GroupDetailData,
    ServiceAddData,
    ServiceAddIPData, ServiceAddIPv4PlanData, ServiceAddJPNICData,
    TemplateData,
} from "../../../../interface";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import useStyles from "../styles";
import {check} from "./check";
import DateFnsUtils from "@date-io/date-fns";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Paper} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {Post} from "../../../../api/Service";

export default function ServiceAddDialogs(props: {
    template: TemplateData,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    baseData: GroupDetailData
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {template, baseData, open, setOpen, reload} = props
    const [data, setData] = React.useState(DefaultServiceAddData);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        const nowDate = new Date();
        let tmpEndDate = nowDate;
        setData({
            ...data, start_date: nowDate.getFullYear() + '-' + ('00' + (nowDate.getMonth() + 1)).slice(-2) +
                '-' + ('00' + (nowDate.getDate())).slice(-2)
        });
        tmpEndDate.setDate(tmpEndDate.getDate() + 30);
        setData({
            ...data, end_date: tmpEndDate.getFullYear() + '-' + ('00' + (tmpEndDate.getMonth() + 1)).slice(-2) +
                '-' + ('00' + (tmpEndDate.getDate())).slice(-2)
        });
    }, []);

    const request = () => {
        console.log(data);
        const err = check(data, template);
        if (err === "") {
            console.log("OK")
            Post(baseData.ID, data).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                    setOpen(false);
                    reload(true);
                } else {
                    console.log(res.error);
                    enqueueSnackbar(String(res.error), {variant: "error"});
                }
            })
            enqueueSnackbar('OK', {variant: "success"});
        } else {
            console.log("NG: " + err)
            enqueueSnackbar(err, {variant: "error"});
        }
        reload(true);
    }

    return (
        <div>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    サービス情報の追加
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">1. ご希望のサービスをお選びください</FormLabel>
                                <RadioGroup aria-label="gender" name="gender1" value={data.service_template_id}
                                            onChange={(event) => {
                                                setData({
                                                    ...DefaultServiceAddData,
                                                    service_template_id: parseInt(event.target.value)
                                                })
                                            }}>
                                    {
                                        template.services?.map(map => (
                                                !map.hidden &&
                                                <FormControlLabel key={map.ID} value={map.ID} control={<Radio/>}
                                                                  label={(map.name) + ": (" + (map.comment) + ")"}/>
                                            )
                                        )
                                    }
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <ServiceAddType key={"service_add_type_1"} data={data} setData={setData}
                                            template={template}/>
                        </Grid>
                        <Grid item xs={6}>
                            <ServiceAddDate key={"service_add_date"} data={data} setData={setData}/>
                        </Grid>
                        <Grid item xs={6}>
                            <ServiceAddBandwidthDialogs key={"service_add_bandwidth"} data={data}
                                                        setData={setData}/>
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
    );
}

export function ServiceAddType(props: {
    data: ServiceAddData
    template: TemplateData,
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData, template} = props;

    const dataExtra = template.services?.filter(item => item.ID === data.service_template_id);

    if (!(dataExtra === undefined || dataExtra.length !== 1) && dataExtra[0].need_jpnic) {
        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ServiceAddAssignIP key={"service_add_assign_ip_1"} data={data} setData={setData}
                                            template={template}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ServiceAddJPNICInfo key={"service_add_jpnic_info"} data={data} setData={setData}/>
                    </Grid>
                    <Grid item xs={6}>
                        <ServiceAddJPNICAdmin key={"service_add_jpnic_admin"} data={data} setData={setData}/>
                    </Grid>
                    <Grid item xs={6}>
                        <ServiceAddJPNICTech key={"service_add_jpnic_tech"} data={data} setData={setData}/>
                    </Grid>
                </Grid>
            </div>
        )
    } else if (!(dataExtra === undefined || dataExtra.length !== 1) && dataExtra[0].need_global_as) {
        return (
            <div>
                <ServiceIPForGlobalAS key={"service_add_assign_ip_2"} data={data} setData={setData}/>
            </div>
        )
    } else {
        return (
            <div/>
        )
    }
}

export function ServiceAddAssignIP(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
    template: TemplateData
}) {
    const {data, setData, template} = props;
    const [checkBoxIPv4, setCheckBoxIPv4] = React.useState(false);
    const [checkBoxIPv6, setCheckBoxIPv6] = React.useState(false);
    const [ipv4PlanSubnetCount, setIPv4PlanSubnetCount] = React.useState(0);
    const classes = useStyles();

    const handleIPv4CheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxIPv4(event.target.checked);
        if (!event.target.checked) {
            setIPv4PlanSubnetCount(0);
            const dataExtra = data.ip?.filter(item => item.version !== 4);
            setData({...data, ip: dataExtra});
        }
    }
    const handleIPv6CheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxIPv6(event.target.checked);
        if (!event.target.checked) {
            const dataExtra = data.ip?.filter(item => item.version !== 6);
            setData({...data, ip: dataExtra});
        }
    }
    const handleSubnetChange = (subnet: string, type: number) => {
        let tmpIP: ServiceAddIPData[];
        if (data.ip === undefined || data.ip.length === 0) {
            tmpIP = [
                {
                    version: type,
                    ip: subnet,
                    plan: undefined,
                    name: "",
                    start_date: "",
                    end_date: "",
                }
            ]
        } else {
            tmpIP = data.ip;

            const dataExtra = data.ip?.filter(item => item.version === type);
            if (dataExtra === undefined || dataExtra.length === 0) {
                tmpIP.push({
                    version: type,
                    ip: subnet,
                    name: "",
                    start_date: "",
                    end_date: "",
                })
            } else if (dataExtra.length === 1) {
                const dataIndex = data.ip?.findIndex(item => item.version === type);
                if (dataIndex !== undefined)
                    tmpIP[dataIndex].ip = subnet;
            }
        }

        if (type === 4) {
            const dataCheck = template.ipv4?.find(item => item.subnet === subnet);
            if (dataCheck !== undefined) {
                setIPv4PlanSubnetCount(dataCheck.quantity);
            }
        }

        setData({...data, ip: tmpIP});
    }

    const handleNetworkNameChange = (name: string, type: number) => {
        let tmpIP: ServiceAddIPData[];
        if (data.ip === undefined || data.ip.length === 0) {
            tmpIP = [
                {
                    version: type,
                    ip: "",
                    plan: undefined,
                    name: name,
                    start_date: "",
                    end_date: "",
                }
            ]
        } else {
            tmpIP = data.ip;

            const dataExtra = data.ip?.filter(item => item.version === type);
            if (dataExtra === undefined || dataExtra.length === 0) {
                tmpIP.push({
                    version: type,
                    ip: "",
                    name: name,
                    start_date: "",
                    end_date: "",
                })
            } else if (dataExtra.length === 1) {
                const dataIndex = data.ip?.findIndex(item => item.version === type);
                if (dataIndex !== undefined)
                    tmpIP[dataIndex].name = name;
            }
        }

        setData({...data, ip: tmpIP});
    }

    const getSubnetID = (type: number) => {
        if (data.ip === undefined || data.ip.length === 0) {
            return "None";
        } else {
            const dataExtra = data.ip?.filter(item => item.version === type);
            if (dataExtra === undefined || dataExtra.length === 0) {
                return "None";
            } else if (dataExtra.length === 1) {
                //Todo データ不正検知
                if (type === 4) {
                    const dataCheck = template.ipv4?.filter(item => item.subnet === dataExtra[0].ip);
                    if (dataCheck === undefined || dataCheck.length !== 1) {
                        console.log("Warning: Illegal data\n")
                    }
                } else if (type === 6) {
                    const dataCheck = template.ipv6?.filter(item => item.subnet === dataExtra[0].ip);
                    if (dataCheck === undefined || dataCheck.length !== 1) {
                        console.log("Warning: Illegal data\n")
                    }
                }

                return dataExtra[0].ip
            } else {
                //Todo dataExtraのLengthが２個以上である場合
            }
        }
    }
    const getSubnetName = (type: number) => {
        if (data.ip === undefined || data.ip.length !== 1) {
            return "";
        } else {
            if (type === 4) {
                const tmpIP = data.ip[0].ip
                const dataExtra = template.ipv4?.filter(item => item.subnet === tmpIP);

                if (dataExtra === undefined || dataExtra.length !== 1) {
                    return "";
                } else {
                    return dataExtra[0].name;
                }
            } else if (type === 6) {
                const tmpIP = data.ip[0].ip
                const dataExtra = template.ipv6?.filter(item => item.subnet === tmpIP);

                if (dataExtra === undefined || dataExtra.length !== 1) {
                    return "";
                } else {
                    return dataExtra[0].name;
                }
            }
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <div>
                    <FormLabel component="legend">1.1.1. 割り当てを希望するIPアドレスをお知らせください</FormLabel>
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
                        label="IPv4アドレスのアサインを希望する"
                    />
                    {
                        checkBoxIPv4 && (
                            <div>
                                <FormControl component="fieldset">
                                    <Select aria-label="gender" id="ipv4_subnet" value={getSubnetID(4)}
                                            onChange={(event) =>
                                                handleSubnetChange(String(event.target.value), 4)}
                                    >
                                        <MenuItem value={"None"} disabled={true}>なし</MenuItem>
                                        {
                                            template.ipv4?.map((map, index) => (
                                                !map.hide &&
                                                <MenuItem key={index} value={map.subnet}>{(map.subnet)}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <br/>
                                <form className={classes.rootForm} noValidate autoComplete="off">
                                    <TextField
                                        className={classes.formMedium}
                                        required
                                        id="ipv4_network_name"
                                        label="Network名"
                                        value={getSubnetName(4)}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 12,
                                        }}
                                        onChange={(event) =>
                                            handleNetworkNameChange(event.target.value, 4)}
                                    />
                                </form>
                            </div>
                        )
                    }
                    <br/>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkBoxIPv6}
                                onChange={handleIPv6CheckBoxChange}
                                name="ipv6_assign"
                                color="primary"
                            />
                        }
                        label="IPv6アドレスのアサインを希望する"
                    />
                    {
                        checkBoxIPv6 && (
                            <div>
                                <br/>
                                <form className={classes.rootForm} noValidate autoComplete="off">
                                    <TextField
                                        className={classes.formMedium}
                                        required
                                        id="ipv6_network_name"
                                        value={getSubnetName(6)}
                                        label="Network名"
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 24,
                                        }}
                                        onChange={(event) =>
                                            handleNetworkNameChange(event.target.value, 6)}
                                    />
                                </form>
                                <FormControl component="fieldset">
                                    <Select aria-label="gender" id="ipv6_subnet" value={getSubnetID(6)}
                                            onChange={(event) =>
                                                handleSubnetChange(String(event.target.value), 6)}
                                    >
                                        <MenuItem value={"None"} disabled={true}>なし</MenuItem>
                                        {
                                            template.ipv6?.map((map, index) => (
                                                !map.hide &&
                                                <MenuItem key={index} value={map.subnet}>{(map.subnet)}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        )
                    }
                    <br/>
                </div>
            </Grid>
            <Grid item xs={6}>
                <ServiceAddJPNICIPv4Plan data={data} setData={setData} subnetCount={ipv4PlanSubnetCount}/>
            </Grid>
        </Grid>
    )
}

export function ServiceIPForGlobalAS(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props;
    const [checkBoxIPv4, setCheckBoxIPv4] = React.useState(false);
    const [checkBoxIPv6, setCheckBoxIPv6] = React.useState(false);
    const [ipv4, setIPv4] = React.useState("");
    const [ipv6, setIPv6] = React.useState("");
    const classes = useStyles();

    const handleIPv4CheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxIPv4(event.target.checked);
        if (!event.target.checked) {
            const dataExtra = data.ip?.filter(item => item.version !== 4);
            setData({...data, ip: dataExtra});
        }
    }
    const handleIPv6CheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxIPv6(event.target.checked);
        if (!event.target.checked) {
            const dataExtra = data.ip?.filter(item => item.version !== 6);
            setData({...data, ip: dataExtra});
        }
    }
    const handleIPChange = (ip: string, type: number) => {
        let ipData: ServiceAddIPData[];
        const input = {
            version: type,
            ip: ip,
            name: "",
            start_date: "",
            end_date: "",
        }

        if (data.ip === undefined || data.ip.length === 0) {
            ipData = [input]
        } else {
            ipData = data.ip
            ipData.push(input)
        }

        if (type === 4) {
            setIPv4(ip);
        } else if (type === 6) {
            setIPv6(ip);
        }

        setData({...data, ip: ipData})
    }
    const deleteIP = (index: number) => {
        let tmpIP: ServiceAddIPData[];

        if (!(data.ip === undefined || data.ip.length === 0)) {
            tmpIP = data.ip;

            tmpIP?.splice(index, 1)
            setData({...data, ip: tmpIP});
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <div>
                    <FormLabel component="legend">1.1. 広報するIPアドレス</FormLabel>
                    <br/>
                    <div>特定のAS-Pathのみなど特殊な経路広報をご希望の場合、その他を選択してサポートまでお問合せください</div>
                </div>
            </Grid>
            <Grid item xs={6}>
                <div>
                    <form className={classes.rootForm} noValidate autoComplete="off">
                        <TextField
                            className={classes.formMedium}
                            required
                            id="asn"
                            label="ASN"
                            value={data.asn}
                            variant="outlined"
                            type="number"
                            onChange={(event) =>
                                setData({...data, asn: Number(event.target.value)})}
                        />
                    </form>
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
                    <br/>
                    {checkBoxIPv4 && (
                        <div>
                            <br/>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="ipv4_network_name"
                                    label="IPv4"
                                    value={ipv4}
                                    variant="outlined"
                                    onChange={(event) => setIPv4(event.target.value)}
                                />
                            </form>
                            <Button autoFocus variant="contained" onClick={() => handleIPChange(ipv4, 4)}
                                    color="primary">追加</Button>
                        </div>
                    )}
                    <br/>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkBoxIPv6}
                                onChange={handleIPv6CheckBoxChange}
                                name="ipv6_assign"
                                color="primary"
                            />
                        }
                        label="IPv6アドレス"
                    />
                    {checkBoxIPv6 && (
                        <div>
                            <br/>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="ipv6_network_name"
                                    value={ipv6}
                                    label="IPv6"
                                    variant="outlined"
                                    onChange={(event) => setIPv6(event.target.value)}
                                />
                            </form>
                            <Button autoFocus variant="contained" onClick={() => handleIPChange(ipv6, 6)}
                                    color="primary">追加</Button>
                        </div>
                    )}
                </div>
            </Grid>
            <Grid item xs={6}>
                {
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>IP</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.ip?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {row.ip}
                                        </TableCell>
                                        <TableCell>IPv{row.version}</TableCell>
                                        <TableCell>
                                            <Button size="small" color="secondary"
                                                    onClick={() => deleteIP(index)}>削除</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Grid>
        </Grid>
    )
}

export function ServiceAddJPNICIPv4Plan(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
    subnetCount: number
}) {
    const {data, setData, subnetCount} = props;
    const [inputPlan, setInputPlan] = React.useState(DefaultServiceAddIPv4PlanData);
    const [planSum, setPlanSum] = React.useState(DefaultServiceAddIPv4PlanData);
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();


    const add = () => {
        let tmpIP: ServiceAddIPData[];
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

        if (!(data.ip === undefined || data.ip.length === 0)) {
            tmpIP = data.ip;

            const dataExtra = tmpIP.filter(item => item.version === 4);
            if (dataExtra !== undefined && dataExtra.length === 1) {
                const dataIndex = tmpIP.findIndex(item => item.version === 4);
                if (dataIndex !== -1) {
                    if (tmpIP[dataIndex].plan === undefined || tmpIP[dataIndex].plan?.length === 0) {
                        tmpPlan = [inputPlan];
                    } else {
                        tmpPlan = tmpIP[dataIndex].plan;
                        if (tmpPlan !== undefined)
                            tmpPlan.push(inputPlan);
                    }
                }
                tmpIP[dataIndex].plan = tmpPlan;
                setData({...data, ip: tmpIP});
                setPlanSum({
                    name: "",
                    after: planSum.after + inputPlan.after,
                    half_year: planSum.half_year + inputPlan.half_year,
                    one_year: planSum.one_year + inputPlan.one_year
                })
            }
        }
    }

    const deletePlan = (index: number) => {
        let tmpIP: ServiceAddIPData[];
        let tmpPlan: ServiceAddIPv4PlanData[] | undefined;

        if (!(data.ip === undefined || data.ip.length === 0)) {
            tmpIP = data.ip;

            const dataExtra = tmpIP.filter(item => item.version === 4);
            if (dataExtra !== undefined && dataExtra.length === 1) {
                const dataIndex = tmpIP.findIndex(item => item.version === 4);
                if (dataIndex !== -1 && !(tmpIP[dataIndex].plan === undefined || tmpIP[dataIndex].plan?.length === 0)) {
                    tmpPlan = data.ip[dataIndex].plan;
                    if (tmpPlan !== undefined) {
                        setPlanSum({
                            name: "",
                            after: planSum.after - tmpPlan[index].after,
                            half_year: planSum.half_year - tmpPlan[index].half_year,
                            one_year: planSum.one_year - tmpPlan[index].one_year
                        })
                        tmpPlan?.splice(index, 1)
                        tmpIP[dataIndex].plan = tmpPlan;
                        setData({...data, ip: tmpIP});
                    }
                }
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
                            id="name"
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
                            id="after"
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
                            id="half_year"
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
                            id="one_year"
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
                    {
                        data.ip?.map((ip, index) => (ip.version === 4 &&
                            <TableContainer component={Paper} key={index}>
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
                                        {ip.plan?.map((row, index) => (
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
                                            <TableCell
                                                align="right"><b>{subnetCount / 4}/{subnetCount}</b></TableCell>
                                            <TableCell
                                                align="right"><b>{subnetCount / 4}/{subnetCount}</b></TableCell>
                                            <TableCell
                                                align="right"><b>{subnetCount / 2}/{subnetCount}</b></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export function ServiceAddJPNICInfo(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <FormLabel component="legend">1.2.1. JPNICの登録情報</FormLabel>
            <br/>
            <div>JPNICに登録する情報を記入してください。</div>
            <br/>
            <form className={classes.rootForm} noValidate autoComplete="off">
                <TextField
                    className={classes.formShort}
                    required
                    id="org"
                    label="組織名"
                    value={data.org}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, org: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formShort}
                    required
                    id="org_en"
                    label="組織名(英語)"
                    value={data.org_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, org_en: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="postcode"
                    label="郵便番号"
                    value={data.postcode}
                    variant="outlined"
                    inputProps={{
                        maxLength: 8,
                    }}
                    onChange={event => {
                        setData({...data, postcode: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formLong}
                    required
                    id="address"
                    label="住所(日本語)"
                    value={data.address}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, address: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formLong}
                    required
                    id="address_en"
                    label="住所(英語)"
                    value={data.address_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, address_en: event.target.value});
                    }}
                />
            </form>
        </div>
    );
}

export function ServiceAddJPNICAdmin(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props;
    const [jpnic, setJPNIC] = React.useState(DefaultServiceAddJPNICData);
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <FormLabel component="legend">1.2.2. 管理者連絡窓口</FormLabel>
            <br/>
            <div>割り当てるIPアドレスの管理連絡窓口をご記入ください</div>
            <br/>
            <form className={classes.rootForm} noValidate autoComplete="off">
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="jpnic_admin_org"
                    label="組織名"
                    value={jpnic.org}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, org: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="jpnic_admin_org_en"
                    label="組織名(English)"
                    value={jpnic.org_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, org_en: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="jpnic_admin_name"
                    label="名前"
                    value={jpnic.name}
                    variant="outlined"
                    inputProps={{
                        maxLength: 256,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, name: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="jpnic_admin_name_en"
                    label="名前(English)"
                    value={jpnic.name_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 256,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, name_en: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="jpnic_admin_postcode"
                    label="郵便番号"
                    value={jpnic.postcode}
                    variant="outlined"
                    inputProps={{
                        maxLength: 8,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, postcode: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formLong}
                    required
                    id="jpnic_admin_address"
                    label="住所"
                    value={jpnic.address}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, address: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formLong}
                    required
                    id="jpnic_admin_address_en"
                    label="住所(English)"
                    value={jpnic.address_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, address_en: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    id="jpnic_admin_dept"
                    label="Dept"
                    value={jpnic.dept}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, dept: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    id="jpnic_admin_dept_en"
                    label="Dept(English)"
                    value={jpnic.dept_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }} onChange={event => {
                    setJPNIC({...jpnic, dept_en: event.target.value});
                    setData({...data, jpnic_admin: jpnic});
                }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="jpnic_admin_tel"
                    label="電話番号"
                    value={jpnic.tel}
                    variant="outlined"
                    inputProps={{
                        maxLength: 32,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, tel: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    id="jpnic_admin_fax"
                    label="Fax"
                    value={jpnic.fax}
                    variant="outlined"
                    inputProps={{
                        maxLength: 32,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, fax: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formShort}
                    required
                    id="jpnic_admin_mail"
                    label="Mail"
                    value={jpnic.mail}
                    variant="outlined"
                    inputProps={{
                        maxLength: 64,
                    }}
                    onChange={event => {
                        setJPNIC({...jpnic, mail: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="jpnic_admin_country"
                    label="住居国"
                    value={jpnic.country}
                    variant="outlined"
                    onChange={event => {
                        setJPNIC({...jpnic, country: event.target.value});
                        setData({...data, jpnic_admin: jpnic});
                    }}
                />
            </form>
        </div>
    );
}

export function ServiceAddJPNICTech(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props;
    const [jpnic, setJPNIC] = React.useState(DefaultServiceAddJPNICData);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeData = (index: number) => {
        const jpnicTech = data.jpnic_tech;

        if (data.jpnic_tech !== undefined && jpnicTech) {
            jpnicTech[index] = jpnic;
            setData({...data, jpnic_tech: jpnicTech})
        } else {
            enqueueSnackbar('データの変更できません。', {variant: "error"});
        }
    }

    const deleteData = (index: number) => {
        const jpnicTech = data.jpnic_tech;

        if (data.jpnic_tech !== undefined && jpnicTech) {
            jpnicTech?.splice(index, 1)
            setData({...data, jpnic_tech: jpnicTech})
        } else {
            enqueueSnackbar('データを削除できません。', {variant: "error"});
            return;
        }
    }

    const submit = (jpnicAdmin: boolean) => {
        let jpnicTmp: ServiceAddJPNICData[];

        if (data.jpnic_tech === undefined) {
            if (jpnicAdmin) {
                if (data.jpnic_admin) {
                    jpnicTmp = [data.jpnic_admin];
                } else {
                    enqueueSnackbar('管理者連絡窓口が入力されていません。', {variant: "error"});
                    return;
                }
            } else {
                jpnicTmp = [jpnic];
            }
        } else {
            jpnicTmp = data.jpnic_tech;
            jpnicTmp.push(jpnic);
        }

        console.log(jpnicTmp);
        setData({...data, jpnic_tech: jpnicTmp});
        console.log(data.jpnic_tech);
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <FormLabel component="legend">1.2.3. 技術連絡担当者</FormLabel>
            <br/>
            <div>割り当てるIPアドレスの技術連絡担当者をご記入ください</div>
            <br/>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                担当者の追加
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <form className={classes.rootForm} noValidate autoComplete="off">
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="jpnic_tech_org"
                            label="Org"
                            value={jpnic.org}
                            variant="outlined"
                            inputProps={{
                                maxLength: 128,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, org: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="jpnic_tech_org_en"
                            label="Org(English)"
                            value={jpnic.org_en}
                            variant="outlined"
                            inputProps={{
                                maxLength: 128,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, org_en: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="jpnic_tech_name"
                            label="名前"
                            value={jpnic.name}
                            variant="outlined"
                            inputProps={{
                                maxLength: 256,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, name: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="jpnic_tech_name_en"
                            label="名前(English)"
                            value={jpnic.name_en}
                            variant="outlined"
                            inputProps={{
                                maxLength: 256,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, name_en: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="jpnic_tech_postcode"
                            label="郵便番号"
                            value={jpnic.postcode}
                            variant="outlined"
                            inputProps={{
                                maxLength: 8,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, postcode: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formLong}
                            required
                            id="jpnic_tech_address"
                            label="住所"
                            value={jpnic.address}
                            variant="outlined"
                            inputProps={{
                                maxLength: 128,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, address: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formLong}
                            required
                            id="jpnic_tech_address_en"
                            label="住所(English)"
                            value={jpnic.address_en}
                            variant="outlined"
                            inputProps={{
                                maxLength: 128,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, address_en: event.target.value});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            id="jpnic_tech_dept"
                            label="Dept"
                            value={jpnic.dept}
                            variant="outlined"
                            inputProps={{
                                maxLength: 128,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, dept: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            id="jpnic_tech_dept_en"
                            label="Dept(English)"
                            value={jpnic.dept_en}
                            variant="outlined"
                            inputProps={{
                                maxLength: 128,
                            }} onChange={event => {
                            setJPNIC({...jpnic, dept_en: event.target.value});
                        }}
                        />
                        <br/>
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="jpnic_tech_tel"
                            label="電話番号"
                            value={jpnic.tel}
                            variant="outlined"
                            inputProps={{
                                maxLength: 32,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, tel: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            id="jpnic_tech_fax"
                            label="Fax"
                            value={jpnic.fax}
                            variant="outlined"
                            inputProps={{
                                maxLength: 32,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, fax: event.target.value});
                                setData({...data, jpnic_admin: jpnic});
                            }}
                        />
                        <br/>
                        <TextField
                            className={classes.formShort}
                            required
                            id="jpnic_tech_mail"
                            label="Mail"
                            value={jpnic.mail}
                            variant="outlined"
                            inputProps={{
                                maxLength: 64,
                            }}
                            onChange={event => {
                                setJPNIC({...jpnic, mail: event.target.value});
                            }}
                        />
                        <TextField
                            className={classes.formVeryShort}
                            required
                            id="jpnic_tech_country"
                            label="住居国"
                            value={jpnic.country}
                            variant="outlined"
                            onChange={event => {
                                setJPNIC({...jpnic, country: event.target.value});
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => submit(true)} color="primary"> 管理連絡窓口の情報をコピー </Button>
                    <Button onClick={handleClose} color="secondary"> Cancel </Button>
                    <Button onClick={() => submit(false)} color="primary"> Submit </Button>
                </DialogActions>
            </Dialog>
            <br/>
            <br/>
            {
                data.jpnic_tech?.map((row, index) => (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{row.name}({row.name_en})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <form className={classes.rootForm} noValidate autoComplete="off">
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_org"}
                                        label="組織名"
                                        value={row.org}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 128,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, org: event.target.value});
                                        }}
                                    />
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_org_en"}
                                        label="組織名(English)"
                                        value={row.org_en}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 128,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, org_en: event.target.value});
                                        }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_name"}
                                        label="名前"
                                        value={row.name}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 256,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, name: event.target.value});
                                        }}
                                    />
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_name_en"}
                                        label="名前(English)"
                                        value={row.name_en}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 256,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, name_en: event.target.value});
                                        }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_postcode"}
                                        label="郵便番号"
                                        value={row.postcode}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 8,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, postcode: event.target.value});
                                        }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.formLong}
                                        required
                                        id={"jpnic_tech_" + index + "_address"}
                                        label="住所"
                                        value={row.address}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 128,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, address: event.target.value});
                                        }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.formLong}
                                        required
                                        id={"jpnic_tech_" + index + "_address_en"}
                                        label="住所(English)"
                                        value={row.address_en}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 128,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, address_en: event.target.value});
                                        }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_dept"}
                                        label="Dept"
                                        value={row.dept}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 128,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, dept: event.target.value});
                                        }}
                                    />
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_dept_en"}
                                        label="Dept(English)"
                                        value={row.dept_en}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 128,
                                        }} onChange={event => {
                                        setJPNIC({...row, dept_en: event.target.value});
                                    }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_tel"}
                                        label="電話番号"
                                        value={row.tel}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 32,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, tel: event.target.value});
                                        }}
                                    />
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_fax"}
                                        label="Fax"
                                        value={row.fax}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 32,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, fax: event.target.value});
                                        }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.formShort}
                                        required
                                        id={"jpnic_tech_" + index + "_mail"}
                                        label="Mail"
                                        value={row.mail}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 64,
                                        }}
                                        onChange={event => {
                                            setJPNIC({...row, mail: event.target.value});
                                        }}
                                    />
                                    <TextField
                                        className={classes.formVeryShort}
                                        required
                                        id={"jpnic_tech_" + index + "_country"}
                                        label="住居国"
                                        value={row.country}
                                        variant="outlined"
                                        onChange={event => {
                                            setJPNIC({...row, country: event.target.value});
                                        }}
                                    />
                                </form>
                                <Button size="small" variant="contained" color="primary"
                                        className={classes.spaceRight}
                                        onClick={() => changeData(index)}>変更</Button>
                                <Button size="small" variant="contained" color="secondary"
                                        onClick={() => deleteData(index)}>削除</Button>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </div>
    )
}

export function ServiceAddDate(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props;
    const [checkBox, setCheckBox] = React.useState(false);
    const nowDate = new Date()
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(nowDate);

    const handleBeginDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date !== null) {
            setData({
                ...data, start_date: date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) +
                    '-' + ('00' + (date.getDate())).slice(-2)
            });
        }
    };

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBox(event.target.checked);
        if (event.target.checked) {
            setData({...data, end_date: undefined});
        }
    }

    return (
        <div>
            <FormLabel component="legend">2. 利用開始・終了日</FormLabel>
            <br/>
            <div>利用開始日に関しましては、ベストエフォートとなりますので、期待に応じられない可能性があります。</div>
            <br/>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    required
                    margin="normal"
                    id="begin-date-picker-dialog"
                    label="接続開始日"
                    format="yyyy/MM/dd"
                    value={selectedDate}
                    onChange={handleBeginDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>

            <br/>
            <br/>
            <b>接続終了日は未定の場合はここにチェックしてください。</b>
            <br/>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checkBox}
                        onChange={handleCheckBoxChange}
                        name="checkedB"
                        color="primary"
                    />
                }
                label="接続終了日が未定"
            />
            <br/>
            {
                !checkBox &&
                <ServiceAddBandwidthEndDateDialogs data={data} setData={setData}/>
            }
        </div>
    )
}

export function ServiceAddBandwidthEndDateDialogs(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props;
    const nowDate = new Date()
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(nowDate);

    useEffect(() => {
        console.log("end_date segment")
        let tmpEndDate = nowDate;
        tmpEndDate.setDate(tmpEndDate.getDate() + 30);
        setSelectedDate(tmpEndDate);
    }, []);

    const handleEndDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date !== null) {
            setData({
                ...data, end_date: date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) +
                    '-' + ('00' + (date.getDate())).slice(-2)
            });
        }
    };

    return (
        <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <br/>
                <div>一時的な検証やイベントネットワークでの利用など、利用終了日が決まっている場合はお知らせください</div>
                <br/>
                <KeyboardDatePicker
                    required
                    margin="normal"
                    id="end-date-picker-dialog"
                    label="接続終了日"
                    format="yyyy/MM/dd"
                    value={selectedDate}
                    onChange={handleEndDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        </div>
    )
}

export function ServiceAddBandwidthDialogs(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props
    const [checkBox, setCheckBox] = React.useState(data.max_bandwidth_as !== undefined);
    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBox(event.target.checked);
        if (event.target.checked) {
            setData({...data, max_bandwidth_as: ""});
        } else {
            setData({...data, max_bandwidth_as: undefined});
        }
    }

    return (
        <div>
            <FormLabel component="legend">3. ご利用帯域について教えてください。</FormLabel>
            <br/>
            <div>本接続で利用する帯域をお知らせください。また、特定のASに対する大量通信がある場合は詳細をお知らせください。</div>
            <div>利用帯域が分からない場合は申し込み時点での想定をご記入ください。</div>
            <div> 設備都合などによりご希望の帯域を提供できない場合がございます。</div>
            <br/>
            <form className={classes.rootForm} noValidate autoComplete="off">
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="avg_downstream"
                    label="平均上り利用帯域"
                    value={data.avg_downstream}
                    type="number"
                    variant="outlined"
                    onChange={event => {
                        setData({...data, avg_downstream: parseInt(event.target.value)});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="max_downstream"
                    label="最大上り利用帯域"
                    value={data.max_downstream}
                    type="number"
                    variant="outlined"
                    onChange={event => {
                        setData({...data, max_downstream: parseInt(event.target.value)});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="avg_upstream"
                    label="平均下り利用帯域"
                    value={data.avg_upstream}
                    type="number"
                    variant="outlined"
                    onChange={event => {
                        setData({...data, avg_upstream: parseInt(event.target.value)});
                    }}
                />
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="max_upstream"
                    label="最大下り利用帯域"
                    value={data.max_upstream}
                    type="number"
                    variant="outlined"
                    onChange={event => {
                        setData({...data, max_upstream: parseInt(event.target.value)});
                    }}
                />
                <br/>
                <h3>特定のASに対する大量の通信があるか教えてください</h3>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checkBox}
                            onChange={handleChange}
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="特定のASに対する大量の通信がある"
                />
                <div>
                    ※ 大量の通信とは平均20Mbps程度の通信が常時発生する状況を指します
                </div>
                <br/>
                <ServiceAddMaxASDialogs key={"service_add_max_as"} data={data} setData={setData}/>
            </form>
        </div>
    )
}

export function ServiceAddMaxASDialogs(props: {
    data: ServiceAddData
    setData: Dispatch<SetStateAction<ServiceAddData>>
}) {
    const {data, setData} = props;
    const classes = useStyles();

    if (data.max_bandwidth_as === undefined) {
        return (
            <div>

            </div>
        )
    } else {
        return (
            <div>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="max_bandwidth_asn"
                    label="ASN"
                    value={data.max_bandwidth_as}
                    variant="outlined"
                    onChange={event => {
                        setData({...data, max_bandwidth_as: event.target.value});
                    }}
                />
                <div>複数ある場合は、コンマ「,」で区切ってください。</div>
            </div>
        );
    }
}
