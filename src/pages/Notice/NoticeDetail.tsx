import React, { useEffect } from 'react'
import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material'
import { DefaultNoticeData, NoticeData } from '../../interface'
import { Get, Put } from '../../api/Notice'
import { useSnackbar } from 'notistack'
import { StyledTextFieldWrap, StyledTextFieldWrapTitle } from '../../style'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Dashboard from '../../components/Dashboard/Dashboard'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../api/Recoil'
import { useParams } from 'react-router-dom'
import { DateToString1 } from '../../components/Tool'

export default function NoticeDetail() {
  const template = useRecoilValue(TemplateState)
  const [isPermanent, setIsPermanent] = React.useState(false)
  const [startTime, setStartTime] = React.useState<Date>(new Date())
  const [endTime, setEndTime] = React.useState<Date>(new Date())
  const [data, setData] = React.useState<NoticeData>(DefaultNoticeData)
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()

  useEffect(() => {
    Get(Number(id)).then((res) => {
      if (res.error !== '') {
        enqueueSnackbar('' + res.error, { variant: 'error' })
        return
      }
      setData(res.data)
      setStartTime(new Date(res.data.start_time))
      if (res.data.end_time === '9999-12-31T23:59:59+09:00') {
        setIsPermanent(true)
      } else {
        setEndTime(new Date(res.data.end_time))
      }
    })
  }, [template])

  const request = () => {
    const start_time = DateToString1(startTime)
    let end_time = undefined
    if (!isPermanent) {
      end_time = DateToString1(endTime)
    }

    data.start_time = start_time
    data.end_time = end_time
    Put(Number(id), data).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('登録しました。', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  return (
    <Dashboard title="通知機能の追加">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledTextFieldWrapTitle
            id="title"
            label="Title"
            style={{ margin: 8 }}
            value={data.title}
            placeholder="Title"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setData({ ...data, title: event.target.value })
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <StyledTextFieldWrap
            id="message"
            label="Message - Markdown準拠"
            placeholder="Message"
            style={{ margin: 8 }}
            value={data.data}
            multiline
            rows={10}
            onChange={(event) => {
              setData({ ...data, data: event.target.value })
            }}
            variant="outlined"
          />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </Grid>
        <Grid item xs={12}>
          <h2>プレビュー ↓</h2>
          <ReactMarkdown skipHtml={true} remarkPlugins={[remarkGfm]}>
            {data.data}
          </ReactMarkdown>
          プレビュー ↑
        </Grid>
        <Grid item xs={12}>
          <h2>通知期間</h2>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="掲示開始日"
              key="begin-date-picker-dialog"
              value={startTime}
              views={['year', 'month', 'day', 'hours', 'minutes']}
              onChange={(value) => setStartTime(value!)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isPermanent}
                onChange={(event) => setIsPermanent(event.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="掲載終了期間が未定"
          />
          <br />
          {!isPermanent && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="掲示終了日"
                key="finish-date-picker-dialog"
                value={endTime}
                views={['year', 'month', 'day', 'hours', 'minutes']}
                onChange={(value) => setEndTime(value!)}
              />
            </LocalizationProvider>
          )}
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
          <h2>通知先</h2>
          <p>
            通知先を変更する場合は、該当通知を削除してから再追加してください。
          </p>
        </Grid>
        <Grid item xs={12}>
          <h2>Option</h2>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                checked={data.important}
                onChange={(event) =>
                  setData({ ...data, important: event.target.checked })
                }
              />
            }
            label="重要"
            labelPlacement="top"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={data.info}
                onChange={(event) =>
                  setData({ ...data, info: event.target.checked })
                }
              />
            }
            label="情報"
            labelPlacement="top"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                checked={data.fault}
                onChange={(event) =>
                  setData({ ...data, fault: event.target.checked })
                }
              />
            }
            label="障害"
            labelPlacement="top"
          />
        </Grid>
      </Grid>
      <br />
      <Button variant="contained" onClick={() => request()} color="primary">
        更新
      </Button>
    </Dashboard>
  )
}
