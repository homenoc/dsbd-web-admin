import useStyles from "../../../pages/Group/GroupDetail/styles";
import {TicketDetailData} from "../../../interface";
import {
    Button, Chip, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow,
    Toolbar, Typography, useTheme
} from "@material-ui/core";
import React, {Dispatch, SetStateAction} from "react";
import {useHistory} from "react-router-dom";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import {Put} from "../../../api/Support";
import {useSnackbar} from "notistack";


export default function Request(props: {
    data: TicketDetailData[] | undefined
    setReload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, setReload} = props;
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Toolbar variant="dense">
                <Typography className={classes.heading} id="requests" component="div">
                    Requests
                </Typography>
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

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </div>
    );
}

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export function StatusTable(props: {
    ticket: TicketDetailData[]
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const {ticket, setReload} = props;
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, ticket.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const GroupDetailPage = (groupID: number) => {
        history.push('/dashboard/group/' + groupID);
    }

    const UserDetailPage = (userID: number) => {
        history.push('/dashboard/user/' + userID);
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const ChatPage = (id: number) => history.push("/dashboard/support/" + id);

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
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="custom pagination table">
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
                                        row.group_id !== 0 &&
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => GroupDetailPage(row.group_id)}>
                                            Group
                                        </Button>
                                    }
                                    {
                                        row.group_id === 0 &&
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
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                            colSpan={4}
                            count={ticket.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {'aria-label': 'rows per page'},
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}