import {GroupDetailData, TemplateData} from "../../../interface";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    CardContent, Chip, FormControl, Grid, InputLabel, MenuItem, PropTypes, Select, SelectChangeEvent, TextField,
    Typography
} from "@mui/material";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {GroupStatusStr} from "../../../components/Dashboard/Status/Status";
import {GroupAbolition, GroupLockButton, GroupStatusButton} from "./GroupMenu";
import {DeleteSubscription, Put} from "../../../api/Group";
import {useSnackbar} from "notistack";
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import JPNICRegistrationDialog from "./JPNIC";
import {
    StyledButtonSpaceRight, StyledButtonSpaceTop,
    StyledCardRoot1,
    StyledChip1, StyledDivLargeHeading,
    StyledDivRoot1, StyledDivText,
    StyledFormControlFormSelect,
    StyledFormControlFormShort,
    StyledRootForm,
    StyledTextFieldMedium,
    StyledTextFieldVeryShort1,
    StyledTypographyHeading
} from "../../../style";
import {LocalizationProvider} from "@mui/lab";
import {useNavigate} from "react-router-dom";

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
    setOpenMailSendDialog: Dispatch<SetStateAction<boolean>>
    setReload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, template, setOpenMailSendDialog, setReload} = props;
    const [lockPersonalInformation, setLockPersonalInformation] = React.useState(true);
    const [group, setGroup] = useState(data);
    const [openAddService, setOpenAddService] = React.useState(false);
    const [openAddConnection, setOpenAddConnection] = React.useState(false);
    const [openJPNICRegistration, setOpenJPNICRegistration] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [paymentCoupon, setPaymentCoupon] = React.useState(0);
    const [discountRate, setDiscountRate] = React.useState(0);
    const [membershipPlan, setMembershipPlan] = React.useState(0);
    const monthly = 1000;
    const yearly = 12000;
    let nowDate = new Date();
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(nowDate);
    const [membershipDate, setMembershipDate] = React.useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (data.member_expired != null) {
            const tmp = data.member_expired.split('T');
            nowDate = new Date(tmp[0]);
            setSelectedDate(nowDate);
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

    const handleBeginDateChange = (newDate: Date | null) => {
        setSelectedDate(newDate);
        if (newDate !== null) {
            setMembershipDate(newDate.getFullYear() + '-' + ('00' + (newDate.getMonth() + 1)).slice(-2) +
                '-' + ('00' + (newDate.getDate())).slice(-2) + 'T09:00:00Z');
        }
    };
    const handleChangeMembershipPlan = (event: SelectChangeEvent<any>) => {
        setMembershipPlan(event.target.value as number);
    };
    const handleChangeCoupon = (event: SelectChangeEvent<any>) => {
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
        <StyledCardRoot1>
            <CardContent>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="group-info"
                    >
                        <StyledTypographyHeading>グループ情報(住所、電話番号など)</StyledTypographyHeading>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl sx={{width: "100%"}}>
                            <StyledDivRoot1>
                                <StyledRootForm noValidate autoComplete="off">
                                    <StyledTextFieldVeryShort1
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
                                    <StyledTextFieldMedium
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
                                    <StyledTextFieldMedium
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
                                    <StyledTextFieldVeryShort1
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
                                    <StyledTextFieldVeryShort1
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
                                </StyledRootForm>
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
                            </StyledDivRoot1>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="question"
                        id="question"
                    >
                        <StyledTypographyHeading>Agree & Question & Contract</StyledTypographyHeading>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl sx={{width: "100%"}}>
                            <StyledDivRoot1>
                                <StyledDivLargeHeading>Agree</StyledDivLargeHeading>
                                <ChipAgree agree={data.agree}/>
                                <StyledDivLargeHeading>Question</StyledDivLargeHeading>
                                <StyledDivText>{data.question}</StyledDivText>
                                <StyledDivLargeHeading>Contract</StyledDivLargeHeading>
                                <StyledDivText>{data.contract}</StyledDivText>
                            </StyledDivRoot1>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="payment"
                        id="payment"
                    >
                        <StyledTypographyHeading>学生会員・支払い</StyledTypographyHeading>
                    </AccordionSummary>
                    <AccordionDetails>
                        <StyledFormControlFormSelect variant="filled">
                            <FormControl sx={{width: "100%"}}>
                                <InputLabel id="membership-plan-label">Membership Plan</InputLabel>
                                <Select
                                    labelId="membership-plan-label"
                                    id="membership-plan"
                                    value={membershipPlan}
                                    onChange={handleChangeMembershipPlan}
                                >
                                    <MenuItem key={"membership_template_0"} value={0}>自動課金無効</MenuItem>
                                    {
                                        template.payment_membership_template?.map(tmp =>
                                            <MenuItem
                                                key={"membership_template_" + tmp.ID}
                                                value={tmp.ID}
                                            >
                                                {tmp.plan}
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </StyledFormControlFormSelect>
                        <StyledFormControlFormShort variant="filled">
                            <FormControl sx={{width: "100%"}}>
                                <InputLabel id="payment-coupon-title">Coupon</InputLabel>
                                <Select
                                    labelId="payment-coupon-title"
                                    id="payment-coupon"
                                    value={paymentCoupon}
                                    onChange={handleChangeCoupon}
                                >
                                    <MenuItem value={0} key={"payment_coupon_template_0"}>割引なし(0%割引)</MenuItem>
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
                            </FormControl>
                            <br/>
                            <FormControl sx={{width: "100%"}}>
                                <LocalizationProvider key={"membership-localization-provider"}
                                                      dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        mask="____/__/__"
                                        label="Membership期限"
                                        key="membership-date-picker-1"
                                        value={selectedDate}
                                        inputFormat="yyyy/MM/dd"
                                        onChange={handleBeginDateChange}
                                        renderInput={(params) => (<TextField  {...params} helperText={null}/>)}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <br/>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <b>{monthly - (discountRate / 100) * monthly}円/月</b>
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{yearly - (discountRate / 100) * yearly}円/年</b>
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledButtonSpaceRight
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={membershipUpdate}
                                    >
                                        Update
                                    </StyledButtonSpaceRight>
                                    <StyledButtonSpaceRight
                                        size="small"
                                        variant="contained"
                                        color={"secondary"}
                                        onClick={cancelSubscription}
                                    >
                                        解約
                                    </StyledButtonSpaceRight>
                                </Grid>
                            </Grid>
                        </StyledFormControlFormShort>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="other"
                        id="other"
                    >
                        <StyledTypographyHeading>その他</StyledTypographyHeading>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <br/>
                <StyledButtonSpaceRight
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/dashboard/group/' + data.ID + '/add/service')}
                >
                    Service情報の追加
                </StyledButtonSpaceRight>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/dashboard/group/' + data.ID + '/add/connection')}
                >
                    接続情報の追加
                </Button>
                <br/>
                <StyledButtonSpaceTop size="small"
                                      onClick={() => setOpenMailSendDialog(true)}>メール送信</StyledButtonSpaceTop>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenJPNICRegistration(true)}
                >
                    JPNIC登録(β)
                </Button>
                <JPNICRegistrationDialog
                    key={"jpnic_registration_dialogs"}
                    setOpen={setOpenJPNICRegistration}
                    open={openJPNICRegistration}
                    baseData={data}
                    setReload={setReload}
                />
            </CardContent>
        </StyledCardRoot1>
    )
}

export function GroupMainMenu(props: {
    data: GroupDetailData,
    autoMail: Dispatch<SetStateAction<string>>,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, autoMail, reload} = props;

    return (
        <StyledCardRoot1>
            <CardContent>
                <h3>Menu</h3>
                <GroupStatusButton key={"group_status_button"} data={data} autoMail={autoMail} reload={reload}/>
                <GroupLockButton key={"group_lock_button"} data={data} reload={reload}/>
                <GroupAbolition key={"group_abolition"}/>
            </CardContent>
        </StyledCardRoot1>
    )
}

export function GroupStatus(props: {
    data: GroupDetailData
    reload: boolean
}): any {
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
        <StyledCardRoot1>
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
                        <StyledChip1
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
        </StyledCardRoot1>
    );
}
