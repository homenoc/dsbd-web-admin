import React, { Dispatch, SetStateAction } from 'react'
import { useSnackbar } from 'notistack'
import { Delete, Put } from '../../../api/Connection'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { ConnectionDetailData, ServiceDetailData } from '../../../interface'
import { GetConnectionWithTemplate } from '../../../api/Tool'
import { useNavigate } from 'react-router-dom'
import { GenServiceCodeFromService } from '../../../components/Tool'

export function RowConnectionCheck(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props

  if (service.connections === undefined) {
    return (
      <div>
        <p>データがありません。</p>
      </div>
    )
  }
  return (
    <div>
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
          key={'connection_table'}
          service={service}
          setReload={setReload}
        />
      </Table>
    </div>
  )
}

export function RowConnection(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const navigate = useNavigate()
  const { service, setReload } = props
  const clickConnectionPage = (id: number) =>
    navigate('/dashboard/connection/' + id)
  const serviceCode = (connection: ConnectionDetailData) =>
    GenServiceCodeFromService(service, connection)

  return (
    <TableBody>
      {service.connections?.map((connection: ConnectionDetailData) => (
        <TableRow key={connection.ID}>
          <TableCell component="th" scope="row" align="left">
            {connection.ID}
          </TableCell>
          <TableCell align="left">{serviceCode(connection)}</TableCell>
          <TableCell align="left">
            {GetConnectionWithTemplate(connection.connection_type)?.name}
          </TableCell>
          <TableCell align="left">
            {!connection.enable && (
              <Chip size="small" color="secondary" label="無効" />
            )}
            {connection.enable && connection.open && (
              <Chip size="small" color="primary" label="開通" />
            )}
            {connection.enable && !connection.open && (
              <Chip size="small" color="secondary" label="未開通" />
            )}
          </TableCell>
          <TableCell align="right">
            <Box display="flex" justifyContent="flex-end">
              <Button
                size="small"
                variant="outlined"
                onClick={() => clickConnectionPage(connection.ID)}
              >
                Detail
              </Button>
              &nbsp;
              <DeleteDialog
                key={'connection_delete_alert_dialog_' + connection.ID}
                id={connection.ID}
                setReload={setReload}
              />
              &nbsp;
              <EnableDialog
                key={'connection_enable_alert_dialog_' + connection.ID}
                connection={connection}
                setReload={setReload}
              />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export function DeleteDialog(props: {
  id: number
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { id, setReload } = props
  const [open, setOpen] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const deleteConnection = () => {
    Delete(id).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
      setOpen(false)
      setReload(true)
    })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button
        size="small"
        variant="outlined"
        color={'secondary'}
        onClick={handleClickOpen}
      >
        Delete
      </Button>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">削除</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            本当に削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            いいえ
          </Button>
          <Button onClick={deleteConnection} color="primary">
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export function EnableDialog(props: {
  connection: ConnectionDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { connection, setReload } = props
  const [open, setOpen] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const updateConnection = () => {
    const tmp = connection
    tmp.enable = !connection.enable
    Put(connection.ID, tmp).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
      setOpen(false)
      setReload(true)
    })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button
        size="small"
        variant="outlined"
        color={connection.enable ? 'secondary' : 'primary'}
        onClick={handleClickOpen}
      >
        {connection.enable && 'Disable'}
        {!connection.enable && 'Enable'}
      </Button>
      <Dialog
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="connection-enable-dialog-title"
        aria-describedby="connection-enable-dialog-description"
      >
        <DialogTitle id="connection-enable-dialog-title">Enable</DialogTitle>
        <DialogContent>
          <DialogContentText id="connection-enable-dialog-description">
            {connection.enable && '有効から無効に変更します。'}
            {!connection.enable && '無効から有効に変更します。'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            いいえ
          </Button>
          <Button onClick={updateConnection} color="primary">
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
