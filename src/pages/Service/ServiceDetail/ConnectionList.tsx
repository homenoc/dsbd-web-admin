import { ServiceDetailData } from '../../../interface'
import React, { Dispatch, SetStateAction } from 'react'
import {
  Card,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { RowConnection } from '../../Group/GroupDetail/Connection'

export function ConnectionList(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props
  return (
    <Card>
      <Typography variant="h6" gutterBottom component="div">
        Connection
      </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Service Code</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Tag</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <RowConnection
          key={'table_connection'}
          service={service}
          setReload={setReload}
        />
      </Table>
    </Card>
  )
}
