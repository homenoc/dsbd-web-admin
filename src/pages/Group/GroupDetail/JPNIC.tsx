import {
    DefaultJPNICRegistrationData, DefaultJPNICUserRegistrationData,
    GroupDetailData, PlanData,
    ServiceDetailData,
} from "../../../interface";
import React, {Dispatch, SetStateAction, useEffect} from "react";
import {useSnackbar} from "notistack";
import {Post} from "../../../api/JPNIC";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Grid, MenuItem,
    Select, TextField
} from "@material-ui/core";
import useStyles from "../../Service/ServiceDetail/styles";
import {restfulApiConfig} from "../../../api/Config";

export default function JPNICRegistrationDialog(props: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    baseData: GroupDetailData
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const {baseData, open, setOpen, setReload} = props
    const [data, setData] = React.useState(DefaultJPNICRegistrationData);
    const [tech1Data, setTech1Data] = React.useState(DefaultJPNICUserRegistrationData);
    const [tech2Data, setTech2Data] = React.useState(DefaultJPNICUserRegistrationData);
    const [serviceID, setServiceID] = React.useState(0);
    const {enqueueSnackbar} = useSnackbar();
    const classes = useStyles();

    const request = () => {
        // JPNICハンドル名が書かれている場合/グループ名が書かれている場合、通知アドレスを自動付加
        if (data.admin_user.jpnic_handle !== "" || data.admin_user.org_jp_1 !== "") {
            data.admin_user.notify_mail = String(restfulApiConfig.notifyEMail)
        }

        if (tech1Data.jpnic_handle !== "" || tech1Data.org_jp_1 !== "") {
            tech1Data.notify_mail = String(restfulApiConfig.notifyEMail)
        }

        if (tech2Data.jpnic_handle !== "" || tech2Data.org_jp_1 !== "") {
            tech2Data.notify_mail = String(restfulApiConfig.notifyEMail)
        }

        data.tech_users[0] = tech1Data
        data.tech_users[1] = tech2Data

        console.log(data);

        Post(data).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
                setOpen(false);
                setReload(true);
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
        })

        setReload(true);
    }

    const serviceCode = (service: ServiceDetailData) => {
        return baseData.ID + "-" + service.service_template.type + ('000' + service.service_number).slice(-3);
    };

    const toStrPlan = (plans: PlanData[] | undefined) => {
        let after = 0
        let halfYear = 0
        let oneYear = 0
        if (plans !== undefined) {
            for (const plan of plans) {
                after += plan.after
                halfYear += plan.half_year
                oneYear += plan.one_year
            }
        }

        return after + "/" + halfYear + "/" + oneYear
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
                    JPNIC登録(Manual)
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">1.1. サービス情報を選択してください</FormLabel>
                                <Select
                                    labelId="service_code"
                                    id="service_code"
                                    onChange={(event) => {
                                        console.log(event.target.value)
                                        setServiceID(Number(event.target.value))
                                        if (Number(event.target.value) !== 0) {
                                            const service = baseData.services?.filter(res => res.ID === Number(event.target.value))
                                            if (service !== undefined) {
                                                console.log(service[0])

                                                setData({
                                                    ...data,
                                                    network: {
                                                        ...data.network,
                                                        org_jp_1: service[0].org,
                                                        org_1: service[0].org_en,
                                                        zip_code: service[0].postcode,
                                                        addr_jp_1: service[0].address,
                                                        addr_1: service[0].address_en,
                                                        notify_email: String(restfulApiConfig.notifyEMail),
                                                    },
                                                    admin_user: {
                                                        ...data.admin_user,
                                                        name_jp: String(service[0].jpnic_admin?.name),
                                                        name: String(service[0].jpnic_admin?.name_en),
                                                        email: String(service[0].jpnic_admin?.mail),
                                                        org_jp_1: String(service[0].jpnic_admin?.org),
                                                        org_1: String(service[0].jpnic_admin?.org_en),
                                                        zip_code: String(service[0].jpnic_admin?.postcode),
                                                        addr_jp_1: String(service[0].jpnic_admin?.address),
                                                        addr_1: String(service[0].jpnic_admin?.address_en),
                                                        division_jp: String(service[0].jpnic_admin?.dept),
                                                        division: String(service[0].jpnic_admin?.dept_en),
                                                        phone: String(service[0].jpnic_admin?.tel),
                                                        fax: String(service[0].jpnic_admin?.fax),
                                                    },
                                                });

                                                if (service[0].jpnic_tech !== undefined) {
                                                    if (0 < service[0].jpnic_tech.length && service[0].jpnic_tech.length < 2) {
                                                        setTech1Data({
                                                            ...tech1Data,
                                                            name_jp: String(service[0].jpnic_tech[0]?.name),
                                                            name: String(service[0].jpnic_tech[0]?.name_en),
                                                            email: String(service[0].jpnic_tech[0]?.mail),
                                                            org_jp_1: String(service[0].jpnic_tech[0]?.org),
                                                            org_1: String(service[0].jpnic_tech[0]?.org_en),
                                                            zip_code: String(service[0].jpnic_tech[0]?.postcode),
                                                            addr_jp_1: String(service[0].jpnic_tech[0]?.address),
                                                            addr_1: String(service[0].jpnic_tech[0]?.address_en),
                                                            division_jp: String(service[0].jpnic_tech[0]?.dept),
                                                            division: String(service[0].jpnic_tech[0]?.dept_en),
                                                            phone: String(service[0].jpnic_tech[0]?.tel),
                                                            fax: String(service[0].jpnic_tech[0]?.fax),
                                                        })
                                                    }
                                                    if (2 <= service[0].jpnic_tech.length) {
                                                        setTech2Data({
                                                            ...tech2Data,
                                                            name_jp: String(service[0].jpnic_tech[1]?.name),
                                                            name: String(service[0].jpnic_tech[1]?.name_en),
                                                            email: String(service[0].jpnic_tech[1]?.mail),
                                                            org_jp_1: String(service[0].jpnic_tech[1]?.org),
                                                            org_1: String(service[0].jpnic_tech[1]?.org_en),
                                                            zip_code: String(service[0].jpnic_tech[1]?.postcode),
                                                            addr_jp_1: String(service[0].jpnic_tech[1]?.address),
                                                            addr_1: String(service[0].jpnic_tech[1]?.address_en),
                                                            division_jp: String(service[0].jpnic_tech[1]?.dept),
                                                            division: String(service[0].jpnic_tech[1]?.dept_en),
                                                            phone: String(service[0].jpnic_tech[1]?.tel),
                                                            fax: String(service[0].jpnic_tech[1]?.fax),
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem key={-1} value={0}>{"Manual"}</MenuItem>
                                    {
                                        baseData.services?.map((row, index) => (
                                            <MenuItem key={index} value={row.ID}>{serviceCode(row)}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <br/>
                            {
                                serviceID !== 0 &&
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">1.2. IPサービスを選択してください</FormLabel>
                                    <Select
                                        labelId="ip"
                                        id="ip"
                                        onChange={(event) => {
                                            console.log(serviceID)
                                            console.log(Number(event.target.value))
                                            const service = baseData.services?.filter(res => res.ID === serviceID);
                                            if (service !== undefined) {
                                                const ip = service[0].ip?.filter(res => res.ID === Number(event.target.value));
                                                if (ip !== undefined) {
                                                    console.log(ip[0])

                                                    let kindID = "10";
                                                    let plan = ip[0].ip + " " + toStrPlan(ip[0].plan) + " 1/1/1";
                                                    if (ip[0].version === 6) {
                                                        kindID = "20"
                                                        plan =""
                                                    }

                                                    setData({
                                                        ...data,
                                                        network: {
                                                            ...data.network,
                                                            kind_id: kindID,
                                                            ip_address: ip[0].ip,
                                                            network_name: ip[0].name,
                                                            plan: plan,
                                                        }
                                                    });
                                                }
                                            }
                                        }}
                                    >
                                        {
                                            baseData.services?.filter(res => res.ID === serviceID).map((row) => (
                                                row.ip?.map((rowIP, index) => (
                                                    <MenuItem key={index}
                                                              value={rowIP.ID}>({rowIP.ip}_{toStrPlan(rowIP.plan)}){rowIP.name}</MenuItem>
                                                ))
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            }
                            <br/>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">2.1. 業務区分 </FormLabel>
                                <Select
                                    labelId="kind_id"
                                    id="kind_id"
                                    value={data.network.kind_id}
                                    onChange={(event) => {
                                        setData({
                                            ...data,
                                            network: {...data.network, kind_id: String(event.target.value)}
                                        });
                                    }}
                                >
                                    <MenuItem key={"kind_id_1"} value={"10"}>IPv4登録</MenuItem>
                                    <MenuItem key={"kind_id_2"} value={"11"}>IPv4変更</MenuItem>
                                    <MenuItem key={"kind_id_3"} value={"20"}>IPv6登録</MenuItem>
                                    <MenuItem key={"kind_id_4"} value={"21"}>IPv6変更</MenuItem>
                                </Select>
                            </FormControl>
                            {" "}
                            <FormControl component="fieldset">
                                <FormLabel component="legend">2.2. インフラ・ユーザ区分</FormLabel>
                                <Select
                                    labelId="infra_usr_kind"
                                    id="infra_usr_kind"
                                    value={data.network.infra_user_kind}
                                    onChange={(event) => {
                                        setData({
                                            ...data,
                                            network: {...data.network, infra_user_kind: String(event.target.value)}
                                        });
                                    }}
                                >
                                    <MenuItem key={"infra_usr_kind_1"} value={"1"}>インフラ</MenuItem>
                                    <MenuItem key={"infra_usr_kind_2"} value={"2"}>ユーザ</MenuItem>
                                    <MenuItem key={"infra_usr_kind_3"} value={"3"}>再割り振り</MenuItem>
                                    <MenuItem key={"infra_usr_kind_4"} value={"4"}>再割り当て</MenuItem>
                                </Select>
                            </FormControl>
                            <br/>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="network_ip_address"
                                    label="IPネットワークアドレス"
                                    value={data.network.ip_address}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({...data, network: {...data.network, ip_address: event.target.value}});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="network_network_name"
                                    label="ネットワーク名"
                                    value={data.network.network_name}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            network: {...data.network, network_name: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="network_org_jp"
                                    label="Org"
                                    value={data.network.org_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({...data, network: {...data.network, org_jp_1: event.target.value}});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="network_org_en"
                                    label="Org(English)"
                                    value={data.network.org_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({...data, network: {...data.network, org_1: event.target.value}});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="network_postcode"
                                    label="郵便番号"
                                    value={data.network.zip_code}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({...data, network: {...data.network, zip_code: event.target.value}});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="network_address_jp"
                                    label="住所"
                                    value={data.network.addr_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({...data, network: {...data.network, addr_jp_1: event.target.value}});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="network_address_en"
                                    label="住所(English)"
                                    value={data.network.addr_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({...data, network: {...data.network, addr_1: event.target.value}});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formLong}
                                    required
                                    id="network_plan"
                                    label="Plan"
                                    value={data.network.plan}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({...data, network: {...data.network, plan: event.target.value}});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="network_notify_email"
                                    label="通知アドレス"
                                    value={data.network.notify_email}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            network: {...data.network, notify_email: event.target.value}
                                        });
                                    }}
                                />
                            </form>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel component="legend">3. 管理者連絡窓口 </FormLabel>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_jpnic_handle"
                                    label="JPNIC Handle"
                                    value={data.admin_user.jpnic_handle}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, jpnic_handle: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_org_jp"
                                    label="Org"
                                    value={data.admin_user.org_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, org_jp_1: event.target.value}
                                        });
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_org_en"
                                    label="Org(English)"
                                    value={data.admin_user.org_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, org_1: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_name_jp"
                                    label="名前"
                                    value={data.admin_user.name_jp}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, name_jp: event.target.value}
                                        });
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_name_en"
                                    label="名前(English)"
                                    value={data.admin_user.name}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, name: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_postcode"
                                    label="郵便番号"
                                    value={data.admin_user.zip_code}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, zip_code: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="admin_address_jp"
                                    label="住所"
                                    value={data.admin_user.addr_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, addr_jp_1: event.target.value}
                                        });
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="admin_address_en"
                                    label="住所(English)"
                                    value={data.admin_user.addr_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, addr_1: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_dept_jp"
                                    label="Dept"
                                    value={data.admin_user.division_jp}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, division_jp: event.target.value}
                                        });
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_dept_en"
                                    label="Dept(English)"
                                    value={data.admin_user.division}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, division: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_phone"
                                    label="電話番号"
                                    value={data.admin_user.phone}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, phone: event.target.value}
                                        });
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_fax"
                                    label="Fax"
                                    value={data.admin_user.fax}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, fax: event.target.value}
                                        });
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formShort}
                                    required
                                    id="admin_email"
                                    label="ユーザEMail"
                                    value={data.admin_user.email}
                                    variant="outlined"
                                    onChange={event => {
                                        setData({
                                            ...data,
                                            admin_user: {...data.admin_user, email: event.target.value}
                                        });
                                    }}
                                />
                            </form>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel component="legend">4.1. 技術者連絡窓口1 </FormLabel>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_jpnic_handle"
                                    label="JPNIC Handle"
                                    value={tech1Data.jpnic_handle}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, jpnic_handle: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_org_jp"
                                    label="Org"
                                    value={tech1Data.org_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, org_jp_1: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_org_en"
                                    label="Org(English)"
                                    value={tech1Data.org_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, org_1: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_name_jp"
                                    label="名前"
                                    value={tech1Data.name_jp}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, name_jp: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_name_en"
                                    label="名前(English)"
                                    value={tech1Data.name}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, name: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_postcode"
                                    label="郵便番号"
                                    value={tech1Data.zip_code}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, zip_code: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="tech1_address_jp"
                                    label="住所"
                                    value={tech1Data.addr_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, addr_jp_1: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="tech1_address_en"
                                    label="住所(English)"
                                    value={tech1Data.addr_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, addr_1: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_dept_jp"
                                    label="Dept"
                                    value={tech1Data.division_jp}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, division_jp: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_dept_en"
                                    label="Dept(English)"
                                    value={tech1Data.division}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, division: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_phone"
                                    label="電話番号"
                                    value={tech1Data.phone}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, phone: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech1_fax"
                                    label="Fax"
                                    value={tech1Data.fax}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, fax: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formShort}
                                    required
                                    id="tech1_email"
                                    label="ユーザEMail"
                                    value={tech1Data.email}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech1Data({...tech1Data, email: event.target.value});
                                    }}
                                />
                            </form>
                            <FormLabel component="legend">4.2. 技術者連絡窓口2 </FormLabel>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_jpnic_handle"
                                    label="JPNIC Handle"
                                    value={tech2Data.jpnic_handle}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, jpnic_handle: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="admin_org_jp"
                                    label="Org"
                                    value={tech2Data.org_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, org_jp_1: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_org_en"
                                    label="Org(English)"
                                    value={tech2Data.org_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, org_1: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_name_jp"
                                    label="名前"
                                    value={tech2Data.name_jp}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, name_jp: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_name_en"
                                    label="名前(English)"
                                    value={tech2Data.name}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, name: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_postcode"
                                    label="郵便番号"
                                    value={tech2Data.zip_code}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, zip_code: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="tech2_address_jp"
                                    label="住所"
                                    value={tech2Data.addr_jp_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, addr_jp_1: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="tech2_address_en"
                                    label="住所(English)"
                                    value={tech2Data.addr_1}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, addr_1: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_dept_jp"
                                    label="Dept"
                                    value={tech2Data.division_jp}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, division_jp: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_dept_en"
                                    label="Dept(English)"
                                    value={tech2Data.division}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, division: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_phone"
                                    label="電話番号"
                                    value={tech2Data.phone}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, phone: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tech2_fax"
                                    label="Fax"
                                    value={tech2Data.fax}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, fax: event.target.value});
                                    }}
                                />
                                <br/>
                                <TextField
                                    className={classes.formShort}
                                    required
                                    id="tech2_email"
                                    label="ユーザEMail"
                                    value={tech2Data.email}
                                    variant="outlined"
                                    onChange={event => {
                                        setTech2Data({...tech2Data, email: event.target.value});
                                    }}
                                />
                            </form>
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
