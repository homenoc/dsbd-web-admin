import { GroupDetailData, UserDetailData } from '../../../interface'
import {
  Box,
  Button,
  Chip,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StyledTable2, StyledTypographyHeading } from '../../../style'

export default function User(props: { data: GroupDetailData }): any {
  const { data } = props

  return (
    <TableContainer component={Paper}>
      <Toolbar variant="dense">
        <StyledTypographyHeading id="tableTitle">Users</StyledTypographyHeading>
      </Toolbar>
      {data.users === undefined && <h3>データがありません</h3>}
      {data.users !== undefined && (
        <StatusTable key={'user_status_table'} user={data.users} />
      )}
    </TableContainer>
  )
}

export function StatusTable(props: { user: UserDetailData[] }) {
  const { user } = props
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, user.length - page * rowsPerPage)

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

  const UserPage = (id: number) => navigate('/dashboard/user/' + id)

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <StyledTable2 size="small" aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">E-Mail</TableCell>
              <TableCell align="right">状況</TableCell>
              <TableCell align="right">機能</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? user.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : user
            ).map((row) => (
              <TableRow key={'user_detail_id_' + row.ID}>
                <TableCell style={{ width: 300 }} component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  {row.email}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.mail_verify && (
                    <Chip size="small" color="primary" label="確認済" />
                  )}
                  {!row.mail_verify && (
                    <Chip size="small" color="secondary" label="未確認" />
                  )}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => UserPage(row.ID)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 43 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </StyledTable2>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={user.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}
