import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Stack,
} from '@mui/material'
import Select from 'react-select'
import { ConnectionDetailData } from '../../interface'
import { Post } from '../../api/Notice'
import { useSnackbar } from 'notistack'
import { MailAutoNoticeSendDialogs } from '../Group/Mail'
import { StyledTextFieldWrap, StyledTextFieldWrapTitle } from '../../style'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../api/Recoil'
import { GetAll as ConnectionGetAll } from '../../api/Connection'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'
import Dashboard from '../../components/Dashboard/Dashboard'
import * as Yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { DateToString1 } from '../../components/Tool'
import { useNavigate } from 'react-router-dom'

type OptionType = {
  label: string
  value: number
}
export default function NoticeAdd() {
  const template = useRecoilValue(TemplateState)
  const navigate = useNavigate()
  const nowDate = new Date()
  const [isPermanent, setIsPermanent] = React.useState(true)
  const [email, setEmail] = React.useState<string>('')
  const [openMailSendDialog, setOpenMailSendDialog] = React.useState(false)
  const [inputUserID, setInputUserID] = React.useState<number[]>([])
  const [inputGroupID, setInputGroupID] = React.useState<number[]>([])
  const [inputNOCID, setInputNOCID] = React.useState<number[]>([])
  const [templateUser, setTemplateUser] = React.useState<OptionType[]>([])
  const [templateGroup, setTemplateGroup] = React.useState<OptionType[]>([])
  const [templateNOC, setTemplateNOC] = React.useState<OptionType[]>([])
  const [connections, setConnections] = useState<ConnectionDetailData[]>()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (template !== undefined) {
      if (template.user !== undefined) {
        const templateTmp: OptionType[] = []
        for (const tmp of template.user) {
          templateTmp.push({
            value: tmp.ID,
            label: tmp.name + '(' + tmp.name_en + ')',
          })
        }
        setTemplateUser(templateTmp)
      }
      if (template.group !== undefined) {
        const templateTmp: OptionType[] = []
        for (const tmp of template.group) {
          templateTmp.push({
            value: tmp.ID,
            label: tmp.org + '(' + tmp.org_en + ')',
          })
        }
        setTemplateGroup(templateTmp)
      }
      if (template.nocs !== undefined) {
        const templateTmp: OptionType[] = []
        for (const tmp of template.nocs) {
          templateTmp.push({ value: tmp.ID, label: tmp.name })
        }
        setTemplateNOC(templateTmp)
      }
      ConnectionGetAll().then((res) => {
        if (res.error === '') {
          const data = res.data
          setConnections(
            data.filter(
              (item: ConnectionDetailData) => item.enable && item.open
            )
          )
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
    }
  }, [template])

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('タイトルを入力してください'),
    body: Yup.string()
      .required('内容を入力してください')
      .min(10, '10文字以上入力してください'),
    start_time: Yup.date().required('利用開始日を入力してください'),
    end_time: Yup.date(),
    is_permanent: Yup.bool(),
    everyone: Yup.bool(),
    important: Yup.bool(),
    fault: Yup.bool(),
    info: Yup.bool(),
  })

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      body: '',
      start_time: nowDate,
      end_time: new Date(),
      is_permanent: false,
      everyone: false,
      important: false,
      fault: false,
      info: false,
    },
  })
  const title = watch('title')
  const body = watch('body')
  const isEveryone = watch('everyone')

  const onSubmit = (data: any, e: any) => {
    const start_time = DateToString1(data.start_time)
    let end_time = undefined
    if (!isPermanent) {
      end_time = DateToString1(data.end_time)
    }

    const request: any = {
      user_id: inputUserID,
      group_id: inputGroupID,
      noc_id: inputNOCID,
      title: data.title,
      body: data.body,
      start_time,
      end_time,
      everyone: data.everyone,
      important: data.important,
      fault: data.fault,
      info: data.info,
    }

    // eslint-disable-next-line no-console
    console.log('request', request)
    setOpenMailSendDialog(true)

    Post(request).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
        setOpenMailSendDialog(true)
        navigate('/dashboard/notice')
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }
  const onError = (errors: any) => {
    // eslint-disable-next-line no-console
    console.log('error', errors)

    enqueueSnackbar('入力した内容を確認してください。', { variant: 'error' })
  }

  const getEMail = () => {
    // Mail用
    let emails = ''

    for (const tmpUserID of inputUserID) {
      const u = template.user?.filter((d) => d.ID === tmpUserID)
      if (u !== undefined) {
        if (emails.indexOf(u[0].email) === -1) {
          emails += ',' + u[0].email
        }
      }
    }
    for (const tmpGroupID of inputGroupID) {
      const tmpUser = template.user?.filter(
        (d) => d.group_id === tmpGroupID && d.level < 3
      )
      if (tmpUser !== undefined) {
        if (emails.indexOf(tmpUser[0].email) === -1) {
          emails += ',' + tmpUser[0].email
        }
      }
    }
    for (const tmpNOCID of inputNOCID) {
      // const tmpBGP
      const tmpConnections = connections?.filter(
        (d) =>
          d.bgp_router?.noc_id === tmpNOCID &&
          d.service?.pass &&
          d.service?.enable
      )
      if (tmpConnections !== undefined) {
        for (const tmpConnection of tmpConnections) {
          const tmpUser = template.user?.filter(
            (d) => d.group_id === tmpConnection.service?.group_id && d.level < 3
          )
          if (tmpUser !== undefined) {
            if (emails.indexOf(tmpUser[0].email) === -1) {
              emails += ',' + tmpUser[0].email
            }
          }
        }
      }
    }
    return emails.slice(1)
  }

  return (
    <Dashboard title="Notice Info">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormHelperText error>
            {errors?.title && errors.title?.message}
          </FormHelperText>
          <StyledTextFieldWrapTitle
            id="title"
            label="Title"
            style={{ margin: 8 }}
            placeholder="Title"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            {...register('title')}
            error={!!errors.title}
          />
        </Grid>
        <Grid item xs={12}>
          <FormHelperText error>
            {errors?.body && errors.body?.message}
          </FormHelperText>
          <StyledTextFieldWrap
            id="message"
            label="Message - Markdown準拠"
            placeholder="Message"
            style={{ margin: 8 }}
            multiline
            rows={10}
            variant="outlined"
            {...register('body')}
            error={!!errors.body}
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
            {body}
          </ReactMarkdown>
          プレビュー ↑
        </Grid>
        <Grid item xs={12}>
          <h2>通知期間</h2>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="start_time"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  label="掲示開始日"
                  key="begin-date-picker-dialog"
                  value={value}
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                  onChange={(value) => onChange(value)}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <br />
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isPermanent}
                onChange={(event) => setIsPermanent(event.target.checked)}
                name="permanent"
                color="primary"
              />
            }
            label="掲載終了期間が未定"
          />
          <br />
          {!isPermanent && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="end_time"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    key="finish-date-picker-dialog"
                    label="掲示終了日"
                    value={value}
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    onChange={(value) => onChange(value)}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
          <h2>通知先</h2>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="everyone"
                render={({ field: { onChange } }) => (
                  <Checkbox
                    color="primary"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="全体に通知"
          />
          {!isEveryone && (
            <div>
              <div>
                優先度は<b>{'User > Group > NOC'}</b>
                の順に通知処理を行います。
              </div>
              <br />
              <h3>ユーザ</h3>
              <Select
                isMulti
                name="colors"
                options={templateUser}
                className="basic-multi-select"
                classNamePrefix="user"
                onChange={(event) => {
                  const tmpData: number[] = []
                  for (const tmp of event) {
                    tmpData.push(tmp.value)
                  }
                  setInputUserID(tmpData)
                  setEmail(getEMail())
                }}
              />
              <h3>グループ</h3>
              <Select
                isMulti
                name="colors"
                options={templateGroup}
                className="basic-multi-select"
                classNamePrefix="group"
                onChange={(event) => {
                  const tmpData: number[] = []
                  for (const tmp of event) {
                    tmpData.push(tmp.value)
                  }
                  setInputGroupID(tmpData)
                  setEmail(getEMail())
                }}
              />
              <h3>NOC</h3>
              <Select
                isMulti
                name="colors"
                options={templateNOC}
                className="basic-multi-select"
                classNamePrefix="noc"
                onChange={(event) => {
                  const tmpData: number[] = []
                  for (const tmp of event) {
                    tmpData.push(tmp.value)
                  }
                  setInputNOCID(tmpData)
                  setEmail(getEMail())
                }}
              />
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <h2>Option</h2>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="important"
                render={({ field: { onChange } }) => (
                  <Checkbox
                    color="primary"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="重要"
            labelPlacement="top"
          />
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="info"
                render={({ field: { onChange } }) => (
                  <Checkbox
                    color="primary"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="情報"
            labelPlacement="top"
          />
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="fault"
                render={({ field: { onChange } }) => (
                  <Checkbox
                    color="primary"
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="障害"
            labelPlacement="top"
          />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}></Grid>
      </Grid>
      <Box mt={3}>
        <Stack spacing={1} direction="row">
          <Button variant="contained" onClick={handleSubmit(onSubmit, onError)}>
            登録
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              enqueueSnackbar('E-Mail: ' + getEMail(), { variant: 'info' })
            }
          >
            送信メールアドレスの確認
          </Button>
        </Stack>
      </Box>
      <MailAutoNoticeSendDialogs
        setOpen={setOpenMailSendDialog}
        open={openMailSendDialog}
        mails={email}
        template={template?.mail_template}
        title={title}
        body={body}
      />
    </Dashboard>
  )
}
