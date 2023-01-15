import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  Button,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import {
  BGPRouterDetailData,
  ConnectionDetailData,
  ServiceDetailData,
  TunnelEndPointRouterIPTemplateData,
} from '../../../interface'
import classes from './ConnectionDialog.module.scss'
import { useSnackbar } from 'notistack'
import { Update } from '../../../api/Connection'
import { Open } from '../../../components/Dashboard/Open/Open'
import {
  StyledCardRoot3,
  StyledChip1,
  StyledChip2,
  StyledFormControlFormLong,
  StyledFormControlFormMedium,
  StyledTextFieldLong,
  StyledTextFieldMedium,
} from '../../../style'
import {
  GetConnectionWithTemplate,
  GetServiceWithTemplate,
} from '../../../api/Tool'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TemplateState } from '../../../api/Recoil'

export default function ConnectionGetDialogs(props: {
  service: ServiceDetailData
  connection: ConnectionDetailData
  reload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, connection, reload } = props
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button size="small" variant="outlined" onClick={handleClickOpen}>
        Detail
      </Button>
      <Dialog
        onClose={handleClose}
        fullScreen={true}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          style: {
            backgroundColor: '#2b2a2a',
          },
        }}
      >
        <DialogTitle id="customized-dialog-title">
          Connection Detail
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <ConnectionStatus
                key={'connectionStatus'}
                connection={connection}
                service={service}
              />
            </Grid>
            <Grid item xs={3}>
              <ConnectionEtc key={'connectionETC'} connection={connection} />
            </Grid>
            <Grid item xs={6}>
              <ConnectionOpen
                key={'connection_open'}
                connection={connection}
                service={service}
                setReload={reload}
              />
            </Grid>
            <Grid item xs={6}>
              <ConnectionUserDisplay
                key={'connection_user_display'}
                service={service}
                connection={connection}
              />
            </Grid>
            <Grid item xs={6}>
              <ConnectionEtc2
                key={'connection_etc2'}
                service={service}
                connection={connection}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export function ConnectionOpenButton(props: {
  connection: ConnectionDetailData
  lock: boolean
  reload: Dispatch<SetStateAction<boolean>>
}): any {
  const { connection, lock, reload } = props
  const { enqueueSnackbar } = useSnackbar()

  // Update Service Information
  const updateInfo = (open: boolean) => {
    connection.open = open
    connection.bgp_router = undefined
    connection.tunnel_endpoint_router_ip = undefined
    Update(connection).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      reload(true)
    })
  }

  if (!connection.open) {
    return (
      <Button
        size="small"
        color="primary"
        disabled={lock}
        onClick={() => updateInfo(true)}
      >
        開通
      </Button>
    )
  }
  return (
    <Button
      size="small"
      color="secondary"
      disabled={lock}
      onClick={() => updateInfo(false)}
    >
      未開通
    </Button>
  )
}

