import useStyles from "./styles";
import {GroupDetailData, TemplateData} from "../../../interface";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button, Card,
    CardContent, Chip, FormControl, Grid, InputLabel, MenuItem, PropTypes, Select,
    TextField, Typography
} from "@material-ui/core";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {GroupStatusStr} from "../../../components/Dashboard/Status/Status";
import {GroupAbolition, GroupLockButton, GroupStatusButton} from "./GroupMenu";
import {DeleteSubscription, Put} from "../../../api/Group";
import {useSnackbar} from "notistack";
import ServiceAddDialogs from "./ServiceAdd/ServiceAdd";
import ConnectionAddDialogs from "./ConnectionAdd/ConnectionAdd";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function ChipAgree(props: { agree: boolean }) {
    const {agree} = props;
    if (agree) {
        return (
            <Chip
                size="small"
                color="primary"
                label="規約に同意する"
            />
        )
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="規約に同意していない"
            />
        )
    }
}

export function GroupProfileInfo(props: {
    data: GroupDetailData,
    template: TemplateData,
    setReload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, template, setReload} = props;
    const classes = useStyles();
    const [lockPersonalInformation, setLockPersonalInformation] = React.useState(true);
    const [group, setGroup] = useState(data);
    const [openAddService, setOpenAddService] = React.useState(false);
    const [openAddConnection, setOpenAddConnection] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [paymentCoupon, setPaymentCoupon] = React.useState(0);
    const [discountRate, setDiscountRate] = React.useState(0);
    const [membershipPlan, setMembershipPlan] = React.useState(0);
    const monthly = 1000;
    const yearly = 12000;
    let nowDate = new Date();
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(nowDate);
    const [membershipDate, setMembershipDate] = React.useState<string>("");

    useEffect(() => {
        if (data.member_expired != null) {
            const tmp = data.member_expired.split('T');
            nowDate = new Date(tmp[0]);
            setSelectedDate(new Date(tmp[0]));
            handleBeginDateChange(selectedDate);
        }
    }, []);

    const membershipUpdate = () => {
        const req = {
            payment_coupon_template_id: paymentCoupon,
            payment_membership_template_id: membershipPlan,
            member_expired: membershipDate
        };

        console.log(req);

        Put(data.ID, req).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            setReload(true);
        })
    }

    const cancelSubscription = () => {
        DeleteSubscription(data.ID).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            setReload(true);
        })
    }

    const handleBeginDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date !== null) {
            setMembershipDate(date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) +
                '-' + ('00' + (date.getDate())).slice(-2) + 'T09:00:00Z');
        }
    };
    const handleChangeMembershipPlan = (event: React.ChangeEvent<{ value: any }>) => {
        setMembershipPlan(event.target.value as number);
    };
    const handleChangeCoupon = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPaymentCoupon(event.target.value as number);
        const coupon = template.payment_coupon_template?.filter(coupon => coupon.ID === event.target.value as number)
        if (coupon != null) {
            if (coupon.length === 0) {
                setDiscountRate(0);
            } else {
                setDiscountRate(coupon[0].discount_rate);
            }
        }
    };

    const clickPersonalInfoLock = () => {
        setLockPersonalInformation(!lockPersonalInformation);
    }

    // Update Group Information
    const updateGroupInfo = () => {
        Put(group.ID, group).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            setReload(true);
        })
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="group-info"
                    >
                        <Typography className={classes.heading}>グループ情報(住所、電話番号など)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={classes.root}>
                            <form className={classes.rootForm} noValidate autoComplete="off">
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="postcode"
                                    label="郵便番号"
                                    defaultValue={data.postcode}
                                    InputProps={{
                                        readOnly: lockPersonalInformation,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setGroup({...data, postcode: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="address"
                                    label="住所"
                                    defaultValue={data.address}
                                    InputProps={{
                                        readOnly: lockPersonalInformation,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setGroup({...data, address: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formMedium}
                                    required
                                    id="address_english"
                                    label="住所(English)"
                                    defaultValue={data.address_en}
                                    InputProps={{
                                        readOnly: lockPersonalInformation,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setGroup({...data, address_en: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="tel"
                                    label="電話番号"
                                    defaultValue={data.tel}
                                    InputProps={{
                                        readOnly: lockPersonalInformation,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setGroup({...data, tel: event.target.value});
                                    }}
                                />
                                <TextField
                                    className={classes.formVeryShort}
                                    required
                                    id="country"
                                    label="住居国"
                                    defaultValue={data.country}
                                    InputProps={{
                                        readOnly: lockPersonalInformation,
                                    }}
                                    variant="outlined"
                                    onChange={event => {
                                        setGroup({...data, country: event.target.value});
                                    }}
                                />
                            </form>
                            <Button
                                size="small"
                                color="secondary"
                                disabled={!lockPersonalInformation}
                                onClick={clickPersonalInfoLock}
                            >
                                ロック解除
                            </Button>
                            <Button size="small">Cancel</Button>
                            <Button
                                size="small"
                                color="primary"
                                disabled={lockPersonalInformation}
                                onClick={updateGroupInfo}
                            >
                                Save
                            </Button>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="question"
                        id="question"
                    >
                        <Typography className={classes.heading}>Agree & Question & Contract</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={classes.root}>
                            <div className={classes.largeHeading}>Agree</div>
                            <ChipAgree agree={data.agree}/>
                            <div className={classes.largeHeading}>Question</div>
                            <div className={classes.text}>{data.question}</div>
                            <div className={classes.largeHeading}>Contract</div>
                            <div className={classes.text}>{data.contract}</div>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="payment"
                        id="payment"
                    >
                        <Typography className={classes.heading}>学生会員・支払い</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl variant="filled" className={classes.formSelect}>
                            <InputLabel id="membership-plan-label">Membership Plan</InputLabel>
                            <Select
                                labelId="membership-plan-label"
                                id="membership-plan"
                                value={membershipPlan}
                                onChange={handleChangeMembershipPlan}
                            >
                                <option key={"membership_template_0"} value={0}>自動課金無効</option>
                                {
                                    template.payment_membership_template?.map(tmp =>
                                        <option
                                            key={"membership_template_" + tmp.ID}
                                            value={tmp.ID}
                                        >
                                            {tmp.plan}
                                        </option>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormControl variant="filled" className={classes.formShort}>
                            <InputLabel id="payment-coupon">Coupon</InputLabel>
                            <Select
                                labelId="payment-label"
                                id="payment-coupon"
                                value={paymentCoupon}
                                onChange={handleChangeCoupon}
                            >
                                <MenuItem value={0}>割引なし(0%割引)</MenuItem>
                                {
                                    template.payment_coupon_template?.map(coupon =>
                                        <MenuItem
                                            key={"payment_coupon_template_" + coupon.ID}
                                            value={coupon.ID}
                                        >
                                            {coupon.title}({coupon.discount_rate}%割引)
                                        </MenuItem>
                                    )
                                }
                            </Select>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    required
                                    margin="normal"
                                    id="membership-date-picker-dialog"
                                    label="Membership期限"
                                    format="yyyy/MM/dd"
                                    value={selectedDate}
                                    onChange={handleBeginDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            <br/>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <b>{monthly - (discountRate / 100) * monthly}円/月</b>
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{yearly - (discountRate / 100) * yearly}円/年</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        className={classes.spaceRight}
                                        onClick={membershipUpdate}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color={"secondary"}
                                        className={classes.spaceRight}
                                        onClick={cancelSubscription}
                                    >
                                        解約
                                    </Button>
                                </Grid>
                            </Grid>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="other"
                        id="other"
                    >
                        <Typography className={classes.heading}>その他</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <br/>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    className={classes.spaceRight}
                    onClick={() => setOpenAddService(true)}
                >
                    Service情報の追加
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenAddConnection(true)}
                >
                    接続情報の追加
                </Button>
                <br/>
                <Button size="small" className={classes.spaceTop}>メール送信</Button>
                <ServiceAddDialogs
                    key={"service_add_dialogs"}
                    baseData={data}
                    template={template}
                    open={openAddService}
                    setOpen={setOpenAddService}
                    reload={setReload}
                />
                <ConnectionAddDialogs
                    key={"connection_add_dialogs"}
                    baseData={data}
                    template={template}
                    open={openAddConnection}
                    setOpen={setOpenAddConnection}
                    reload={setReload}
                />
            </CardContent>
        </Card>
    )
}

export function GroupMainMenu(props: { data: GroupDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const classes = useStyles();
    const {data, reload} = props;

    return (
        <Card className={classes.root}>
            <CardContent>
                <h3>Menu</h3>
                <GroupStatusButton key={"group_status_button"} data={data} reload={reload}/>
                <GroupLockButton key={"group_lock_button"} data={data} reload={reload}/>
                <GroupAbolition key={"group_abolition"}/>
            </CardContent>
        </Card>
    )
}

export function GroupStatus(props: {
    data: GroupDetailData
    reload: boolean
}): any {
    const classes = useStyles();
    const {data, reload} = props;
    const createDate = "作成日: " + data.CreatedAt;
    const updateDate = "更新日: " + data.UpdatedAt;
    const [membershipLabel, setMembershipLabel] = useState<{ color: Exclude<PropTypes.Color, 'inherit'>, label: string }>({
        color: "primary",
        label: ""
    });
    const [automaticUpdate, setAutomaticUpdate] = useState<{ color: Exclude<PropTypes.Color, 'inherit'>, label: string }>({
        color: "primary",
        label: ""
    });
    const nowDate = new Date();

    useEffect(() => {
        setMembershipLabel({color: "primary", label: ""});
        if (data.member_expired != null) {
            const tmp = data.member_expired.split('T');
            const groupMemberExpired = new Date(tmp[0]);

            if (data.payment_coupon_template_id !== 0) {
                setMembershipLabel({
                    color: "primary",
                    label: data.payment_coupon_template?.title + ": " + tmp[0] + "まで"
                });
            } else {
                setMembershipLabel({
                    color: "primary",
                    label: "会員: " + tmp[0] + "まで"
                });
            }
            if (groupMemberExpired < nowDate) {
                setMembershipLabel({
                    color: "secondary",
                    label: "(未払い) " + membershipLabel.label
                })
            }
        } else {
            setMembershipLabel({
                color: "secondary",
                label: "未払い状態"
            })
        }

        if (data.payment_membership_template?.yearly) {
            setAutomaticUpdate({
                color: membershipLabel.color,
                label: "(年更新)"
            })
        } else if (data.payment_membership_template?.monthly) {
            setAutomaticUpdate({
                color: membershipLabel.color,
                label: "(月更新)"
            })
        } else {
            setAutomaticUpdate({
                color: membershipLabel.color,
                label: "(更新無効)"
            })
        }
    }, [reload]);

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h3>Status</h3>
                        <Chip
                            size="small"
                            color="primary"
                            label={GroupStatusStr(data)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Membership</h3>
                        <Chip size="small" color={membershipLabel.color} label={membershipLabel.label}/>
                        &nbsp;
                        <Chip size="small" color={automaticUpdate.color} label={automaticUpdate.label}/>
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
