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
  DefaultNocDataArray,
  DefaultTunnelEndPointRouterDataArray,
  DefaultTunnelEndPointRouterIPDataArray,
  TunnelEndPointRouterData,
  TunnelEndPointRouterIPData,
} from '../../interface'
import {
  Delete,
  GetAll,
  Post,
  Put,
} from '../../api/Gateway'
import {
  GetAll as IPGetAll,
  Post as IPPost,
  Put as IPPut,
} from '../../api/GatewayIP'
import { GetAll as NocGetAll } from '../../api/NOC'
import { StyledCard, StyledTypographyTitle } from '../Dashboard/styles'
import { DeleteAlertDialog } from '../../components/Dashboard/Alert/Alert'

interface GatewayForm {
  ID: number
  noc_id: number
  hostname: string
  capacity: number
  enable: boolean
  comment: string
  ip_id: number
  ip: string
  ip_enable: boolean
  ip_comment: string
}

const DefaultGatewayForm: GatewayForm = {
  ID: 0,
  noc_id: 0,
  hostname: '',
  capacity: 0,
  enable: false,
  comment: '',
  ip_id: 0,
  ip: '',
  ip_enable: false,
  ip_comment: '',
}

export default function GatewaySetting() {
  const [gateways, setGateways] = useState(DefaultTunnelEndPointRouterDataArray)
  const [ips, setIps] = useState(DefaultTunnelEndPointRouterIPDataArray)
  const [nocs, setNocs] = useState(DefaultNocDataArray)
  const [reload, setReload] = useState(true)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState<GatewayForm>(DefaultGatewayForm)
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
        setGateways(res.data ?? [])
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
    IPGetAll().then((res) => {
      if (res.error === '') {
        setIps(res.data ?? [])
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
      setReload(false)
    })
  }, [reload])

  const nocName = (id: number) =>
    nocs.find((noc) => noc.ID === id)?.name ?? 'NOC#' + id

  const gatewayIps = (id: number) =>
    ips.filter((ip) => ip.tunnel_endpoint_router_id === id)

  const openAdd = () => {
    setForm(DefaultGatewayForm)
    setIsEdit(false)
    setOpen(true)
  }

  const openEdit = (gateway: TunnelEndPointRouterData) => {
    const ip = gatewayIps(gateway.ID)[0]
    setForm({
      ID: gateway.ID,
      noc_id: gateway.noc_id,
      hostname: gateway.hostname,
      capacity: gateway.capacity,
      enable: gateway.enable,
      comment: gateway.comment,
      ip_id: ip?.ID ?? 0,
      ip: ip?.ip ?? '',
      ip_enable: gateway.enable,
      ip_comment: ip?.comment ?? '',
    })
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

  const gatewayPayload = (): TunnelEndPointRouterData => ({
    ID: form.ID,
    noc_id: form.noc_id,
    hostname: form.hostname,
    capacity: form.capacity,
    enable: form.enable,
    comment: form.comment,
  })

  const ipPayload = (
    gatewayID: number,
    id: number
  ): TunnelEndPointRouterIPData => ({
    ID: id,
    tunnel_endpoint_router_id: gatewayID,
    ip: form.ip,
    enable: form.ip_enable,
    comment: form.ip_comment,
  })

  const onSubmit = async () => {
    if (form.hostname === '') {
      enqueueSnackbar('hostnameを入力してください', { variant: 'error' })
      return
    }
    if (form.noc_id === 0) {
      enqueueSnackbar('NOCを選択してください', { variant: 'error' })
      return
    }

    if (isEdit) {
      const res = await Put(form.ID, gatewayPayload())
      if (res.error !== '') {
        enqueueSnackbar(String(res.error), { variant: 'error' })
        return
      }
      if (form.ip !== '') {
        const ipRes =
          form.ip_id !== 0
            ? await IPPut(form.ip_id, ipPayload(form.ID, form.ip_id))
            : await IPPost(ipPayload(form.ID, 0))
        if (ipRes.error !== '') {
          enqueueSnackbar('Gatewayは更新されました。IPの保存に失敗: ' + ipRes.error, {
            variant: 'error',
          })
          setReload(true)
          return
        }
      }
      enqueueSnackbar('Update Success', { variant: 'success' })
    } else {
      // 新規Gateway特定のため、POST直前に最新IDを取得する(stateの陳腐化対策)
      const before = await GetAll()
      if (before.error !== '') {
        enqueueSnackbar(String(before.error), { variant: 'error' })
        return
      }
      const beforeIDs = new Set(
        (before.data ?? []).map((g: TunnelEndPointRouterData) => g.ID)
      )
      const res = await Post(gatewayPayload())
      if (res.error !== '') {
        enqueueSnackbar(String(res.error), { variant: 'error' })
        return
      }
      if (form.ip !== '') {
        const after = await GetAll()
        if (after.error !== '') {
          enqueueSnackbar(String(after.error), { variant: 'error' })
          setReload(true)
          return
        }
        const created = (after.data ?? []).filter(
          (g: TunnelEndPointRouterData) => !beforeIDs.has(g.ID)
        )
        if (created.length !== 1) {
          enqueueSnackbar(
            'Gatewayは追加されました。新規Gatewayを特定できなかったため、Gateway編集からIPを登録してください',
            { variant: 'warning' }
          )
          setOpen(false)
          setReload(true)
          return
        }
        const ipRes = await IPPost(ipPayload(created[0].ID, 0))
        if (ipRes.error !== '') {
          enqueueSnackbar(
            'Gatewayは追加されました。IPの保存に失敗したため、Gateway編集から登録してください: ' +
              ipRes.error,
            { variant: 'error' }
          )
          setReload(true)
          return
        }
      }
      enqueueSnackbar('Add Success', { variant: 'success' })
    }
    setOpen(false)
    setReload(true)
  }

  return (
    <div>
      <Button variant="contained" onClick={openAdd} sx={{ mb: 2 }}>
        Gateway 追加
      </Button>
      {gateways.length === 0 && (
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          登録されているGatewayはありません
        </Typography>
      )}
      {gateways.map((gateway) => (
        <StyledCard key={'gateway_' + gateway.ID}>
          <CardContent>
            <StyledTypographyTitle color="textSecondary" gutterBottom>
              ID: {gateway.ID}
            </StyledTypographyTitle>
            <Typography variant="h5" component="h2">
              {gateway.hostname}
            </Typography>
            <Typography color="textSecondary">
              NOC: {nocName(gateway.noc_id)}
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              IP:
            </Typography>
            {gatewayIps(gateway.ID).length === 0 && (
              <Typography color="textSecondary" variant="body2">
                (未登録)
              </Typography>
            )}
            {gatewayIps(gateway.ID).map((ip) => (
              <Typography
                key={'gateway_ip_' + ip.ID}
                color="textSecondary"
                variant="body2"
              >
                {ip.ip}
              </Typography>
            ))}
            <br />
            <Chip
              size="small"
              label={gateway.enable ? '有効' : '無効'}
              color={gateway.enable ? 'success' : 'error'}
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="outlined"
              onClick={() => openEdit(gateway)}
            >
              編集
            </Button>
            <DeleteAlertDialog
              key={'gateway_delete_' + gateway.ID}
              setDeleteProcess={() => onDelete(gateway.ID)}
            />
          </CardActions>
        </StyledCard>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{isEdit ? 'Gateway 編集' : 'Gateway 追加'}</DialogTitle>
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
            <TextField
              label="IP"
              value={form.ip}
              helperText="空欄の場合はIPを登録しません"
              onChange={(e) => setForm({ ...form, ip: e.target.value })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.enable}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      enable: e.target.checked,
                      ip_enable: e.target.checked,
                    })
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
