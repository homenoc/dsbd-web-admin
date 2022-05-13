import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import {StyledCard, StyledInputBase, StyledPaperRootInput, StyledTypographyTitle} from "../Dashboard/styles"
import {
    CardActions,
    CardContent,
    FormControl,
    FormControlLabel,
    Radio, RadioGroup,
    Typography
} from "@mui/material";
import {GetAll} from "../../api/User";
import {DefaultUserDetailDataArray, UserDetailData} from "../../interface";
import {useSnackbar} from "notistack";


export default function User() {
    const [users, setUsers] = useState(DefaultUserDetailDataArray);
    const [initUsers, setInitUsers] = useState(DefaultUserDetailDataArray);
    const {enqueueSnackbar} = useSnackbar();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);


    useEffect(() => {
        GetAll().then(res => {
            if (res.error === "") {
                console.log(res);
                setUsers(res.data);
                setInitUsers(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkUser = (user: UserDetailData) => {
        if (value === 1) {
            return user.expired_status === 0;
        } else if (value === 2) {
            return user.expired_status !== 0;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: UserDetailData[];
        if (search === "") {
            tmp = initUsers;
        } else {
            tmp = initUsers.filter((users: UserDetailData) => {
                const name = users.name + users.name_en
                return name.toLowerCase().includes(search.toLowerCase())
            });
        }
        setUsers(tmp);
    };

    return (
        <Dashboard title="User Info">
            <StyledPaperRootInput>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                />
            </StyledPaperRootInput>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="有効"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="無効"/>
                </RadioGroup>
            </FormControl>
            {
                users.filter(user => checkUser(user)).map((user: UserDetailData) => (
                    <StyledCard>
                        <CardContent>
                            <StyledTypographyTitle color="textSecondary" gutterBottom>
                                ID: {user.ID}
                            </StyledTypographyTitle>
                            <Typography variant="h5" component="h2">
                                {user.name} ({user.name_en})
                            </Typography>
                            <br/>
                        </CardContent>
                        <CardActions>
                            {/*<Button size="small" onClick={() => clickDetailPage(notice.ID)}>Detail</Button>*/}
                        </CardActions>
                    </StyledCard>
                ))
            }
        </Dashboard>
    );
}
