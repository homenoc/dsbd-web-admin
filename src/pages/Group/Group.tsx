import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import useStyles from "../Dashboard/styles"
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl, FormControlLabel,
    InputBase,
    Paper, Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {GetAll} from "../../api/Group";
import {useHistory} from "react-router-dom";
import {DefaultGroupDetailDataArray, GroupDetailData} from "../../interface";
import {useSnackbar} from "notistack";


export default function Group() {
    const classes = useStyles();
    const [groups, setGroups] = useState(DefaultGroupDetailDataArray);
    const [initGroups, setInitGroups] = useState(DefaultGroupDetailDataArray);
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    // 1:有効 2:無効
    const [value, setValue] = React.useState(1);

    useEffect(() => {
        GetAll().then(res => {
            if (res.error === "") {
                console.log(res);
                setGroups(res.data);
                setInitGroups(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkGroup = (group: GroupDetailData) => {
        if (value === 1) {
            return group.expired_status === 0;
        } else if (value === 2) {
            return group.expired_status !== 0;
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: GroupDetailData[];
        if (search === "") {
            tmp = initGroups;
        } else {
            tmp = initGroups.filter((grp: GroupDetailData) => {
                return grp.org_en.toLowerCase().includes(search.toLowerCase())
            });
        }
        setGroups(tmp);
    };

    function clickDetailPage(id: number) {
        history.push('/dashboard/group/' + id);
    }

    return (
        <Dashboard title="Group Info">
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
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="有効"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="無効"/>
                </RadioGroup>
            </FormControl>
            {
                groups.filter(group => checkGroup(group)).map((group: GroupDetailData) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                ID: {group.ID}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {group.org} ({group.org_en})
                            </Typography>
                            {/*<Typography className={classes.pos} color="textSecondary">*/}
                            {/*    {group.user}*/}
                            {/*</Typography>*/}
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => clickDetailPage(group.ID)}>Detail</Button>
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
