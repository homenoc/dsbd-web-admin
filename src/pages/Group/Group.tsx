import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import {StyledCard, StyledInputBase, StyledPaperRootInput, StyledTypographyTitle} from "../Dashboard/styles"
import {
    Button,
    CardActions,
    CardContent,
    FormControl, FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import {GetAll} from "../../api/Group";
import {useNavigate} from "react-router-dom";
import {DefaultGroupDetailDataArray, GroupDetailData} from "../../interface";
import {useSnackbar} from "notistack";


export default function Group() {
    const [groups, setGroups] = useState(DefaultGroupDetailDataArray);
    const [initGroups, setInitGroups] = useState(DefaultGroupDetailDataArray);
    const navigate = useNavigate();
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
        navigate('/dashboard/group/' + id);
    }

    return (
        <Dashboard title="Group Info">
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
                <RadioGroup row aria-label="gender" name="open" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="有効"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="無効"/>
                </RadioGroup>
            </FormControl>
            {
                groups.filter(group => checkGroup(group)).map((group: GroupDetailData) => (
                    <StyledCard key={"group_id_" + group.ID}>
                        <CardContent>
                            <StyledTypographyTitle color="textSecondary" gutterBottom>
                                ID: {group.ID}
                            </StyledTypographyTitle>
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
                    </StyledCard>
                ))
            }
        </Dashboard>
    );
}
