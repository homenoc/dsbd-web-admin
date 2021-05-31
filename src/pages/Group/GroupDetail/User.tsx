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

export default function User(props: { data: GroupDetailData }): any {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Toolbar variant="dense">
                <Typography className={classes.heading} id="tableTitle" component="div">
                    Users
                </Typography>
            </Toolbar>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="left">E-Mail</TableCell>
                        <TableCell align="left">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.users?.map((row) => (
                        <TableRow key={row.ID}>
                            <TableCell component="th" scope="row">
                                {row.ID}: {row.name}
                            </TableCell>
                            <TableCell align="left">{row.email}</TableCell>
                            <TableCell align="left">
                                <Button size="small" variant="outlined">
                                    Detail
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};
