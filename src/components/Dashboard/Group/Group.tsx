import { GroupDetailData } from '../../../interface'
import React, { Dispatch, SetStateAction } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { StyledTable2, StyledTypographyHeading } from '../../../style'

export function Group(props: {
  data: GroupDetailData[] | undefined
  setReload: Dispatch<SetStateAction<boolean>>
}): any {
  const { data, setReload } = props
  const nowDate = new Date()

  return (
    <TableContainer component={Paper}>
      <Toolbar variant="dense">
        <StyledTypographyHeading id="groups">Groups</StyledTypographyHeading>
      </Toolbar>
      {data === undefined && <h3>データがありません</h3>}
      {data !== undefined && (
        <StatusTable
          key={'group_status_table'}
          setReload={setReload}
          group={data.filter((item) => {
            if (item.member_expired === '' || item.member_expired == null) {
              return true
            }
            if (!item.pass) {
              return true
            }
            const tmp = item.member_expired.split('T')
            const tmpDate = new Date(tmp[0])

            return !(nowDate < tmpDate)
          })}
        />
      )}
    </TableContainer>
  )
}

export function StatusTable(props: {
  group: GroupDetailData[]
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { group } = props
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const nowDate = new Date()

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, group.length - page * rowsPerPage)

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

  const GroupPage = (id: number) => navigate('/dashboard/group/' + id)

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <StyledTable2 size="small" aria-label="group_table">
          <TableHead>
            <TableRow>
              <TableCell>申請内容</TableCell>
              <TableCell align="right">作成日</TableCell>
              <TableCell align="right">状況</TableCell>
              <TableCell align="right">機能</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? group.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : group
            ).map((row, index) => (
              <TableRow key={'group_detail_' + index}>
                <TableCell style={{ width: 300 }} component="th" scope="row">
                  {row.ID}: {row.org}({row.org_en})
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  {row.CreatedAt}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {!row.pass && (
                    <Chip size="small" color="secondary" label="Group未承認" />
                  )}
                  {row.member_expired == null && (
                    <Chip size="small" color="secondary" label="未払い状態" />
                  )}
                  {row.member_expired != null &&
                    new Date(row.member_expired) < nowDate && (
                      <Chip
                        size="small"
                        color="secondary"
                        label={'期限切れ: ' + row.member_expired}
                      />
                    )}
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => GroupPage(row.ID)}
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
      <FormControl sx={{ width: '100%' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={group.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </FormControl>
    </Box>
  )
}
