import React, { useEffect, useState } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import { useSnackbar } from 'notistack'
import { GetAll as SupportGetAll } from '../../api/Support'
import { GetAll as ServiceGetAll } from '../../api/Service'
import { GetAll as ConnectionGetAll } from '../../api/Connection'
import { GetAll as GroupGetAll } from '../../api/Group'
import {
  ConnectionDetailData,
  GroupDetailData,
  ServiceDetailData,
  TicketDetailData,
} from '../../interface'
import { Button, Card, CardContent, Chip, Checkbox, FormControlLabel, Grid, Stack } from '@mui/material'
import Ticket from '../../components/Dashboard/Ticket/Ticket'
import Request from '../../components/Dashboard/Request/Request'
import Service from '../../components/Dashboard/Service/Service'
import Connection from '../../components/Dashboard/Connection/Connection'
import { Group } from '../../components/Dashboard/Group/Group'
import { MemoGroup } from '../../components/Dashboard/Group/Memo'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../api/Recoil'

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar()
  const [reload, setReload] = useState(true)
  const [ticket, setTicket] = useState<TicketDetailData[]>()
  const [request, setRequest] = useState<TicketDetailData[]>()
  const [service, setService] = useState<ServiceDetailData[]>()
  const [group, setGroup] = useState<GroupDetailData[]>()
  const [connection, setConnection] = useState<ConnectionDetailData[]>()
  const template = useRecoilValue(TemplateState)
  const [expired_status0IsChecked, setExpired_status0IsChecked] = useState(true);
  const [expired_status1IsChecked, setExpired_status1IsChecked] = useState(false);
  const [expired_status2IsChecked, setExpired_status2IsChecked] = useState(false);
  const [expired_status3IsChecked, setExpired_status3IsChecked] = useState(false);
  const [member_type90IsChecked, setMember_type90IsChecked] = useState(false);
  const [member_type99IsChecked, setMember_type99IsChecked] = useState(false);
  const [hasEnabledServiceIsChecked, setHasEnabledServiceIsChecked] = useState(true);
  const [hasEnabledConnectionIsChecked, setHasEnabledConnectionIsChecked] = useState(true);
  const [groupDialogIsOpen, setGroupDialogIsOpen] = useState(false);

  useEffect(() => {
    if (reload) {
      GroupGetAll().then((res) => {
        if (res.error === '') {
          const data = res.data
          setGroup(data)
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
      SupportGetAll().then((res) => {
        if (res.error === '') {
          const data = res.data
          setTicket(
            data.filter((item: TicketDetailData) => !item.request)
          )
          setRequest(
            data.filter((item: TicketDetailData) => item.request)
          )
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
      ServiceGetAll().then((res) => {
        if (res.error === '') {
          const data = res.data
          setService(data)
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
      ConnectionGetAll().then((res) => {
        if (res.error === '') {
          const data = res.data
          setConnection(data)
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
    }
  }, [reload])

  return (
    <DashboardComponent title="Dashboard">
      <Grid container spacing={3}>
        {!reload && (
          <Grid item xs={12}>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row"}} spacing={1} useFlexGap flexWrap="wrap">
                  <Chip
                    color="primary"
                    style={{
                      paddingTop: 1
                    }}
                    label={`有効GROUP: ${
                      group?.filter(
                        (g: GroupDetailData) => g.expired_status === 0
                      ).length
                    }`}
                  />
                  <Chip
                    color="primary"
                    label={`有効SERVICE: ${
                      service?.filter((s) => s.enable && s.pass).length
                    }`}
                  />
                  <Chip
                    color="primary"
                    label={`有効CONNECTION: ${
                      connection?.filter((d) => d.enable && d.open).length
                    }`}
                  />
                  <Chip
                    color={
                      // 数によって色を変える
                      ticket?.filter((item: TicketDetailData) => !item.solved).length !== 0
                        ? "error"
                        : "success"}
                    label={`未対処チケット数: ${
                      ticket?.filter((item: TicketDetailData) => !item.solved)
                        .length
                    }`}
                  />
                  <Chip
                    color={
                      // 数によって色を変える
                      request?.filter(
                        (item: TicketDetailData) =>
                          !item.solved && !item.request_reject
                      ).length !== 0
                        ? "error"
                        : "success"
                    }
                    label={`未対処リクエスト数: ${
                      request?.filter(
                        (item: TicketDetailData) =>
                          !item.solved && !item.request_reject
                      ).length
                    }`}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item xs={12}>
          <Ticket
            key={'ticket'}
            data={ticket?.filter((item: TicketDetailData) => !item.solved)}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12}>
          <Request
            key={'request'}
            data={request?.filter((item: TicketDetailData) => !item.solved)}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12}>
          <Service
            key={'service'}
            data={service?.filter(
              (item: ServiceDetailData) => item.enable && !item.pass
            )}
            template={template}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12}>
          <Connection
            key={'connection'}
            data={connection?.filter(
              (item: ConnectionDetailData) => item.enable && !item.open
            )}
            template={template}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12}>
          <Group
            key={'group'}
            data={template?.group?.filter((item) => {
              if (!expired_status0IsChecked && item.expired_status === 0) {return false}
              if (!expired_status1IsChecked && item.expired_status === 1) {return false}
              if (!expired_status2IsChecked && item.expired_status === 2) {return false}
              if (!expired_status3IsChecked && item.expired_status === 3) {return false}
              if (!member_type90IsChecked && item.member_type === 90) {return false}
              if (!member_type99IsChecked && item.member_type === 99) {return false}
              if (hasEnabledServiceIsChecked){
                if (service?.filter((s) => s.group_id === item.ID && s.enable).length === 0) {
                  return false
                }
              }
              if (hasEnabledConnectionIsChecked){
                if (connection?.filter((c) => c.service?.group_id === item.ID && c.enable).length === 0) {
                  return false
                }
              }
              
              return true
            })}
            setReload={setReload}
          />
          <FormControlLabel
            control={<Checkbox checked={expired_status0IsChecked} onChange={() => setExpired_status0IsChecked(!expired_status0IsChecked)}/>}
            label="通常"
          />
          <FormControlLabel
            control={<Checkbox checked={expired_status1IsChecked} onChange={() => setExpired_status1IsChecked(!expired_status1IsChecked)}/>}
            label="審査落ち"
          />
          <FormControlLabel
            control={<Checkbox checked={expired_status2IsChecked} onChange={() => setExpired_status2IsChecked(!expired_status2IsChecked)}/>}
            label="ユーザにより廃止"
          />
          <FormControlLabel
            control={<Checkbox checked={expired_status3IsChecked} onChange={() => setExpired_status3IsChecked(!expired_status3IsChecked)}/>}
            label="運営委員により廃止"
          />
          <FormControlLabel
            control={<Checkbox checked={member_type90IsChecked} onChange={() => setMember_type90IsChecked(!member_type90IsChecked)}/>}
            label="member_type: 90"
          />
          <FormControlLabel
            control={<Checkbox checked={member_type99IsChecked} onChange={() => setMember_type99IsChecked(!member_type99IsChecked)}/>}
            label="member_type: 99"
          />
          <FormControlLabel
            control={<Checkbox checked={hasEnabledServiceIsChecked} onChange={() => setHasEnabledServiceIsChecked(!hasEnabledServiceIsChecked)}/>}
            label="有効なサービスありのグループのみを表示"
          />
          <FormControlLabel
            control={<Checkbox checked={hasEnabledConnectionIsChecked} onChange={() => setHasEnabledConnectionIsChecked(!hasEnabledConnectionIsChecked)}/>}
            label="有効なコネクションありのグループのみを表示"
          />
          <Button onClick={() => setGroupDialogIsOpen(!groupDialogIsOpen)} >(メール送信用)メールアドレス一覧表示</Button>
          {
            groupDialogIsOpen
              ? (<p>
                {template?.group?.filter((item) => {
                  if (!expired_status0IsChecked && item.expired_status === 0) { return false }
                  if (!expired_status1IsChecked && item.expired_status === 1) { return false }
                  if (!expired_status2IsChecked && item.expired_status === 2) { return false }
                  if (!expired_status3IsChecked && item.expired_status === 3) { return false }
                  if (!member_type90IsChecked && item.member_type === 90) {return false}
                  if (!member_type99IsChecked && item.member_type === 99) {return false}
                  if (hasEnabledServiceIsChecked){
                    if (service?.filter((s) => s.group_id === item.ID && s.enable).length === 0) {
                      return false
                    }
                  }
                  if (hasEnabledConnectionIsChecked){
                    if (connection?.filter((c) => c.service?.group_id === item.ID && c.enable).length === 0) {
                      return false
                    }
                  }

                  if (item.member_expired === '' || item.member_expired === null) { return true }
                  if (new Date() < new Date(item.member_expired.split('T')[0])) { return false }
                  return true
                }).map(((group) => 
                  group.users?.filter((user) => 
                    user.level < 3
                  ).map((user) => 
                    user.email + ","
                  )
                ))
                }
              </p>
              ) : (<></>)
          }
        </Grid>
        <Grid item xs={12}>
          <MemoGroup
            key={'group_memo'}
            data={template?.group}
            setReload={setReload}
          />
        </Grid>
      </Grid>
    </DashboardComponent>
  )
}
