import useStyles from "./styles";
import {GroupDetailData} from "../../../interface";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar, Typography
} from "@material-ui/core";
import React from "react";
import {useHistory} from "react-router-dom";


export default function Ticket(props: { data: GroupDetailData }): any {
    const {data} = props;
    const classes = useStyles();
    const history = useHistory();

    const clickDetailPage = (id: number) => {
        history.push('/dashboard/support/' + id);
    }

    if (data.tickets !== undefined) {
        return (
            <TableContainer component={Paper}>
                <Toolbar variant="dense">
                    <Typography className={classes.heading} id="tableTitle" component="div">
                        Tickets
                    </Typography>
                </Toolbar>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.tickets.map((row) => (
                            <TableRow key={row.ID}>
                                <TableCell component="th" scope="row">
                                    {row.ID}: {row.title}
                                </TableCell>
                                <TableCell align="left">{row.solved}</TableCell>
                                <TableCell align="left">
                                    <Button size="small" variant="outlined" onClick={() => clickDetailPage(row.ID)}>
                                        Detail
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
};
