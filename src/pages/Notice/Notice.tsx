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
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { Delete, GetAll } from '../../api/Notice'
import { DefaultNoticeDataArray, NoticeData } from '../../interface'
import { useSnackbar } from 'notistack'
import NoticeAddDialogs from './NoticeAdd/NoticeAdd'
import NoticeDetailDialogs from './NoticeDetail/NoticeDetail'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../api/Recoil'

export default function Notice() {
  const [tickets, setTickets] = useState(DefaultNoticeDataArray)
  const [initTickets, setInitTickets] = useState(DefaultNoticeDataArray)
  const template = useRecoilValue(TemplateState)
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

  const checkDate = (startTime: string, endTime: string) => {
    if (value === 1) {
      return toDate(startTime) > now
    }
    if (value === 2) {
      return toDate(startTime) < now && now < toDate(endTime)
    }
    return now > toDate(endTime)
  }

  const getStringFromDate = (before: string): string => {
    let str = '無期限'
    if (!before.match(/9999-12-31/)) {
      const date = new Date(Date.parse(before))
      str =
        date.getFullYear() +
        '-' +
        ('0' + (1 + date.getMonth())).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2) +
        ':' +
        ('0' + date.getSeconds()).slice(-2)
    }
    return str
  }

  return (
    <Dashboard title="Notice Info">
      <StyledPaperRootInput>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value)
          }}
        />
      </StyledPaperRootInput>
      <NoticeAddDialogs
        key={'notice_add_dialog'}
        setReload={setReload}
        reload={reload}
      />
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
              <Typography variant="h5" component="h2">
                {notice.title}
              </Typography>
              <br />
              {notice.data}
            </CardContent>
            <CardActions>
              <NoticeDetailDialogs
                key={'notice_detail_dialogs'}
                setReload={setReload}
                template={template}
                reloadTemplate={true}
                noticeData={notice}
              />
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
