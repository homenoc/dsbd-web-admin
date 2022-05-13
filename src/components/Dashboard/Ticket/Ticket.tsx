import {TicketDetailData} from "../../../interface";
import {
    Box,
    Button, Chip, FormControl,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    Toolbar,
} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {useNavigate} from "react-router-dom";
import {Put} from "../../../api/Support";
import {useSnackbar} from "notistack";
import {StyledTable2, StyledTypographyHeading} from "../../../style";


export default function Ticket(props: {
    data: TicketDetailData[] | undefined
    setReload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, setReload} = props;

    return (
        <TableContainer component={Paper}>
            <Toolbar variant="dense">
                <StyledTypographyHeading id="tickets">
                    Tickets
                </StyledTypographyHeading>
            </Toolbar>
            {
                data === undefined && <h3>データがありません</h3>
            }
            {
                data !== undefined &&
                <StatusTable
                    key={"ticket_status_table"}
                    setReload={setReload}
                    ticket={data.filter(item => !item.request).sort((a, b) => b.ID - a.ID)}
                />
            }
        </TableContainer>
    )
};

export function StatusTable(props: {
    ticket: TicketDetailData[]
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const {ticket, setReload} = props;
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {enqueueSnackbar} = useSnackbar();
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, ticket.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const ChatPage = (id: number) => navigate("/dashboard/support/" + id);

    const GroupDetailPage = (groupID: number) => {
        navigate('/dashboard/group/' + groupID);
    }

    const UserDetailPage = (userID: number) => {
        navigate('/dashboard/user/' + userID);
    }

    const clickSolvedStatus = (id: number, solved: boolean) => {
        Put(id, {solved}).then(res => {
            if (res.error === undefined) {
                enqueueSnackbar("OK", {variant: "success"});
            } else {
                enqueueSnackbar(res.error, {variant: "error"});
            }
            setReload(true);
        })
    }

    return (
        <Box sx={{width: '100%'}}>
            <TableContainer component={Paper}>
                <StyledTable2 size="small" aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>申請内容</TableCell>
                            <TableCell align="right">作成日</TableCell>
                            <TableCell align="right">状況</TableCell>
                            <TableCell align="right">機能</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (
                                rowsPerPage > 0
                                    ? ticket.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : ticket
                            ).map((row, index) => (
                                <TableRow key={"ticket_detail_" + index}>
                                    <TableCell component="th" scope="row">
                                        {
                                            (row.group_id === 0 || row.group_id == null) &&
                                            <Chip size="small" color="primary" label="U"/>
                                        }
                                        {
                                            !(row.group_id === 0 || row.group_id == null) &&
                                            <Chip size="small" color="primary" label="G"/>
                                        }
                                        &nbsp;
                                        {row.ID}: {row.title}
                                    </TableCell>
                                    <TableCell style={{width: 300}} align="right">
                                        {row.CreatedAt}
                                    </TableCell>
                                    <TableCell style={{width: 160}} align="right">
                                        {
                                            row.solved && <Chip size="small" color="primary" label="解決済"/>
                                        }
                                        {
                                            !row.solved && <Chip size="small" color="secondary" label="未解決"/>
                                        }
                                    </TableCell>
                                    <TableCell style={{width: 250}} align="right">
                                        {
                                            row.solved &&
                                            <Button size="small" color="primary" variant="outlined"
                                                    onClick={() => clickSolvedStatus(row.ID, false)}>未解決</Button>
                                        }
                                        {
                                            !row.solved &&
                                            <Button size="small" color="secondary" variant="outlined"
                                                    onClick={() => clickSolvedStatus(row.ID, true)}>解決済み</Button>
                                        }
                                        &nbsp;
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => ChatPage(row.ID)}>
                                            Chat
                                        </Button>
                                        &nbsp;
                                        {
                                            !(row.group_id === 0 || row.group_id == null) &&
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => GroupDetailPage(row.group_id)}>
                                                Group
                                            </Button>
                                        }
                                        {
                                            (row.group_id === 0 || row.group_id == null) &&
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => UserDetailPage(row.user_id)}>
                                                User
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {
                            emptyRows > 0 && (
                                <TableRow style={{height: 43 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </StyledTable2>
            </TableContainer>
            <FormControl sx={{width: "100%"}}>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={ticket.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </FormControl>
        </Box>
    );
}
