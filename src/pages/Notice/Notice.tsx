import React, { useEffect, useState } from 'react'
import Dashboard from '../../components/Dashboard/Dashboard'
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles'
import {
  Button,
  CardActions,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { Delete, GetAll } from '../../api/Notice'
import { DefaultNoticeDataArray, NoticeData } from '../../interface'
import { useSnackbar } from 'notistack'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../api/Recoil'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate } from 'react-router-dom'
import { getStringFromDate } from '../../components/Tool'

export default function Notice() {
  const [tickets, setTickets] = useState(DefaultNoticeDataArray)
  const [initTickets, setInitTickets] = useState(DefaultNoticeDataArray)
  const template = useRecoilValue(TemplateState)
  const navigate = useNavigate()
  const [reload, setReload] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const [value, setValue] = React.useState(2)
  const now = new Date()

  useEffect(() => {
    if (reload) {
      GetAll().then((res) => {
        if (res.error === '') {
          setTickets(res.data)
          setInitTickets(res.data)
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
    }
  }, [reload])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number((event.target as HTMLInputElement).value))
  }

  const toDate = (date: any): Date => {
    return new Date(date)
  }

  const noticeDelete = (id: number) => {
    Delete(id).then((res) => {
      if (res.error === '') {
        setReload(true)
        enqueueSnackbar('OK', { variant: 'success' })
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
  }

  const handleFilter = (search: string) => {
    let tmp: NoticeData[]
    if (search === '') {
      tmp = initTickets
    } else {
      tmp = initTickets.filter((notice: NoticeData) => {
        return notice.title.toLowerCase().includes(search.toLowerCase())
      })
    }
    setTickets(tmp)
  }

  const checkDate = (startTime: string, endTime: string | undefined) => {
    if (value === 1) {
      return toDate(startTime) > now
    }
    if (value === 2) {
      return toDate(startTime) < now && now < toDate(endTime)
    }
    return now > toDate(endTime)
  }

  const clickAddPage = () => navigate('/dashboard/notice/add')
  const clickDetailPage = (id: number) => navigate('/dashboard/notice/' + id)

  return (
    <Dashboard title="Notice Info">
      <Button
        variant="contained"
        color="primary"
        onClick={() => clickAddPage()}
      >
        通知の追加
      </Button>
      <br />
      <br />
      <StyledPaperRootInput>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value)
          }}
        />
      </StyledPaperRootInput>
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value={2}
            control={<Radio color="primary" />}
            label="通知中"
          />
          <FormControlLabel
            value={1}
            control={<Radio color="primary" />}
            label="通知予定"
          />
          <FormControlLabel value={3} control={<Radio />} label="通知終了" />
        </RadioGroup>
      </FormControl>
      {tickets
        .filter((notice) => checkDate(notice.start_time, notice.end_time))
        .map((notice: NoticeData) => (
          <StyledCard key={'notice_id_' + notice.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {notice.ID} ({getStringFromDate(notice.start_time)} -{' '}
                {getStringFromDate(notice.end_time)})
              </StyledTypographyTitle>
              {notice.important && (
                <Chip size="small" color="primary" label="重要" />
              )}
              &nbsp;&nbsp;
              {notice.info && (
                <Chip size="small" color="primary" label="情報" />
              )}
              &nbsp;&nbsp;
              {notice.fault && (
                <Chip size="small" color="secondary" label="障害" />
              )}
              <br />
              <Typography variant="h5" component="h2">
                {notice.title}
              </Typography>
              <ReactMarkdown skipHtml={true} remarkPlugins={[remarkGfm]}>
                {notice.data}
              </ReactMarkdown>
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                size="small"
                variant="outlined"
                onClick={() => clickDetailPage(notice.ID)}
              >
                Detail
              </Button>
              <Button
                color="secondary"
                size="small"
                variant="outlined"
                onClick={() => noticeDelete(notice.ID)}
              >
                Delete
              </Button>
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  )
}
