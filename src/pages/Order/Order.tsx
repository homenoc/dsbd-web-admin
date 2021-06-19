import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import useStyles from "../Dashboard/styles";
import {
    PaymentDetailData
} from "../../interface";
import {useSnackbar} from "notistack";
import {GetAll, Refund} from "../../api/Payment";
import {
    Button,
    Card, CardActions,
    CardContent, Chip,
    FormControl,
    FormControlLabel,
    InputBase,
    Paper,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";

export default function Order() {
    const classes = useStyles();
    const [payments, setPayments] = useState<PaymentDetailData[]>();
    const [initPayments, setInitPayments] = useState<PaymentDetailData[]>();
    const {enqueueSnackbar} = useSnackbar();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);
    const [money, setSumMoney] = React.useState(0);
    const [reload, setReload] = React.useState(true);

    useEffect(() => {
        if (reload) {
            GetAll().then(res => {
                if (res.error === "") {
                    console.log(res);
                    setPayments(res.data);
                    setInitPayments(res.data);
                    let money = 0;
                    for (const tmp of res.data) {
                        money += tmp.fee
                    }
                    setSumMoney(money);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
        }
        setReload(false);
    }, [reload]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkPayment = (payment: PaymentDetailData) => {
        if (value === 1) {
            return payment.paid;
        } else if (value === 2) {
            return !payment.paid;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: PaymentDetailData[];
        if (initPayments != null) {
            if (search === "") {
                tmp = initPayments;
            } else {
                tmp = initPayments?.filter((payment: PaymentDetailData) => {
                    return payment.payment_intent_id.toLowerCase().includes(search.toLowerCase())
                });
            }
            setPayments(tmp);
        }
    };

    const handleRefundProcess = (id: number) => {
        Refund(id).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
                setReload(true);
            } else {
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
        })
    };

    return (
        <Dashboard title="Payment Info">
            <h3>合計金額: {money}円</h3>
            <Paper component="form" className={classes.rootInput}>
                <InputBase
                    className={classes.input}
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                />
            </Paper>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="open" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="支払済"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="未払い"/>
                </RadioGroup>
            </FormControl>
            {
                payments?.filter(payment => checkPayment(payment)).map((payment: PaymentDetailData) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                ID: {payment.ID} ({payment.payment_intent_id})
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {
                                    payment.is_membership &&
                                    <div>
                                        {payment.group?.org} ({payment.group?.org_en})
                                    </div>
                                }
                                {
                                    !payment.is_membership &&
                                    <div>
                                        {payment.user?.name} ({payment.user?.name_en})
                                    </div>
                                }
                            </Typography>
                            <br/>
                            {
                                payment.is_membership &&
                                <Chip
                                    size="small"
                                    color="primary"
                                    label="会費"
                                />
                            }
                            {
                                !payment.is_membership &&
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    label="寄付"
                                />
                            }
                            &nbsp;&nbsp;
                            {
                                !payment.refund && payment.paid &&
                                <Chip
                                    size="small"
                                    color="primary"
                                    label="支払済"
                                />
                            }
                            {
                                !payment.refund && !payment.paid &&
                                <Chip
                                    size="small"
                                    color={"secondary"}
                                    label="未払"
                                />
                            }
                            {
                                payment.refund && payment.paid &&
                                <Chip
                                    size="small"
                                    color={"secondary"}
                                    label="返金済み"
                                />
                            }
                            <br/> <br/>
                            {payment.fee}円
                        </CardContent>
                        <CardActions>
                            <Button size="small" color={"secondary"}
                                    onClick={() => handleRefundProcess(payment.ID)}>返金</Button>
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
