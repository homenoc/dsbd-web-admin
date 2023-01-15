import { ConnectionDetailData, TemplateData } from '../../../interface'
import {
  Box,
  Button,
  Chip,
  FormControl,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
} from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import {
  DeleteDialog,
  EnableDialog,
} from '../../../pages/Group/GroupDetail/Connection'
import ConnectionGetDialogs from '../../../pages/Connection/ConnectionDetail/ConnectionDialog'
import { useNavigate } from 'react-router-dom'
import { StyledTable1, StyledTypographyHeading } from '../../../style'

export default function Connection(props: {
  data: ConnectionDetailData[] | undefined
  template: TemplateData | undefined
  setReload: Dispatch<SetStateAction<boolean>>
}): any {
  const { data, template, setReload } = props

  return (
    <TableContainer component={Paper}>
      <Toolbar variant="dense">
        <StyledTypographyHeading id="connection">
          Connection
        </StyledTypographyHeading>
      </Toolbar>
      {data === undefined && <h3>データがありません</h3>}
      {template === undefined && <h3>Templateデータを取得できません</h3>}
      {data !== undefined && template !== undefined && (
        <StatusTable
          key={'connection_status_table'}
          setReload={setReload}
          connection={data.sort((a, b) => b.ID - a.ID)}
        />
      )}
    </TableContainer>
  )
}

export function StatusTable(props: {
  connection: ConnectionDetailData[]
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { connection, setReload } = props
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, connection.length - page * rowsPerPage)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const GroupDetailPage = (groupID: number | undefined) => {
    if (groupID !== undefined) {
      navigate('/dashboard/group/' + groupID)
    }
  }

  const getServiceCode = (
    groupID: number | undefined,
    serviceType: string | undefined,
    serviceNum: number | undefined,
    connectionType: string,
    connectionNum: number
  ) => {
    return (
      groupID +
      '-' +
      serviceType +
      ('000' + serviceNum).slice(-3) +
      '-' +
      connectionType +
      ('000' + connectionNum).slice(-3)
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <StyledTable1 size="small" aria-label="connection">
          <TableHead>
            <TableRow>
              <TableCell>ServiceCode</TableCell>
              <TableCell align="right">作成日</TableCell>
              <TableCell align="right">状況</TableCell>
              <TableCell align="right">機能</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? connection.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : connection
            ).map((row) => (
              <TableRow key={'service_detail_' + row.ID}>
                <TableCell style={{ width: 300 }} component="th" scope="row">
                  {row.ID}:{' '}
                  {getServiceCode(
                    row.service?.group_id,
                    row.service?.service_type,
                    row.service?.service_number,
                    row.connection_type,
                    row.connection_number
                  )}
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  {row.CreatedAt}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.enable && row.open && (
                    <Chip size="small" color="primary" label="開通" />
                  )}
                  {row.enable && !row.open && (
                    <Chip size="small" color="secondary" label="未開通" />
                  )}
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  <Box display="flex" justifyContent="flex-end">
                    {row.service !== undefined && (
                      <ConnectionGetDialogs
                        key={'connection_get_dialog_' + row.ID}
                        connection={row}
                        service={row.service}
                        reload={setReload}
                      />
                    )}
                    &nbsp;
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <DeleteDialog
                      key={'connection_delete_alert_dialog_' + row.ID}
                      id={row.ID}
                      reload={setReload}
                    />
                    &nbsp;
                    <EnableDialog
                      key={'connection_enable_alert_dialog_' + row.ID}
                      connection={row}
                      reload={setReload}
                    />
                    &nbsp;
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => GroupDetailPage(row.service?.group_id)}
                    >
                      Group
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 43 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </StyledTable1>
      </TableContainer>
      <FormControl sx={{ width: '100%' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={connection.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </FormControl>
    </Box>
  )
}
