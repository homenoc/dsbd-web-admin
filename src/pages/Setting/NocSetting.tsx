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
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { DefaultNocData, DefaultNocDataArray, NocData } from '../../interface'
import { Delete, GetAll, Post, Put } from '../../api/NOC'
import { StyledCard, StyledTypographyTitle } from '../Dashboard/styles'
import { DeleteAlertDialog } from '../../components/Dashboard/Alert/Alert'

export default function NocSetting() {
  const [nocs, setNocs] = useState(DefaultNocDataArray)
  const [reload, setReload] = useState(true)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState<NocData>(DefaultNocData)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!reload) {
      return
    }
    GetAll().then((res) => {
      if (res.error === '') {
        setNocs(res.data ?? [])
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
      setReload(false)
    })
  }, [reload])

  const openAdd = () => {
    setForm(DefaultNocData)
    setIsEdit(false)
    setOpen(true)
  }

  const openEdit = (noc: NocData) => {
    setForm({ ...noc })
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
    if (form.name === '') {
      enqueueSnackbar('NOC名を入力してください', { variant: 'error' })
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
        NOC 追加
      </Button>
      {nocs.length === 0 && (
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          登録されているNOCはありません
        </Typography>
      )}
      {nocs.map((noc) => (
        <StyledCard key={'noc_' + noc.ID}>
          <CardContent>
            <StyledTypographyTitle color="textSecondary" gutterBottom>
              ID: {noc.ID}
            </StyledTypographyTitle>
            <Typography variant="h5" component="h2">
              {noc.name}
            </Typography>
            <Typography color="textSecondary">
              Location: {noc.location}
            </Typography>
            <Typography color="textSecondary">
              Bandwidth: {noc.bandwidth}
            </Typography>
            <br />
            <Chip
              size="small"
              label={noc.enable ? '有効' : '無効'}
              color={noc.enable ? 'success' : 'error'}
            />
          </CardContent>
          <CardActions>
            <Button size="small" variant="outlined" onClick={() => openEdit(noc)}>
              編集
            </Button>
            <DeleteAlertDialog
              key={'noc_delete_' + noc.ID}
              setDeleteProcess={() => onDelete(noc.ID)}
            />
          </CardActions>
        </StyledCard>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{isEdit ? 'NOC 編集' : 'NOC 追加'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="NOC名"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <TextField
              label="Bandwidth"
              value={form.bandwidth}
              onChange={(e) => setForm({ ...form, bandwidth: e.target.value })}
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
