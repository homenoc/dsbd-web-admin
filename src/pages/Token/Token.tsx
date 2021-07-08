import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import useStyles from "../Dashboard/styles"
import {
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormControlLabel,
    InputBase,
    Paper, Radio, RadioGroup,
    Typography
} from "@material-ui/core";
import {GetAll} from "../../api/Token";
import {
    DefaultTokenDetailDataArray,
    TokenDetailData,
} from "../../interface";
import {useSnackbar} from "notistack";


export default function Token() {
    const classes = useStyles();
    const [tokens, setTokens] = useState(DefaultTokenDetailDataArray);
    const [initTokens, setInitTokens] = useState(DefaultTokenDetailDataArray);
    const {enqueueSnackbar} = useSnackbar();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);


    useEffect(() => {
        GetAll().then(res => {
            if (res.error === "") {
                console.log(res);
                setTokens(res.data);
                setInitTokens(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkToken = (token: TokenDetailData) => {
        if (value === 1) {
            return token.admin;
        } else if (value === 2) {
            return !token.admin;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: TokenDetailData[];
        if (search === "") {
            tmp = initTokens;
        } else {
            tmp = initTokens.filter((token: TokenDetailData) => {
                const tmpToken = token.access_token + token.user_token + token.tmp_token
                return tmpToken.toLowerCase().includes(search.toLowerCase())
            });
        }
        setTokens(tmp);
    };

    return (
        <Dashboard title="Token Info">
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
                <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="管理側"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="ユーザ側"/>
                </RadioGroup>
            </FormControl>
            {
                tokens.filter(token => checkToken(token)).map((token: TokenDetailData) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                ID: {token.ID}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                AccessToken: {token.access_token}
                                <br/>
                                UserToken: {token.user_token}
                                <br/>
                                TmpToken: {token.tmp_token}
                            </Typography>
                            <br/>
                        </CardContent>
                        <CardActions>
                            {/*<Button size="small" onClick={() => clickDetailPage(notice.ID)}>Detail</Button>*/}
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
