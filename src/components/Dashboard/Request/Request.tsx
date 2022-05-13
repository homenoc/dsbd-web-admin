import {TicketDetailData} from "../../../interface";
import {
    Box,
    Button, Chip,
    FormControl,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    Toolbar
} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {useNavigate} from "react-router-dom";
import {Put} from "../../../api/Support";
import {useSnackbar} from "notistack";
import {StyledTable2, StyledTypographyHeading} from "../../../style";


export default function Request(props: {
    data: TicketDetailData[] | undefined
    setReload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, setReload} = props;

    return (
        <TableContainer component={Paper}>
            <Toolbar variant="dense">
                <StyledTypographyHeading id="requests">
                    Requests
                </StyledTypographyHeading>
            </Toolbar>
            {
                data === undefined && <h3>データがありません</h3>
            }
            {
                data !== undefined &&
                <StatusTable
                    key={"request_status_table"}
                    setReload={setReload}
                    ticket={data.filter(item => item.request).sort((a, b) => b.ID - a.ID)}
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, ticket.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const GroupDetailPage = (groupID: number) => {
        navigate('/dashboard/group/' + groupID);
    }

    const UserDetailPage = (userID: number) => {
        navigate('/dashboard/user/' + userID);
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const ChatPage = (id: number) => navigate("/dashboard/support/" + id);

    const clickChangeStatus = (id: number, solved: boolean, request_reject: boolean) => {
        Put(id, {solved, request_reject}).then(res => {
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
                                    <TableCell style={{width: 300}} component="th" scope="row">
                                        {row.ID}: {row.title}
                                    </TableCell>
                                    <TableCell style={{width: 300}} align="right">
                                        {row.CreatedAt}
                                    </TableCell>
                                    <TableCell style={{width: 160}} align="right">
                                        {
                                            row.request_reject &&
                                            <Chip size="small" color="secondary" label="却下"/>
                                        }
                                        {
                                            !row.request_reject && !row.solved &&
                                            <Chip size="small" color="primary" label="申請中"/>
                                        }
                                        {
                                            !row.request_reject && row.solved &&
                                            <Chip size="small" color="primary" label="承諾/変更済み"/>
                                        }
                                    </TableCell>
                                    <TableCell style={{width: 350}} align="right">
                                        {
                                            (row.request_reject || row.solved) &&
                                            <Button
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => clickChangeStatus(row.ID, false, false)}>
                                                申請中
                                            </Button>
                                        }
                                        {
                                            !row.request_reject && !row.solved &&
                                            <Button
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => clickChangeStatus(row.ID, true, false)}>
                                                変更/承諾済み
                                            </Button>
                                        }
                                        &nbsp;
                                        {
                                            !row.request_reject && !row.solved &&
                                            <Button
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                                onClick={() => clickChangeStatus(row.ID, false, true)}>
                                                却下
                                            </Button>
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