export function ConnectionOpen(props: {
  service: ServiceDetailData
  connection: ConnectionDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, connection, setReload } = props
  const [template] = useRecoilState(TemplateState)
  const [connectionCopy, setConnectionCopy] = useState(connection)
  const [lock, setLock] = React.useState(true)

  const clickLockInfo = () => {
    setLock(!lock)
  }
  const resetAction = () => {
    setConnectionCopy(connection)
    setLock(true)
  }

  return (
    <div>
      <StyledCardRoot3>
        <CardContent>
          <br />
          <ConnectionOpenL3User
            key={'connection_open_l3_user'}
            connection={connectionCopy}
            service={service}
            setConnection={setConnectionCopy}
            lock={lock}
          />
          <ConnectionOpenVPN
            key={'Open_VPN'}
            connection={connectionCopy}
            setConnection={setConnectionCopy}
            lock={lock}
          />
          <StyledFormControlFormMedium variant="outlined">
            <InputLabel id="bgp_router_input">BGP Router</InputLabel>
            <Select
              labelId="bgp_router_hostname"
              id="bgp_router_hostname"
              label="BGP Router"
              value={connectionCopy.bgp_router_id}
              onChange={(event) =>
                setConnectionCopy({
                  ...connectionCopy,
                  bgp_router_id: Number(event.target.value),
                })
              }
              inputProps={{
                readOnly: lock,
              }}
              type="number"
            >
              <MenuItem value={0}>なし(初期値)</MenuItem>
              {template.bgp_router?.map((row: BGPRouterDetailData) => (
                <MenuItem key={row.ID + row.hostname} value={row.ID}>
                  {row.hostname}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControlFormMedium>
          <br />
          <StyledFormControlFormLong variant="outlined">
            <InputLabel id="tunnel_endpoint_router_ip_input">
              Tunnel EndPoint Router IP
            </InputLabel>
            <Select
              labelId="tunnel_endpoint_router_ip"
              id="tunnel_endpoint_router_ip"
              label="Tunnel EndPoint Router IP"
              value={connectionCopy.tunnel_endpoint_router_ip_id}
              onChange={(event) =>
                setConnectionCopy({
                  ...connectionCopy,
                  tunnel_endpoint_router_ip_id: Number(event.target.value),
                })
              }
              inputProps={{
                readOnly: lock,
              }}
              type="number"
            >
              <MenuItem value={0}>なし(初期値)</MenuItem>
              {template.tunnel_endpoint_router_ip?.map(
                (row: TunnelEndPointRouterIPTemplateData) => (
                  <MenuItem key={row.ID + row.ip} value={row.ID}>
                    {row.tunnel_endpoint_router.hostname}
                    <b>({row.ip})</b>
                  </MenuItem>
                )
              )}
            </Select>
          </StyledFormControlFormLong>
          <br />
          <Button
            size="small"
            color="secondary"
            disabled={!lock}
            onClick={clickLockInfo}
          >
            ロック解除
          </Button>
          <Button size="small" disabled={lock} onClick={resetAction}>
            Reset
          </Button>
          <ConnectionOpenButton
            key={'connection_open_button'}
            connection={connectionCopy}
            lock={lock}
            reload={setReload}
          />
        </CardContent>
      </StyledCardRoot3>
    </div>
  )
}

export function ConnectionOpenVPN(props: {
  connection: ConnectionDetailData
  setConnection: Dispatch<SetStateAction<ConnectionDetailData>>
  lock: boolean
}) {
  const { connection, setConnection, lock } = props

  if (connection.connection_type === '') {
    return null
  }
  return (
    <div>
      <StyledTextFieldLong
        required
        id="outlined-required"
        label="対向終端アドレス"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.term_ip}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, term_ip: event.target.value })
        }}
      />
      <br />
    </div>
  )
}

export function ConnectionOpenL3User(props: {
  service: ServiceDetailData
  connection: ConnectionDetailData
  setConnection: Dispatch<SetStateAction<ConnectionDetailData>>
  lock: boolean
}) {
  const { service, connection, setConnection, lock } = props
  const template = useRecoilValue(TemplateState)

  if (
    service === undefined ||
    !template.services?.find((ser) => ser.type === service.service_type)!
      .need_route
  ) {
    return null
  }
  return (
    <div>
      <StyledTextFieldMedium
        required
        id="outlined-required"
        label="L3 IPv4(HomeNOC側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v4_our}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v4_our: event.target.value })
        }}
      />
      <StyledTextFieldMedium
        required
        id="outlined-required"
        label="L3 IPv4(ユーザ側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v4_your}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v4_your: event.target.value })
        }}
      />
      <br />
      <StyledTextFieldMedium
        required
        id="outlined-required"
        label="L3 IPv6(HomeNOC側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v6_our}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v6_our: event.target.value })
        }}
      />
      <StyledTextFieldMedium
        required
        id="outlined-required"
        label="L3 IPv6(ユーザ側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v6_your}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v6_your: event.target.value })
        }}
      />
    </div>
  )
}

