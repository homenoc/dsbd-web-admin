import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Button,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import {
  BGPRouterDetailData,
  ConnectionDetailData,
  DefaultConnectionDetailData,
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
import Dashboard from '../../../components/Dashboard/Dashboard'
import { Get, Put } from '../../../api/Connection'
import { useParams } from 'react-router-dom'
import { GenServiceCode } from '../../../components/Tool'

export default function ConnectionDetail() {
  const template = useRecoilValue(TemplateState)
  const [reload, setReload] = useState(true)
  const [connection, setConnection] = useState(DefaultConnectionDetailData)
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()

  useEffect(() => {
    if (reload) {
      Get(Number(id)).then((res) => {
        if (res.error !== '') {
          enqueueSnackbar('' + res.error, { variant: 'error' })
          return
        }
        setConnection(res.data)
        setReload(false)
      })
    }
  }, [template, reload])

  return (
    <Dashboard title="Connection Detail">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <ConnectionStatus key={'connectionStatus'} connection={connection} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <ConnectionEtc key={'connectionETC'} connection={connection} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ConnectionOpen
            key={'connection_open'}
            connection={connection}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12}>
          <ConnectionUserDisplay
            key={'connection_user_display'}
            connection={connection}
          />
        </Grid>
        <Grid item xs={12}>
          <ConnectionEtc2
            key={'connection_etc2'}
            connection={connection}
            setReload={setReload}
          />
        </Grid>
      </Grid>
    </Dashboard>
  )
}

export function ConnectionOpenButton(props: {
  connection: ConnectionDetailData
  lock: boolean
  reload: Dispatch<SetStateAction<boolean>>
}) {
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
  connection: ConnectionDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { connection, setReload } = props
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
              value={connectionCopy.bgp_router_id ?? 0}
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
              value={connectionCopy.tunnel_endpoint_router_ip_id ?? 0}
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
        id="dest_address"
        label="対向終端アドレス"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.term_ip ?? ''}
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
  connection: ConnectionDetailData
  setConnection: Dispatch<SetStateAction<ConnectionDetailData>>
  lock: boolean
}) {
  const { connection, setConnection, lock } = props
  const template = useRecoilValue(TemplateState)

  if (
    connection.service === undefined ||
    !template.services?.find(
      (ser) => ser.type === connection.service?.service_type
    )?.need_route
  ) {
    return null
  }
  return (
    <div>
      <StyledTextFieldMedium
        required
        id="l3_ipv4_admin"
        label="L3 IPv4(HomeNOC側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v4_our ?? ''}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v4_our: event.target.value })
        }}
      />
      <StyledTextFieldMedium
        required
        id="l3_ipv4_user"
        label="L3 IPv4(ユーザ側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v4_your ?? ''}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v4_your: event.target.value })
        }}
      />
      <br />
      <StyledTextFieldMedium
        required
        id="l3_ipv6_admin"
        label="L3 IPv6(HomeNOC側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v6_our ?? ''}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v6_our: event.target.value })
        }}
      />
      <StyledTextFieldMedium
        required
        id="l3_ipv6_user"
        label="L3 IPv6(ユーザ側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v6_your ?? ''}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v6_your: event.target.value })
        }}
      />
    </div>
  )
}

