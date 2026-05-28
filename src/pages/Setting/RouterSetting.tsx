import React, { useEffect, useState } from 'react'
import {
  Button,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import {
  BGPRouterData,
  DefaultBGPRouterData,
  DefaultBGPRouterDataArray,
  DefaultNocDataArray,
} from '../../interface'
import { Delete, GetAll, Post, Put } from '../../api/Router'
import { GetAll as NocGetAll } from '../../api/NOC'
import { StyledCard, StyledTypographyTitle } from '../Dashboard/styles'
import { DeleteAlertDialog } from '../../components/Dashboard/Alert/Alert'

export default function RouterSetting() {
  const [routers, setRouters] = useState(DefaultBGPRouterDataArray)
  const [reload, setReload] = useState(true)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState<BGPRouterData>(DefaultBGPRouterData)
  const [nocs, setNocs] = useState(DefaultNocDataArray)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    NocGetAll().then((res) => {
      if (res.error === '') {
        setNocs(res.data ?? [])
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
  }, [])

  useEffect(() => {
    if (!reload) {
      return
    }
    GetAll().then((res) => {
      if (res.error === '') {
        setRouters(res.data ?? [])
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
      setReload(false)
    })
  }, [reload])

  const nocName = (id: number) =>
    nocs.find((noc) => noc.ID === id)?.name ?? 'NOC#' + id

  const openAdd = () => {
    setForm(DefaultBGPRouterData)
    setIsEdit(false)
    setOpen(true)
  }

  const openEdit = (router: BGPRouterData) => {
    setForm({ ...router })
    setIsEdit(true)
    setOpen(true)
  }

  const onDelete = (id: number) => {
    Delete(id).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Delete Success', { variant: 'success' })
        setReload(true)
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  const onSubmit = () => {
    if (form.hostname === '') {
      enqueueSnackbar('hostnameを入力してください', { variant: 'error' })
      return
    }
    if (form.noc_id === 0) {
      enqueueSnackbar('NOCを選択してください', { variant: 'error' })
      return
    }
    const action = isEdit ? Put(form.ID, form) : Post(form)
    action.then((res) => {
      if (res.error === '') {
        enqueueSnackbar(isEdit ? 'Update Success' : 'Add Success', {
          variant: 'success',
        })
        setOpen(false)
        setReload(true)
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  return (
    <div>
      <Button variant="contained" onClick={openAdd} sx={{ mb: 2 }}>
        BGP Router 追加
      </Button>
      {routers.length === 0 && (
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          登録されているBGP Routerはありません
        </Typography>
      )}
      {routers.map((router) => (
        <StyledCard key={'router_' + router.ID}>
          <CardContent>
            <StyledTypographyTitle color="textSecondary" gutterBottom>
              ID: {router.ID}
            </StyledTypographyTitle>
            <Typography variant="h5" component="h2">
              {router.hostname}
            </Typography>
            <Typography color="textSecondary">
              NOC: {nocName(router.noc_id)}
            </Typography>
            <br />
            <Chip
              size="small"
              label={router.enable ? '有効' : '無効'}
              color={router.enable ? 'success' : 'error'}
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="outlined"
              onClick={() => openEdit(router)}
            >
              編集
            </Button>
            <DeleteAlertDialog
              key={'router_delete_' + router.ID}
              setDeleteProcess={() => onDelete(router.ID)}
            />
          </CardActions>
        </StyledCard>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {isEdit ? 'BGP Router 編集' : 'BGP Router 追加'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="NOC"
              value={form.noc_id}
              onChange={(e) =>
                setForm({ ...form, noc_id: Number(e.target.value) })
              }
            >
              <MenuItem value={0}>選択してください</MenuItem>
              {nocs.map((noc) => (
                <MenuItem key={'noc_' + noc.ID} value={noc.ID}>
                  {noc.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Hostname"
              value={form.hostname}
              onChange={(e) => setForm({ ...form, hostname: e.target.value })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.enable}
                  onChange={(e) =>
                    setForm({ ...form, enable: e.target.checked })
                  }
                />
              }
              label="有効"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={onSubmit}>
            {isEdit ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
