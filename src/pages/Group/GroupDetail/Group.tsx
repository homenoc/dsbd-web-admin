import { GroupDetailData } from '../../../interface'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  PropTypes,
  Typography,
} from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { GroupStatusStr } from '../../../components/Dashboard/Status/Status'
import { GroupAbolition, GroupLockButton, GroupStatusButton } from './GroupMenu'
import { DeleteSubscription, Put } from '../../../api/Group'
import { useSnackbar } from 'notistack'
import {
  StyledButtonSpaceRight,
  StyledButtonSpaceTop,
  StyledCardRoot1,
  StyledChip2,
  StyledDivLargeHeading,
  StyledDivRoot1,
  StyledDivText,
  StyledFormControlFormShort,
  StyledRootForm,
  StyledTextFieldMedium,
  StyledTextFieldVeryShort1,
  StyledTypographyHeading,
} from '../../../style'
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../../api/Recoil'
import { StyledSelect1, StyledTextFieldShort } from '../../Add/style'
import { GetPayment, PostSubscribe } from '../../../api/Payment'

function ChipAgree(props:{ agree: boolean }) {
  const { agree } = props
  if (agree) {
    return <Chip size="small" color="primary" label="規約に同意する" />
  }
  return <Chip size="small" color="secondary" label="規約に同意していない" />
}