export function ConnectionStatus(props: { connection: ConnectionDetailData }) {
  const { connection } = props
  const serviceCode = GenServiceCode(connection)
  const createDate = '作成日: ' + connection.CreatedAt
  const updateDate = '更新日: ' + connection.UpdatedAt

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>ServiceCode</h3>
            <StyledChip2 size="small" color="primary" label={serviceCode} />
            <h3>Service Type</h3>
            <StyledChip2
              size="small"
              color="primary"
              label={
                GetConnectionWithTemplate(connection.connection_type)?.name ??
                ''
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

export function ConnectionEtc(props: { connection: ConnectionDetailData }) {
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
  connection: ConnectionDetailData
}) {
  const { connection } = props

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
                  {GetConnectionWithTemplate(connection.connection_type)
                    ?.name ?? ''}
                </td>
              </tr>
              <tr>
                <th>利用料金</th>
                <td>0円</td>
              </tr>
              <tr>
                <th>当団体からのIPアドレスの割当</th>
                {distinctionIPAssign(
                  GetServiceWithTemplate(connection.service?.service_type ?? '')
                    ?.need_jpnic ?? false
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
                  {GetConnectionWithTemplate(connection.connection_type)
                    ?.name ?? ''}
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
  connection: ConnectionDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { connection, setReload } = props
  const [lock, setLockInfo] = React.useState(true)
  const [connectionCopy, setConnectionCopy] = useState(connection)
  const { enqueueSnackbar } = useSnackbar()
  const template = useRecoilValue(TemplateState)

  const clickLockInfo = () => {
    setLockInfo(!lock)
  }
  const resetAction = () => {
    setConnectionCopy(connection)
    setLockInfo(true)
  }

  // Update Group Information
  const updateInfo = () => {
    Put(connection.ID, connectionCopy).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
        setLockInfo(true)
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid>
          <h3>その他情報</h3>
        </Grid>
        <Grid container spacing={3}>
          {connection.connection_comment !== '' && (
            <Grid item xs={12}>
              <h4>ラックなどの追加情報(Connection Type Comment)</h4>
              {connection.connection_comment}
            </Grid>
          )}
          <Grid item xs={12}>
            <h4>Comment</h4>
            {connection.comment !== '' && <p>{connection.comment}</p>}
            {connection.comment === '' && <p>なし</p>}
          </Grid>
          <Grid item xs={12}>
            <h3>情報編集</h3>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id={'connection_type_label'}>
                接続タイプ(注意)
              </InputLabel>
              <Select
                labelId="connection_type_label"
                id="connection_type"
                aria-label="gender"
                onChange={(event) => {
                  setConnectionCopy({
                    ...connectionCopy,
                    connection_type: event.target.value,
                  })
                }}
                value={connectionCopy.connection_type}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.connections?.map((connect_type, index) => (
                  <MenuItem
                    key={'connection_template' + index}
                    value={connect_type.type}
                  >
                    {connect_type.name}({connect_type.comment})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="ipv4_route_select_labellabel">
                IPv4 BGP広報経路
              </InputLabel>
              <Select
                labelId="ipv4_route_select_label"
                id="ipv4_route_select"
                label="IPv4 BGP広報経路"
                aria-label="gender"
                onChange={(event) => {
                  setConnectionCopy({
                    ...connectionCopy,
                    ipv4_route: event.target.value,
                  })
                }}
                value={connectionCopy.ipv4_route ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.ipv4_route?.map((v4Route, index) => (
                  <MenuItem key={'ipv4_route_' + index} value={v4Route}>
                    {v4Route}
                  </MenuItem>
                ))}
                <MenuItem key={'ipv4_route_none'} value={''}>
                  None
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="ipv6_route_select_labellabel">
                IPv6 BGP広報経路
              </InputLabel>
              <Select
                labelId="ipv6_route_select_label"
                id="ipv6_route_select"
                label="IPv6 BGP広報経路"
                aria-label="gender"
                onChange={(event) => {
                  setConnectionCopy({
                    ...connectionCopy,
                    ipv6_route: event.target.value,
                  })
                }}
                value={connectionCopy.ipv6_route ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.ipv6_route?.map((v6Route, index) => (
                  <MenuItem key={'ipv6_route_' + index} value={v6Route}>
                    {v6Route}
                  </MenuItem>
                ))}
                <MenuItem key={'ipv6_route_none'} value={''}>
                  None
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={6}>
            <FormControl fullWidth>
              <StyledTextFieldMedium
                label="終端先ユーザの都道府県市町村"
                id="address"
                InputProps={{
                  readOnly: lock,
                }}
                variant="outlined"
                onChange={(event) => {
                  setConnectionCopy({
                    ...connectionCopy,
                    address: event.target.value,
                  })
                }}
                value={connectionCopy.address ?? ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id={'preferred_ap_label'}>希望接続場所</InputLabel>
              <Select
                labelId="preferred_ap_label"
                id="preferred_ap"
                aria-label="gender"
                onChange={(event) => {
                  setConnectionCopy({
                    ...connectionCopy,
                    preferred_ap: event.target.value,
                  })
                }}
                value={connectionCopy.preferred_ap ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.preferred_ap?.map((row, index) => (
                  <MenuItem key={'preferred_ap_' + index} value={row}>
                    {row}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id={'ntt_label'}>インターネット接続性</InputLabel>
              <Select
                labelId="ntt_label"
                id="ntt"
                aria-label="gender"
                onChange={(event) => {
                  setConnectionCopy({
                    ...connectionCopy,
                    ntt: event.target.value,
                  })
                }}
                value={connectionCopy.ntt ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.ntts?.map((ntt, index) => (
                  <MenuItem key={'ntt_' + index} value={ntt}>
                    {ntt}
                  </MenuItem>
                ))}
                <MenuItem key={'ntt_none'} value={''}>
                  None
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id={'monitor_label'}>監視の有無</InputLabel>
              <Select
                labelId="monitor_label"
                id="monitor"
                aria-label="gender"
                onChange={(event) => {
                  setConnectionCopy({
                    ...connectionCopy,
                    monitor: Number(event.target.value) === 1,
                  })
                }}
                value={connectionCopy.monitor ? 1 : 0}
                inputProps={{
                  readOnly: lock,
                }}
              >
                <MenuItem key={'monitor_enable'} value={1}>
                  有効
                </MenuItem>
                <MenuItem key={'monitor_disable'} value={0}>
                  無効
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              size="small"
              color="secondary"
              disabled={!lock}
              onClick={clickLockInfo}
            >
              ロック解除
            </Button>
            <Button size="small" onClick={resetAction} disabled={lock}>
              Reset
            </Button>
            <Button
              size="small"
              color="primary"
              disabled={lock}
              onClick={updateInfo}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot3>
  )
}
