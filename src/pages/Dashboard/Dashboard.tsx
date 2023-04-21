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
import { Card, CardContent, Chip, Grid, Stack } from '@mui/material'
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
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Stack direction="row" spacing={1}>
                  <Chip
                    color="primary"
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
                    color="error"
                    label={`未対処チケット数: ${
                      ticket?.filter((item: TicketDetailData) => !item.solved)
                        .length
                    }`}
                  />
                  <Chip
                    color="error"
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
          <Group key={'group'} data={template?.group} setReload={setReload} />
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