export function GroupProfileInfo(props: {
  data: GroupDetailData
  setOpenMailSendDialog: Dispatch<SetStateAction<boolean>>
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { data, setOpenMailSendDialog, setReload } = props
  const [lockPersonalInformation, setLockPersonalInformation] =
    React.useState(true)
  const template = useRecoilValue(TemplateState)
  const [group, setGroup] = useState(data)
  const { enqueueSnackbar } = useSnackbar()
  const [paymentCoupon, setPaymentCoupon] = React.useState('')
  const [memberType, setMemberType] = React.useState(0)
  const [memberExpiredDate, setMemberExpiredDate] = React.useState<Date | null>(
    null
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (data.member_expired != null) {
      const tmp = data.member_expired.split('T')
      const expiredDate = new Date(tmp[0])
      setMemberExpiredDate(expiredDate)
    }

    if (data.coupon_id != null) {
      setPaymentCoupon(data.coupon_id)
    }

    if (data.member_type != null) {
      setMemberType(data.member_type)
    }
  }, [])

  const membershipUpdate = () => {
    let dateStr = null
    if (memberExpiredDate != null) {
      dateStr =
        memberExpiredDate.getFullYear() +
        '-' +
        ('00' + (memberExpiredDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + memberExpiredDate.getDate()).slice(-2) +
        'T00:00:00+09:00'
    }
    const req = {
      coupon_id: paymentCoupon,
      member_type: memberType,
      member_expired: dateStr,
    }

    Put(data.ID, req).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  const cancelSubscription = () => {
    DeleteSubscription(data.ID).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  const subscribe = (plan: string) => {
    PostSubscribe(data.ID, plan).then((res) => {
      if (res.error === '') {
        window.open(res.data, '_blank')
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  const getPayment = () => {
    GetPayment(data.ID).then((res) => {
      if (res.error === '') {
        window.open(res.data, '_blank')
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  const handleMemberExpiredDateChange = (newDate: Date | null) => {
    setMemberExpiredDate(newDate)
  }

  const clickPersonalInfoLock = () => {
    setLockPersonalInformation(!lockPersonalInformation)
  }

  // Update Group Information
  const updateGroupInfo = () => {
    Put(group.ID, group).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  return (
    <StyledCardRoot1>
      <CardContent>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="group-info"
          >
            <StyledTypographyHeading>
              グループ情報(住所、電話番号など)
            </StyledTypographyHeading>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl sx={{ width: '100%' }}>
              <StyledDivRoot1>
                <StyledRootForm noValidate autoComplete="off">
                  <StyledTextFieldVeryShort1
                    required
                    id="postcode"
                    label="郵便番号"
                    defaultValue={data.postcode}
                    InputProps={{
                      readOnly: lockPersonalInformation,
                    }}
                    variant="outlined"
                    onChange={(event) => {
                      setGroup({ ...data, postcode: event.target.value })
                    }}
                  />
                  <StyledTextFieldMedium
                    required
                    id="address"
                    label="住所"
                    defaultValue={data.address}
                    InputProps={{
                      readOnly: lockPersonalInformation,
                    }}
                    variant="outlined"
                    onChange={(event) => {
                      setGroup({ ...data, address: event.target.value })
                    }}
                  />
                  <StyledTextFieldMedium
                    required
                    id="address_english"
                    label="住所(English)"
                    defaultValue={data.address_en}
                    InputProps={{
                      readOnly: lockPersonalInformation,
                    }}
                    variant="outlined"
                    onChange={(event) => {
                      setGroup({ ...data, address_en: event.target.value })
                    }}
                  />
                  <StyledTextFieldVeryShort1
                    required
                    id="tel"
                    label="電話番号"
                    defaultValue={data.tel}
                    InputProps={{
                      readOnly: lockPersonalInformation,
                    }}
                    variant="outlined"
                    onChange={(event) => {
                      setGroup({ ...data, tel: event.target.value })
                    }}
                  />
                  <StyledTextFieldVeryShort1
                    required
                    id="country"
                    label="住居国"
                    defaultValue={data.country}
                    InputProps={{
                      readOnly: lockPersonalInformation,
                    }}
                    variant="outlined"
                    onChange={(event) => {
                      setGroup({ ...data, country: event.target.value })
                    }}
                  />
                </StyledRootForm>
                <Button
                  size="small"
                  color="secondary"
                  disabled={!lockPersonalInformation}
                  onClick={clickPersonalInfoLock}
                >
                  ロック解除
                </Button>
                <Button size="small">Cancel</Button>
                <Button
                  size="small"
                  color="primary"
                  disabled={lockPersonalInformation}
                  onClick={updateGroupInfo}
                >
                  Save
                </Button>
              </StyledDivRoot1>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="question"
            id="question"
          >
            <StyledTypographyHeading>
              Agree & Question & Contract
            </StyledTypographyHeading>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl sx={{ width: '100%' }}>
              <StyledDivRoot1>
                <StyledDivLargeHeading>Agree</StyledDivLargeHeading>
                <ChipAgree key={"agree"} agree={data.agree} />
                <StyledDivLargeHeading>Question</StyledDivLargeHeading>
                <StyledDivText>{data.question}</StyledDivText>
                <StyledDivLargeHeading>Contract</StyledDivLargeHeading>
                <StyledDivText>{data.contract}</StyledDivText>
              </StyledDivRoot1>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="payment"
            id="payment"
          >
            <StyledTypographyHeading>
              会員種別・会費関連
            </StyledTypographyHeading>
          </AccordionSummary>
          <AccordionDetails>
            <StyledFormControlFormShort variant="filled">
              <p>CusID: {data.stripe_customer_id}</p>
              <p>SubID: {data.stripe_subscription_id}</p>
              <StyledTextFieldShort
                id="coupon_code"
                label="クーポンコード"
                multiline
                value={paymentCoupon}
                onChange={(event) => setPaymentCoupon(event.target.value)}
                variant="outlined"
              />
              <LocalizationProvider
                key={'membership-localization-provider'}
                dateAdapter={AdapterDateFns}
              >
                <DesktopDatePicker
                  label="Membership期限"
                  key="membership-date-picker"
                  value={memberExpiredDate}
                  slotProps={{
                    textField: {
                      helperText: 'yyyy/MM/dd',
                    },
                  }}
                  onChange={handleMemberExpiredDateChange}
                />
              </LocalizationProvider>
              <FormControl variant="standard">
                <InputLabel id="member_type-label">Member Type</InputLabel>
                <StyledSelect1
                  id="member_type"
                  label="member type"
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (!isNaN(value)) {
                      setMemberType(value)
                    }
                  }}
                  value={memberType}
                >
                  {template.member_type?.map((row, index) => (
                    <MenuItem key={'member_type_' + index} value={row.id}>
                      {row.id}: {row.name}
                    </MenuItem>
                  ))}
                </StyledSelect1>
              </FormControl>
              <br />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledButtonSpaceRight
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={membershipUpdate}
                  >
                    Update
                  </StyledButtonSpaceRight>
                  <StyledButtonSpaceRight
                    size="small"
                    variant="contained"
                    color={'secondary'}
                    onClick={cancelSubscription}
                  >
                    解約
                  </StyledButtonSpaceRight>
                </Grid>
                <Grid item xs={12}>
                  <StyledButtonSpaceRight
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => subscribe('yearly')}
                  >
                    支払い(Yearly)
                  </StyledButtonSpaceRight>
                  <StyledButtonSpaceRight
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => subscribe('monthly')}
                  >
                    支払い(Monthly)
                  </StyledButtonSpaceRight>
                </Grid>
                <Grid item xs={12}>
                  <StyledButtonSpaceRight
                    size="small"
                    variant="contained"
                    color={'primary'}
                    onClick={getPayment}
                  >
                    Subscribe管理
                  </StyledButtonSpaceRight>
                </Grid>
              </Grid>
            </StyledFormControlFormShort>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="other"
            id="other"
          >
            <StyledTypographyHeading>その他</StyledTypographyHeading>
          </AccordionSummary>
          <AccordionDetails>
            <Typography></Typography>
          </AccordionDetails>
        </Accordion>
        <br />
        <StyledButtonSpaceRight
          size="small"
          variant="contained"
          color="primary"
          onClick={() =>
            navigate('/dashboard/group/' + data.ID + '/add/service')
          }
        >
          Service情報の追加
        </StyledButtonSpaceRight>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() =>
            navigate('/dashboard/group/' + data.ID + '/add/connection')
          }
        >
          接続情報の追加
        </Button>
        <br />
        <StyledButtonSpaceTop
          size="small"
          onClick={() => setOpenMailSendDialog(true)}
        >
          メール送信
        </StyledButtonSpaceTop>
        <Button
          size="small"
          variant="contained"
          color="primary"
          // onClick={() => setOpenJPNICRegistration(true)}
        >
          JPNIC登録(β)
        </Button>
      </CardContent>
    </StyledCardRoot1>
  )
}

export function GroupMainMenu(props: {
  data: GroupDetailData
  autoMail: Dispatch<SetStateAction<string>>
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { data, autoMail, setReload } = props

  return (
    <StyledCardRoot1>
      <CardContent>
        <GroupStatusButton
          key={'group_status_button'}
          data={data}
          autoMail={autoMail}
          setReload={setReload}
        />
        <GroupLockButton
          key={'group_lock_button'}
          data={data}
          setReload={setReload}
        />
        <GroupAbolition key={'group_abolition'} />
      </CardContent>
    </StyledCardRoot1>
  )
}

export function GroupStatus(props: {
  data: GroupDetailData
  setReload: boolean
}) {
  const { data, setReload } = props
  const [createDate, setCreateDate] = useState('')
  const [updateDate, setUpdateDate] = useState('')
  const [membershipLabel, setMembershipLabel] = useState<{
    color: Exclude<PropTypes.Color, 'inherit'>
    label: string
  }>({
    color: 'primary',
    label: '',
  })
  const [automaticUpdate, setAutomaticUpdate] = useState<{
    color: Exclude<PropTypes.Color, 'inherit'>
    label: string
  }>({
    color: 'primary',
    label: '',
  })
  const nowDate = new Date()

  useEffect(() => {
    // create date
    const tmpCreateDate = new Date(Date.parse(data.CreatedAt))
    setCreateDate(
      '作成日: ' +
        tmpCreateDate.getFullYear() +
        '-' +
        ('00' + (tmpCreateDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + tmpCreateDate.getDate()).slice(-2) +
        ' ' +
        ('00' + tmpCreateDate.getHours()).slice(-2) +
        ':' +
        ('00' + tmpCreateDate.getMinutes()).slice(-2) +
        ':' +
        ('00' + tmpCreateDate.getSeconds()).slice(-2)
    )

    // update date
    const tmpUpdateDate = new Date(Date.parse(data.UpdatedAt))
    setUpdateDate(
      '更新日: ' +
        tmpUpdateDate.getFullYear() +
        '-' +
        ('00' + (tmpUpdateDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + tmpUpdateDate.getDate()).slice(-2) +
        ' ' +
        ('00' + tmpUpdateDate.getHours()).slice(-2) +
        ':' +
        ('00' + tmpUpdateDate.getMinutes()).slice(-2) +
        ':' +
        ('00' + tmpUpdateDate.getSeconds()).slice(-2)
    )

    // member expired
    setMembershipLabel({ color: 'primary', label: '' })
    if (data.member_expired != null) {
      const tmp = data.member_expired.split('T')
      const memberExpired = new Date(tmp[0])
      const expiredDate =
        memberExpired.getFullYear() +
        '-' +
        ('00' + (memberExpired.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + memberExpired.getDate()).slice(-2)

      nowDate.setDate(nowDate.getDate() + 1)
      if (
        Date.UTC(
          memberExpired.getFullYear(),
          memberExpired.getMonth() + 1,
          memberExpired.getDate(),
          0,
          0,
          0
        ) >=
        Date.UTC(
          nowDate.getFullYear(),
          nowDate.getMonth() + 1,
          nowDate.getDate(),
          0,
          0,
          0
        )
      ) {
        setAutomaticUpdate({
          color: 'primary',
          label: expiredDate,
        })
      } else {
        setAutomaticUpdate({
          color: 'secondary',
          label: '未払い ' + expiredDate,
        })
      }
    } else {
      setAutomaticUpdate({
        color: 'secondary',
        label: '-----',
      })
    }

    let paymentMemberStatus = ''
    switch (data.member_type) {
      case 1:
        paymentMemberStatus += '通常会員'
        break
      case 40:
        paymentMemberStatus += '運営委員(有償)'
        break
      case 70:
        paymentMemberStatus += '学生会員'
        break
      case 90:
        paymentMemberStatus += '運営委員(無償)'
        break
      default:
        break
    }
    setMembershipLabel({
      color: 'primary',
      label: paymentMemberStatus,
    })
  }, [setReload])

  return (
    <StyledCardRoot1>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h4>Status</h4>
            <Chip size="small" color="primary" label={GroupStatusStr(data)} />
            <h4>Membership</h4>
            <Chip
              size="small"
              color={membershipLabel.color}
              label={membershipLabel.label}
            />
            &nbsp;
            <Chip
              size="small"
              color={automaticUpdate.color}
              label={automaticUpdate.label}
            />
            <h4>Date</h4>
            <StyledChip2 size="small" color="primary" label={createDate} />
            <Chip size="small" color="primary" label={updateDate} />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot1>
  )
}