export function ConnectionStatus(props: {
  service: ServiceDetailData
  connection: ConnectionDetailData
}): any {
  const { service, connection } = props
  const serviceCode =
    service.group_id +
    '-' +
    service.service_type +
    ('000' + service.service_number).slice(-3) +
    '-' +
    connection.connection_type +
    ('000' + connection.connection_number).slice(-3)
  const createDate = '作成日: ' + connection.CreatedAt
  const updateDate = '更新日: ' + connection.UpdatedAt

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>ServiceCode</h3>
            <StyledChip2 size="small" color="primary" label={serviceCode} />
            <h3>Service Info</h3>
            <StyledChip2
              size="small"
              color="primary"
              label={
                GetConnectionWithTemplate(connection.connection_type)!.name
              }
            />
          </Grid>
          <Grid item xs={6}>
            <h3>BGP IPv4</h3>
            {connection.ipv4_route !== '' && (
              <Chip
                size="small"
                color="primary"
                label={connection.ipv4_route}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <h3>BGP IPv6</h3>
            {connection.ipv6_route !== '' && (
              <Chip
                size="small"
                color="primary"
                label={connection.ipv6_route}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <h3>Date</h3>
            <StyledChip1 size="small" color="primary" label={createDate} />
            <Chip size="small" color="primary" label={updateDate} />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot3>
  )
}

export function ConnectionEtc(props: {
  connection: ConnectionDetailData
}): any {
  const { connection } = props

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>開通情報</h3>
            <Open open={connection.open} />
            <h3>インターネット接続性</h3>
            {connection.ntt}
          </Grid>
          <Grid item xs={4}>
            <h3>希望接続</h3>
            <Chip
              size="small"
              color="primary"
              label={connection.preferred_ap}
            />
          </Grid>
          <Grid item xs={8}>
            <h3>設置場所</h3>
            {connection.address}
          </Grid>
          <Grid item xs={12}>
            <h3>監視要求</h3>
            <ConnectionMonitorDisplay
              key={'ConnectionMonitor'}
              monitor={connection.monitor}
            />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot3>
  )
}

export function ConnectionMonitorDisplay(props: { monitor: boolean }) {
  const { monitor } = props

  if (monitor) {
    return <Chip size="small" color="primary" label="必要" />
  }
  return <Chip size="small" color="secondary" label="不必要" />
}

export function ConnectionUserDisplay(props: {
  service: ServiceDetailData
  connection: ConnectionDetailData
}) {
  const { service, connection } = props

  const distinctionIPAssign = (our: boolean) => {
    if (our) {
      return <td>当団体からアドレスを割当</td>
    }
    return <td>貴団体からアドレスを割当</td>
  }
  const getNOCName = () => {
    if (connection.bgp_router_id === 0 || connection.bgp_router === undefined) {
      return '希望NOCなし'
    }
    return connection.bgp_router?.noc.name
  }

  return (
    <div className={classes.contract}>
      <StyledCardRoot3>
        <CardContent>
          <h2>User側の表示</h2>

          <table aria-colspan={2}>
            <thead>
              <tr>
                <th colSpan={2}>内容</th>
              </tr>
              <tr>
                <th>サービス種別</th>
                <td>
                  {GetConnectionWithTemplate(connection.connection_type)!.name}
                </td>
              </tr>
              <tr>
                <th>利用料金</th>
                <td>0円</td>
              </tr>
              <tr>
                <th>当団体からのIPアドレスの割当</th>
                {distinctionIPAssign(
                  GetServiceWithTemplate(service.service_type)!.need_jpnic
                )}
              </tr>
            </thead>
          </table>
          <br />
          <table className={classes.contract}>
            <thead>
              <tr>
                <th colSpan={3}>接続情報</th>
              </tr>
              <tr>
                <th>接続方式</th>
                <td colSpan={2}>
                  {GetConnectionWithTemplate(connection.connection_type)!.name}
                </td>
              </tr>
              <tr>
                <th>接続NOC</th>
                <td colSpan={2}>{getNOCName()}</td>
              </tr>
              <tr>
                <th>トンネル終端アドレス（貴団体側）</th>
                <td colSpan={2}>{connection.term_ip}</td>
              </tr>
              <tr>
                <th>トンネル終端アドレス（当団体側）</th>
                <td colSpan={2}>{connection.tunnel_endpoint_router_ip?.ip}</td>
              </tr>
              <tr>
                <th colSpan={3}>当団体との間の境界アドレス</th>
              </tr>
              <tr>
                <th />
                <th>IPv4アドレス</th>
                <th>IPv6アドレス</th>
              </tr>
              <tr>
                <th>当団体側</th>
                <td>{connection.link_v4_our}</td>
                <td>{connection.link_v6_our}</td>
              </tr>
              <tr>
                <th>貴団体側</th>
                <td>{connection.link_v4_your}</td>
                <td>{connection.link_v6_your}</td>
              </tr>
            </thead>
          </table>
        </CardContent>
      </StyledCardRoot3>
    </div>
  )
}

export function ConnectionEtc2(props: {
  service: ServiceDetailData
  connection: ConnectionDetailData
}): any {
  const { connection } = props

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid container spacing={3}>
          {connection.connection_comment !== '' && (
            <Grid item xs={12}>
              <h3>ラックなどの追加情報(Connection Type Comment)</h3>
              {connection.connection_comment}
            </Grid>
          )}
          <Grid item xs={12}>
            <h3>その他情報(Comment)</h3>
            {connection.comment !== '' && <p>{connection.comment}</p>}
            {connection.comment === '' && <p>なし</p>}
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot3>
  )
}
