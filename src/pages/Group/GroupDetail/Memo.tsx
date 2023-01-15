import {
  DefaultMemoAddData,
  GroupDetailData,
  MemoData,
} from '../../../interface'
import {
  Button,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { useSnackbar } from 'notistack'
import { Delete, Post } from '../../../api/Memo'
import { StyledButton1, StyledCardRoot1, StyledDivMemo } from '../../../style'

export function GroupMemo(props: {
  data: GroupDetailData
  reload: Dispatch<SetStateAction<boolean>>
}): any {
  const [detailOpenMemoDialog, setDetailOpenMemoDialog] = React.useState(false)
  const [openAddMemoDialog, setAddOpenMemoDialog] = React.useState(false)
  const [memoData, setMemoData] = React.useState<MemoData>()
  const { data, reload } = props
  const { enqueueSnackbar } = useSnackbar()

  const handleDelete = (id: number) => {
    Delete(id).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
        reload(true)
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  const handleClickDetail = (data: MemoData) => {
    setMemoData(data)
    setDetailOpenMemoDialog(true)
  }

  const getColor = (type: number) => {
    if (type === 1) {
      return 'secondary'
    }
    if (type === 2) {
      return 'primary'
    }
    if (type === 3) {
      return 'default'
    }
    return 'default'
  }

  return (
    <StyledCardRoot1>
      <CardContent>
        <StyledDivMemo>
          {data.memos?.map((memo) => (
            <Chip
              key={'memo_' + memo.ID}
              label={memo.title}
              clickable
              color={getColor(memo.type)}
              onClick={() => handleClickDetail(memo)}
              onDelete={() => handleDelete(memo.ID)}
            />
          ))}
        </StyledDivMemo>
        <br />
        <StyledButton1
          size="small"
          aria-haspopup="true"
          color={'primary'}
          variant={'contained'}
          onClick={() => setAddOpenMemoDialog(true)}
        >
          Memoの追加
        </StyledButton1>
        <MemoAddDialogs
          key={'memo_add_dialog'}
          open={openAddMemoDialog}
          setOpen={setAddOpenMemoDialog}
          baseData={data}
          reload={reload}
        />
        {memoData !== undefined && (
          <MemoDetailDialogs
            key={'memo_detail_dialog'}
            open={detailOpenMemoDialog}
            setOpen={setDetailOpenMemoDialog}
            data={memoData}
          />
        )}
      </CardContent>
      <Divider />
    </StyledCardRoot1>
  )
}

export function MemoAddDialogs(props: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  baseData: GroupDetailData
  reload: Dispatch<SetStateAction<boolean>>
}) {
  const { open, setOpen, baseData, reload } = props
  const [data, setData] = React.useState(DefaultMemoAddData)
  const { enqueueSnackbar } = useSnackbar()

  const request = () => {
    data.group_id = baseData.ID
    Post(baseData.ID, data).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
        setOpen(false)
        reload(true)
      } else {
        enqueueSnackbar(res.error, { variant: 'error' })
      }
    })
  }

  return (
    <div>
      <Dialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          style: {
            backgroundColor: '#2b2a2a',
          },
        }}
      >
        <DialogTitle id="customized-dialog-title">Memoの追加</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="title"
                label="Memo Title"
                type="search"
                variant="outlined"
                inputProps={{ maxLength: 10 }}
                value={data.title}
                onChange={(event) => {
                  setData({ ...data, title: event.target.value })
                }}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <TextField
                id="message"
                label="Memo Message"
                multiline
                rows={4}
                inputProps={{ maxLength: 200 }}
                variant="outlined"
                value={data.message}
                onChange={(event) => {
                  setData({ ...data, message: event.target.value })
                }}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup
                  row
                  aria-label="type"
                  name="type"
                  defaultValue="top"
                  value={data.type}
                  onChange={(event) => {
                    setData({ ...data, type: Number(event.target.value) })
                  }}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio color="primary" />}
                    label="Important(Red)"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio color="primary" />}
                    label="Comment1(Blue)"
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio color="primary" />}
                    label="Comment2(Gray)"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
          <Button autoFocus onClick={() => request()} color="primary">
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export function MemoDetailDialogs(props: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  data: MemoData
}) {
  const { open, setOpen, data } = props

  return (
    <div>
      <Dialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          style: {
            backgroundColor: '#2b2a2a',
          },
        }}
      >
        <DialogTitle id="customized-dialog-title">{data.title}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {data.message}
              <br />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
