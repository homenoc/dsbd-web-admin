import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import {
  DefaultTemplateData,
  DefaultTicketAddData,
  TemplateData,
} from '../../interface'
import Dashboard from '../../components/Dashboard/Dashboard'
import { useSnackbar } from 'notistack'
import { Post } from '../../api/Support'
import { GetTemplate } from '../../api/Group'
import { MailAutoSendDialogs } from '../Group/Mail'
import { StyledTextFieldVeryLong } from '../Dashboard/styles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate } from 'react-router-dom'

export default function SupportAdd() {
  const [data, setData] = React.useState(DefaultTicketAddData)
  const [template, setTemplate] = React.useState(DefaultTemplateData)
  const { enqueueSnackbar } = useSnackbar()
  const [openMailAutoSendDialog, setOpenMailAutoSendDialog] = useState('')
  const [sendAutoEmail, setSendAutoEmail] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (template !== undefined) {
      GetTemplate().then((res) => {
        if (res.error === '') {
          setTemplate(res.data)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
    }
  }, [template])

  useEffect(() => {
    if (name !== '' && !openMailAutoSendDialog) {
      navigate('/dashboard/support')
    }
  }, [openMailAutoSendDialog])

  const request = () => {
    if (data.is_group && data.group_id === 0) {
      enqueueSnackbar('Groupが指定されていません。', { variant: 'error' })
      return
    }
    if (!data.is_group && data.user_id === 0) {
      enqueueSnackbar('Userが指定されていません。', { variant: 'error' })
      return
    }
    if (data.title === '') {
      enqueueSnackbar('タイトルが入力されていません。', { variant: 'error' })
      return
    }
    if (data.data === '') {
      enqueueSnackbar('本文が入力されていません。', { variant: 'error' })
      return
    }

    Post(data).then((res) => {
      if (res.error === undefined) {
        enqueueSnackbar('OK', { variant: 'success' })
        setOpenMailAutoSendDialog('new_ticket_from_admin')
      }
      enqueueSnackbar(res.error, { variant: 'error' })
    })
  }

  return (
    <Dashboard title="Support Add">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h3>ユーザチャットとグループチャットの違い</h3>
          <div>ユーザチャット: ログインユーザと1対1のチャットになります。</div>
          <div>
            グループチャットチャット:
            ログインユーザのグループとのチャット（基本はこちらでお願いします。）
          </div>
        </Grid>
        <Grid item xs={12}>
          <RadioGroup
            row
            aria-label="position"
            name="position"
            defaultValue="group"
            onChange={(event) => {
              setData({ ...data, is_group: event.target.value === 'group' })
            }}
          >
            <FormControlLabel
              value={'user'}
              control={<Radio color="primary" />}
              label="ユーザチャット"
            />
            <FormControlLabel
              value={'group'}
              control={<Radio color="primary" />}
              label="グループチャット"
            />
          </RadioGroup>
          <br />
          <Typography variant="inherit">
            このチャットはMarkdownに準拠しております。
          </Typography>
          <br />
          {data.is_group && (
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Group指定</InputLabel>
              <Select
                labelId="group_id"
                id="group_id"
                onChange={(event) => {
                  const grp = template.group?.filter(
                    (res) => res.ID === Number(event.target.value)
                  )
                  if (grp !== undefined) {
                    setName(grp[0].org)
                    let mails = ''
                    if (grp[0].users !== undefined) {
                      for (const user of grp[0].users) {
                        if (user.level < 3) {
                          mails += user.email + ','
                        }
                      }
                    }
                    setSendAutoEmail(mails)
                  }
                  setData({ ...data, group_id: Number(event.target.value) })
                }}
              >
                {template.group?.map((row, index) => (
                  <MenuItem key={index} value={row.ID}>
                    {row.ID}: {row.org}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {!data.is_group && (
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>User指定</InputLabel>
              <Select
                labelId="user_id"
                id="user_id"
                onChange={(event) => {
                  const usr = template.user?.filter(
                    (res) => res.ID === Number(event.target.value)
                  )
                  if (usr !== undefined) {
                    setName(usr[0].name)
                    setSendAutoEmail(usr[0].email)
                  }
                  setData({ ...data, user_id: Number(event.target.value) })
                }}
              >
                {template.user?.map((row, index) => (
                  <MenuItem key={index} value={row.ID}>
                    {row.ID}: {row.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
        <Grid item xs={12}>
          <StyledTextFieldVeryLong
            id="title"
            label="Title"
            multiline
            rows={1}
            value={data.title}
            onChange={(event) =>
              setData({ ...data, title: event.target.value })
            }
            variant="outlined"
          />
          <br />
          <StyledTextFieldVeryLong
            id="data"
            label="内容"
            multiline
            rows={6}
            value={data.data}
            onChange={(event) => setData({ ...data, data: event.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <h3>内容のプレビュー ↓</h3>
          <ReactMarkdown skipHtml={true} remarkPlugins={[remarkGfm]}>
            {data.data}
          </ReactMarkdown>
          内容のプレビュー ↑
        </Grid>
      </Grid>
      <MailAutoSendDialogs
        setOpen={setOpenMailAutoSendDialog}
        mails={sendAutoEmail}
        open={openMailAutoSendDialog}
        org={name}
      />
      <Box mt={3}>
        <Stack spacing={1} direction="row">
          <Button onClick={request} color="primary" variant="contained">
            登録
          </Button>
        </Stack>
      </Box>
    </Dashboard>
  )
}
