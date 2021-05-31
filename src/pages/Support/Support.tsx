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
    Paper, Radio, RadioGroup,
    Typography
} from "@material-ui/core";
import {GetAll} from "../../api/Support";
import {useHistory} from "react-router-dom";
import {DefaultTicketDataArray, TicketDetailData} from "../../interface";
import {useSnackbar} from "notistack";
import {Solved} from "../../components/Dashboard/Solved/Open";


export default function Support() {
    const classes = useStyles();
    const [tickets, setTickets] = useState(DefaultTicketDataArray);
    const [initTickets, setInitTickets] = useState(DefaultTicketDataArray);
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [value, setValue] = React.useState(false);

    useEffect(() => {
        GetAll().then(res => {
            if (res.error === "") {
                console.log(res);
                setTickets(res.data);
                setInitTickets(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === "true")
    };

    const handleFilter = (search: string) => {
        let tmp: TicketDetailData[];
        if (search === "") {
            tmp = initTickets;
        } else {
            tmp = initTickets.filter((grp: TicketDetailData) => {
                return grp.title.toLowerCase().includes(search.toLowerCase())
            });
        }
        setTickets(tmp);
    };

    const clickDetailPage = (id: number) => {
        history.push('/dashboard/support/' + id);
    }

    return (
        <Dashboard title="Ticket Info">
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
                    <FormControlLabel value={false} control={<Radio color="primary"/>} label="未解決"/>
                    <FormControlLabel value={true} control={<Radio color="primary"/>} label="解決済"/>
                </RadioGroup>
            </FormControl>
            {
                tickets.filter(ticket => ticket.solved === value).map((ticket: TicketDetailData, index) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                ID: {ticket.ID}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {ticket.title}
                            </Typography>
                            <br/>
                            <Solved key={index} solved={ticket.solved}/>
                            <br/>
                            Group: {ticket.group?.org}({ticket.group?.org_en})
                            <br/>
                            作成者: {ticket.user?.name}
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => clickDetailPage(ticket.ID)}>Detail</Button>
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
