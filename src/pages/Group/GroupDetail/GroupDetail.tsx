import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Dashboard from '../../../components/Dashboard/Dashboard'
import { Get } from '../../../api/Group'
import Users from './User'
import { CircularProgress, Grid } from '@mui/material'
import { DefaultGroupDetailData } from '../../../interface'
import Ticket from '../../../components/Dashboard/Ticket/Ticket'
import Request from '../../../components/Dashboard/Request/Request'
import { GroupProfileInfo, GroupMainMenu, GroupStatus } from './Group'
import { useSnackbar } from 'notistack'
import { GroupMemo } from './Memo'
import { MailAutoSendDialogs, MailSendDialogs } from '../Mail'
import { StyledDivRoot1 } from '../../../style'
import { Service } from "./Service";

function getTitle(
  id: number,
  org: string,
  org_en: string,
  loading: boolean
): string {
  if (loading) {
    return 'Loading...'
  }
  if (!loading && org === '' && org_en === '') {
    return 'No Data...'
  }
  return 'id: ' + id + ' ' + org + '(' + org_en + ')'
}

export default function GroupDetail() {
  const { enqueueSnackbar } = useSnackbar()
  const [reload, setReload] = useState(true)
  const [loading, setLoading] = useState(true)
  const [group, setGroup] = useState(DefaultGroupDetailData)
  const [openMailSendDialog, setOpenMailSendDialog] = useState(false)
  const [openMailAutoSendDialog, setOpenMailAutoSendDialog] = useState('')
  const [sendAutoEmail, setSendAutoEmail] = useState('')
  const { id } = useParams()

  useEffect(() => {
    if (reload) {
      Get(id!).then((res) => {
        if (res.error === '') {
          setGroup(res.data)
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
    }
  }, [reload])

  useEffect(() => {
    Get(id!).then((res) => {
      if (res.error === '') {
        setGroup(res.data)
        let mails = ''
        if (res.data.users != null) {
          for (const user of res.data.users) {
            if (user.level < 3) {
              mails += user.email + ','
            }
          }
        }
        setSendAutoEmail(mails)
        setLoading(false)
        setReload(false)
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
  }, [])

  return (
    <Dashboard title={getTitle(group.ID, group.org, group.org_en, loading)}>
      {loading ? (
        <StyledDivRoot1>
          <CircularProgress />
          <div>loading</div>
        </StyledDivRoot1>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <GroupStatus key={'group_status'} data={group} setReload={reload} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GroupMemo key={'group_memo'} data={group} setReload={setReload} />
            <GroupMainMenu
              key={'group_main_menu'}
              data={group}
              autoMail={setOpenMailAutoSendDialog}
              setReload={setReload}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <GroupProfileInfo
              key={'group_profile_info'}
              data={group}
              setOpenMailSendDialog={setOpenMailSendDialog}
              setReload={setReload}
            />
          </Grid>
          <Grid item xs={12}>
            <Service
              key={'service'}
              services={group.services}
              autoMail={setOpenMailAutoSendDialog}
              setReload={setReload}
            />
          </Grid>
          <Grid item xs={12}>
            <Ticket key={'ticket'} data={group.tickets} setReload={setReload} />
          </Grid>
          <Grid item xs={12}>
            <Request
              key={'request'}
              data={group.tickets}
              setReload={setReload}
            />
          </Grid>
          <Grid item xs={12}>
            <Users key={'users'} data={group} />
          </Grid>
          <Grid item xs={12}>
            <MailAutoSendDialogs
              setOpen={setOpenMailAutoSendDialog}
              mails={sendAutoEmail}
              open={openMailAutoSendDialog}
              org={group.org}
            />
            <MailSendDialogs
              setOpen={setOpenMailSendDialog}
              open={openMailSendDialog}
              mails={sendAutoEmail}
              org={group.org}
            />
          </Grid>
        </Grid>
      )}
    </Dashboard>
  )
}
