import { ServiceDetailData, TemplateData } from '../../../interface'
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
  ExaminationDialog,
} from '../../../pages/Group/GroupDetail/Service'
import { useNavigate } from 'react-router-dom'
import { StyledTable2, StyledTypographyHeading } from '../../../style'
import { GenServiceCodeOnlyService } from '../../Tool'

export default function Service(props: {
  data: ServiceDetailData[] | undefined
  template: TemplateData | undefined
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { data, template, setReload } = props

  return (
    <TableContainer component={Paper}>
      <Toolbar variant="dense">
        <StyledTypographyHeading id="services">
          Services
        </StyledTypographyHeading>
      </Toolbar>
      {data === undefined && <h3>データがありません</h3>}
      {template === undefined && <h3>Templateデータを取得できません</h3>}
      {data !== undefined && template !== undefined && (
        <StatusTable
          key={'service_status_table'}
          setReload={setReload}
          service={data.sort((a, b) => b.ID - a.ID)}
        />
      )}
    </TableContainer>
  )
}

export function StatusTable(props: {
  service: ServiceDetailData[]
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const navigate = useNavigate()

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, service.length - page * rowsPerPage)

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

  const clickGroupPage = (id: number) => navigate('/dashboard/group/' + id)
  const clickServicePage = (id: number) => navigate('/dashboard/service/' + id)

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <StyledTable2 size="small" aria-label="service_table">
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
              ? service.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : service
            ).map((row, index) => (
              <TableRow key={'service_detail_' + index}>
                <TableCell style={{ width: 300 }} component="th" scope="row">
                  {row.ID}: {GenServiceCodeOnlyService(row)}
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  {row.CreatedAt}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {!row.pass && (
                    <Chip size="small" color="secondary" label="未審査" />
                  )}
                  {row.pass && (
                    <Chip size="small" color="primary" label="審査済み" />
                  )}
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  <Box display="flex" justifyContent="flex-end">
                    {!row.pass && (
                      <ExaminationDialog
                        key={'service_examination_dialog_' + index}
                        service={row}
                        reload={setReload}
                      />
                    )}
                    &nbsp;
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => clickServicePage(row.ID)}
                    >
                      Detail
                    </Button>
                    &nbsp;
                    <DeleteDialog
                      key={'service_delete_dialog_' + index}
                      id={row.ID}
                      reload={setReload}
                    />
                    &nbsp;
                    <EnableDialog
                      key={'service_enable_dialog_' + row.ID}
                      service={row}
                      reload={setReload}
                    />
                    &nbsp;
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => clickGroupPage(row.group_id)}
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
        </StyledTable2>
      </TableContainer>
      <FormControl sx={{ width: '100%' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={service.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </FormControl>
    </Box>
  )
}
