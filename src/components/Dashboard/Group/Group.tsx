import {GroupDetailData} from "../../../interface";
import React, {Dispatch, SetStateAction} from "react";
import useStyles from "../../../pages/Group/GroupDetail/styles";
import {
    Button, Chip,
    IconButton,
    Paper,
    Table, TableBody, TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow,
    Toolbar,
    Typography,
    useTheme
} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {useHistory} from "react-router-dom";

export function Group(props: {
    data: GroupDetailData[] | undefined
    setReload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, setReload} = props;
    const classes = useStyles();
    const nowDate = new Date()

    return (
        <TableContainer component={Paper}>
            <Toolbar variant="dense">
                <Typography className={classes.heading} id="groups" component="div">
                    Groups
                </Typography>
            </Toolbar>
            {
                data === undefined && <h3>データがありません</h3>
            }
            {
                data !== undefined &&
                <StatusTable
                    key={"group_status_table"}
                    setReload={setReload}
                    group={data.filter(item => {
                        if (item.member_expired === "" || item.member_expired == null) {
                            return true
                        } else {
                            const tmp = item.member_expired.split('T');
                            const tmpDate = new Date(tmp[0]);

                            return nowDate < tmpDate
                        }
                    })}
                />
            }
        </TableContainer>
    )
}

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
    group: GroupDetailData[]
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const {group} = props;
    const classes = useStyles2();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, group.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const GroupPage = (id: number) => history.push("/dashboard/group/" + id);

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="group_table">
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
                                ? group.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : group
                        ).map((row, index) => (
                            <TableRow key={"group_detail_" + index}>
                                <TableCell style={{width: 300}} component="th" scope="row">
                                    {row.ID}: {row.org}({row.org_en})
                                </TableCell>
                                <TableCell style={{width: 300}} align="right">
                                    {row.CreatedAt}
                                </TableCell>
                                <TableCell style={{width: 160}} align="right">
                                    {
                                        (row.member_expired == null || row.member_expired !== "") &&
                                        <Chip size="small" color="secondary" label="未払い状態"/>
                                    }
                                    {
                                        !(row.member_expired == null || row.member_expired !== "") &&
                                        <div>
                                            <Chip size="small" color="secondary" label={"期限切れ: " + row.member_expired}/>
                                        </div>
                                    }
                                </TableCell>
                                <TableCell style={{width: 300}} align="right">
                                    <Button size="small" variant="outlined"
                                            onClick={() => GroupPage(row.ID)}>Detail</Button>
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
                            count={group.length}
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
