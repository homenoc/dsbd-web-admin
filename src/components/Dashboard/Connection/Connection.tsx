import useStyles from "../../../pages/Group/GroupDetail/styles";
import {ConnectionDetailData, TemplateData} from "../../../interface";
import {
    Box,
    Chip, IconButton,
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
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import {DeleteDialog, EnableDialog} from "../../../pages/Group/GroupDetail/Connection";
import ConnectionGetDialogs from "../../../pages/Connection/ConnectionDetail/ConnectionDialog";


export default function Connection(props: {
    data: ConnectionDetailData[] | undefined
    template: TemplateData | undefined
    setReload: Dispatch<SetStateAction<boolean>>
}): any {
    const {data, template, setReload} = props;
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Toolbar variant="dense">
                <Typography className={classes.heading} id="connection" component="div">
                    Connection
                </Typography>
            </Toolbar>
            {
                data === undefined && <h3>データがありません</h3>
            }
            {
                template === undefined && <h3>Templateデータを取得できません</h3>
            }
            {
                data !== undefined && template !== undefined &&
                <StatusTable
                    key={"connection_status_table"}
                    setReload={setReload}
                    template={template}
                    connection={data.sort((a, b) => b.ID - a.ID)}
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
    connection: ConnectionDetailData[]
    template: TemplateData
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const {connection, template, setReload} = props;
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, connection.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getServiceCode = (
        groupID: number | undefined,
        serviceType: string | undefined,
        serviceNum: number | undefined,
        connectionType: string,
        connectionNum: number
    ) => {
        return groupID + "-" + serviceType + ('000' + serviceNum).slice(-3) + "-" + connectionType + ('000' + connectionNum).slice(-3);
    }


    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="connection">
                <TableHead>
                    <TableRow>
                        <TableCell>ServiceCode</TableCell>
                        <TableCell align="right">作成日</TableCell>
                        <TableCell align="right">状況</TableCell>
                        <TableCell align="right">機能</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        (
                            rowsPerPage > 0
                                ? connection.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : connection
                        ).map((row) => (
                            <TableRow key={"service_detail_" + row.ID}>
                                <TableCell style={{width: 300}} component="th" scope="row">
                                    {row.ID}: {getServiceCode(row.service?.group_id, row.service?.service_template.type, row.service?.service_number,
                                    row.connection_template.type, row.connection_number)}
                                </TableCell>
                                <TableCell style={{width: 300}} align="right">
                                    {row.CreatedAt}
                                </TableCell>
                                <TableCell style={{width: 160}} align="right">
                                    {
                                        row.enable && row.open &&
                                        <Chip
                                            size="small"
                                            color="primary"
                                            label="開通"
                                        />
                                    }
                                    {
                                        row.enable && !row.open &&
                                        <Chip
                                            size="small"
                                            color="secondary"
                                            label="未開通"
                                        />
                                    }
                                </TableCell>
                                <TableCell style={{width: 300}} align="right">
                                    <Box display="flex" justifyContent="flex-end">
                                        {
                                            row.service !== undefined &&
                                            <ConnectionGetDialogs
                                                key={"connection_get_dialog_" + row.ID}
                                                connection={row}
                                                service={row.service}
                                                template={template}
                                                reload={setReload}
                                            />
                                        }
                                        &nbsp;
                                        <DeleteDialog
                                            key={"connection_delete_alert_dialog_" + row.ID}
                                            id={row.ID}
                                            reload={setReload}
                                        />
                                        &nbsp;
                                        <EnableDialog
                                            key={"connection_enable_alert_dialog_" + row.ID}
                                            connection={row}
                                            reload={setReload}
                                        />
                                    </Box>
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
                            count={connection.length}
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