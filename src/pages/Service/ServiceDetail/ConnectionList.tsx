import { ConnectionDetailData } from '../../../interface'
import React, { Dispatch, SetStateAction } from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { RowConnection } from "../../Group/GroupDetail/Connection";

export function ConnectionList(props: {
  connections: ConnectionDetailData[]
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { connections, setReload } = props

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
        <TableBody>
          {connections.map((connection: ConnectionDetailData) => (
            <RowConnection
              key={'connection_' + connection.ID}
              connection={connection}
              setReload={setReload}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
