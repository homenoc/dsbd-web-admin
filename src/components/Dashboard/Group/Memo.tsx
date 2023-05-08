import { GroupDetailData, MemoData } from '../../../interface'
import React, { Dispatch, SetStateAction } from 'react'
import {
  Box,
  Button,
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
import { Delete } from '../../../api/Memo'
import { useSnackbar } from 'notistack'
import { MemoDetailDialogs } from '../../../pages/Group/GroupDetail/Memo'
import {
  StyledChip2,
  StyledTable2,
  StyledTypographyHeading,
} from '../../../style'

export function MemoGroup(props: {
  data: GroupDetailData[] | undefined
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { data, setReload } = props

  return (
    <TableContainer component={Paper}>
      <Toolbar variant="dense">
        <StyledTypographyHeading id="groups_memo">
          Groups(Memo)
        </StyledTypographyHeading>
      </Toolbar>
      {data === undefined && <h3>データがありません</h3>}
      {data !== undefined && (
        <StatusTable
          key={'group_memo_status_table'}
          setReload={setReload}
          group={data.filter((grp) => {
            const tmp = grp.memos?.filter((memo) => memo.type === 1)
            if (tmp === undefined) {
              return false
            }
            return tmp.length !== 0
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
  const { group, setReload } = props
  const navigate = useNavigate()
  const [detailOpenMemoDialog, setDetailOpenMemoDialog] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [memoData, setMemoData] = React.useState<MemoData>()
  const { enqueueSnackbar } = useSnackbar()

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

  const handleDelete = (id: number) => {
    Delete(id).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
        setReload(true)
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  const handleClickDetail = (data: MemoData) => {
    setMemoData(data)
    setDetailOpenMemoDialog(true)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <StyledTable2 size="small" aria-label="memo_group">
          <TableHead>
            <TableRow>
              <TableCell>Memo内容</TableCell>
              <TableCell>Org</TableCell>
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
              <TableRow key={'group_memo_detail_' + index}>
                <TableCell style={{ width: 700 }} component="th" scope="row">
                  {row.memos
                    ?.filter((memo) => memo.type === 1)
                    .map((memo) => (
                      <StyledChip2
                        key={'memo_' + memo.ID}
                        label={memo.title}
                        clickable
                        color={'secondary'}
                        onClick={() => handleClickDetail(memo)}
                        onDelete={() => handleDelete(memo.ID)}
                      />
                    ))}
                </TableCell>
                <TableCell style={{ width: 300 }} align="left">
                  {row.ID}: {row.org}({row.org_en})
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  &nbsp;
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
        {memoData !== undefined && (
          <MemoDetailDialogs
            key={'memo_detail_dialog'}
            open={detailOpenMemoDialog}
            setOpen={setDetailOpenMemoDialog}
            data={memoData}
          />
        )}
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
