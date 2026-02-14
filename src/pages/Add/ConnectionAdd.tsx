import React, { Fragment, useEffect, useState } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import { Get } from '../../api/Group'
import { DefaultGroupDetailData } from '../../interface'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  StyledFormControlFormSelect,
  StyledTextFieldLong,
  StyledTextFieldVeryLong,
} from './style'
import { Post } from '../../api/Connection'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../api/Recoil'
import { GenServiceCodeOnlyService } from '../../components/Tool'

export default function ConnectionAdd() {
  const { enqueueSnackbar } = useSnackbar()
  const template = useRecoilValue(TemplateState)
  const [group, setGroup] = useState(DefaultGroupDetailData)
  const navigate = useNavigate()
  const [serviceType, setServiceType] = React.useState('')
  const [serviceID, setServiceID] = React.useState(0)
  let groupID: string | undefined
  ;({ id: groupID } = useParams())

  useEffect(() => {
    Get(groupID!).then((res) => {
      if (res.error === '') {
        setGroup(res.data)
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
  }, [])

  const isNeedComment = (value: string) =>
    template.connections?.find((ct) => ct.type === value)?.need_comment ?? false
  const isNeedInternet = (value: string) =>
    template.connections?.find((ct) => ct.type === value)?.need_internet ??
    false
  const isIXConnection = (value: string) => value === 'IXP'
  const isCrossConnect = (value: string) =>
    template.connections?.find((ct) => ct.type === value)?.need_cross_connect ??
    false

  const isNeedBGP = () =>
    template.services?.find(
      (serviceTemplate) => serviceTemplate.type === serviceType
    )?.need_bgp ?? false
  const isNeedRoute = () =>
    template.services?.find(
      (serviceTemplate) => serviceTemplate.type === serviceType
    )?.need_route ?? false
  const isGlobalAS = () =>
    template.services?.find(
      (serviceTemplate) => serviceTemplate.type === serviceType
    )?.need_global_as ?? false
  const isIPv4Route = () =>
    (group.services
      ?.find((service) => service.ID === serviceID)
      ?.ip?.filter((ip) => ip.version === 4)?.length ?? 0) > 0 || isGlobalAS()
  const isIPv6Route = () =>
    (group.services
      ?.find((service) => service.ID === serviceID)
      ?.ip?.filter((ip) => ip.version === 6)?.length ?? 0) > 0 || isGlobalAS()

  const validationSchema = Yup.object().shape({
    connection_type: Yup.string()
      .required('接続情報を選択してください')
      .min(1, '正しく選択してください'),
    preferred_ap: Yup.string().when('connection_type', {
      is: (value: string) => !isIXConnection(value) && !isCrossConnect(value),
      then: (value) =>
        value
          .required('希望接続場所を選択してください')
          .min(1, '正しく選択してください'),
    }),
    monitor: Yup.bool(),
    comment: Yup.string(),
    rfc8950: Yup.bool(),

    connection_comment: Yup.string().when('connection_type', {
      is: (value: string) => isNeedComment(value),
      then: (value) => value.required('その他の項目を入力してください'),
    }),

    ntt: Yup.string().when('connection_type', {
      is: (value: string) => isNeedInternet(value),
      then: (value) =>
        value
          .required('接続情報(NTT)を選択してください')
          .min(1, '正しく選択してください'),
    }),
    ntt_comment: Yup.string().when('connection_type', {
      is: (value: string) => isNeedInternet(value),
      then: (value) => value.max(200),
    }),
    address: Yup.string().when('connection_type', {
      is: (value: string) => isNeedInternet(value),
      then: (value) => value.required('終端先ユーザの市町村を入力してください'),
    }),
    term_ip: Yup.string().when('connection_type', {
      is: (value: string) => isNeedInternet(value),
      then: (value) => value.required('終端アドレスを入力してください'),
    }),

    ipv4_route: Yup.string().when([], {
      is: () => isNeedBGP() && isIPv4Route(),
      then: (value) =>
        value
          .required('IPv4経路広告方法を選択してください')
          .min(1, '正しく選択してください'),
    }),
    ipv4_route_comment: Yup.string().when([], {
      is: () => isNeedBGP() && isIPv4Route(),
      then: (value) => value.max(200),
    }),

    ipv6_route: Yup.string().when([], {
      is: () => isNeedBGP() && isIPv6Route(),
      then: (value) =>
        value
          .required('IPv6経路広告方法を選択してください')
          .min(1, '正しく選択してください'),
    }),
    ipv6_route_comment: Yup.string().when([], {
      is: () => isNeedBGP() && isIPv6Route(),
      then: (value) => value.max(200),
    }),

    ix: Yup.string().when('connection_type', {
      is: (value: string) => isIXConnection(value),
      then: (value) => value.required('IXを選択してください'),
    }),
    ix_peer_type: Yup.string().when('connection_type', {
      is: (value: string) => isIXConnection(value),
      then: (value) => value.required('ピアリングタイプを選択してください'),
    }),
    ix_vlan_id: Yup.string().when(['connection_type', 'ix_peer_type'], {
      is: (connectionType: string, peerType: string) =>
        isIXConnection(connectionType) && peerType === 'PI/CUG',
      then: (value) => value.required('VLAN-IDを入力してください'),
    }),
    link_v4_your: Yup.string().when(
      ['connection_type', 'ipv4_route', 'ix_peer_type', 'rfc8950'],
      {
        is: (
          connectionType: string,
          ipv4Route: string,
          peerType: string,
          rfc8950: boolean
        ) =>
          isIXConnection(connectionType) &&
          ipv4Route &&
          ipv4Route !== '' &&
          peerType !== 'PI/CUG' &&
          !rfc8950,
        then: (value) => value.required('IPv4アドレスを入力してください'),
      }
    ),
    link_v6_your: Yup.string().when(
      ['connection_type', 'ipv6_route', 'ix_peer_type'],
      {
        is: (connectionType: string, ipv6Route: string, peerType: string) =>
          isIXConnection(connectionType) &&
          ipv6Route &&
          ipv6Route !== '' &&
          peerType !== 'PI/CUG',
        then: (value) => value.required('IPv6アドレスを入力してください'),
      }
    ),
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      address: '',
      connection_type: '',
      connection_comment: '',
      ipv4_route: '',
      ipv4_route_comment: '',
      ipv6_route: '',
      ipv6_route_comment: '',
      ntt: '',
      ntt_comment: '',
      preferred_ap: '',
      term_ip: '',
      monitor: false,
      comment: '',
      rfc8950: true,
      ix: '',
      ix_peer_type: '',
      ix_vlan_id: '',
      link_v4_your: '',
      link_v6_your: '',
    },
  })

  const connectionType = watch('connection_type')
  const ipv4Route = watch('ipv4_route')
  const ipv6Route = watch('ipv6_route')
  const ntt = watch('ntt')
  const ixPeerType = watch('ix_peer_type')
  const rfc8950 = watch('rfc8950')

  const onSubmit = (data: any) => {
    const request: any = {
      connection_type: data.connection_type,
      monitor: data.monitor,
      comment: data.comment,
      rfc8950: data.rfc8950 === true,
    }
    if (data.preferred_ap) {
      request.preferred_ap = data.preferred_ap
    }
    if (data.comment_type) {
      request.comment_type = data.comment_type
    }
    if (data.ntt) {
      request.ntt = data.ntt
      if (data.ntt_comment) {
        request.ntt = data.ntt_comment
      }
      request.address = data.address
      request.term_ip = data.term_ip
    }
    if (data.ipv4_route) {
      request.ipv4_route = data.ipv4_route
    }
    if (data.ipv4_route_comment) {
      request.ipv4_route = data.ipv4_route_comment
    }
    if (data.ipv6_route) {
      request.ipv6_route = data.ipv6_route
    }
    if (data.ipv6_route_comment) {
      request.ipv6_route = data.ipv6_route_comment
    }
    if (data.ix) {
      request.ix = data.ix
    }
    if (data.ix_peer_type) {
      request.ix_peer_type = data.ix_peer_type
    }
    if (data.ix_vlan_id) {
      request.ix_vlan_id = data.ix_vlan_id
    }
    if (data.link_v4_your && !data.rfc8950) {
      request.link_v4_your = data.link_v4_your
    }
    if (data.link_v6_your) {
      request.link_v6_your = data.link_v6_your
    }

    // check
    if (serviceID <= 0) {
      enqueueSnackbar('サービスが指定されていません。', { variant: 'error' })
      return
    }

    if (groupID == null) {
      enqueueSnackbar('Group IDのフォーマットが異なります。', {
        variant: 'error',
      })
    }
    // eslint-disable-next-line no-console
    console.log(serviceID, request)

    Post(serviceID, request).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
        navigate('/dashboard/group/' + groupID)
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

  return (
    <DashboardComponent title="接続情報の追加">
      <Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              error={errors?.hasOwnProperty('service_code')}
            >
              <FormLabel component="legend">
                1. 接続情報を登録するサービスコードを選択してください。
              </FormLabel>
              <div>
                接続情報を登録するサービスコードを以下からお選びください。
              </div>
              <Select
                labelId="service_code"
                id="service_code"
                onChange={(event) => {
                  const tmpService = group.services?.filter(
                    (data) => data.ID === Number(event.target.value)
                  )
                  if (tmpService != null) {
                    setServiceType(tmpService[0].service_type)
                  }
                  setServiceID(Number(event.target.value))
                }}
              >
                {group.services
                  ?.filter((tmp) => tmp.add_allow)
                  .map((row, index) => (
                    <MenuItem key={'service_code_' + index} value={row.ID}>
                      {GenServiceCodeOnlyService(row)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          {serviceID !== 0 && isNeedBGP() && (
            <Grid item xs={12}>
              <FormLabel component="legend">
                1.1. BGPで当団体から広報する経路種類を選択してください。
              </FormLabel>
              {isIPv4Route() && (
                <StyledFormControlFormSelect>
                  <FormLabel component="legend">IPv4 BGP広報経路</FormLabel>
                  <FormHelperText error>
                    {errors?.ipv4_route && errors.ipv4_route?.message}
                  </FormHelperText>
                  <Controller
                    name="ipv4_route"
                    control={control}
                    render={({ field }) => (
                      <Select
                        aria-label="gender"
                        onChange={(e) => {
                          field.onChange(e.target.value)
                        }}
                        value={field.value}
                      >
                        {template.ipv4_route?.map((v4Route, index) => (
                          <MenuItem key={'ipv4_route_' + index} value={v4Route}>
                            {v4Route}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </StyledFormControlFormSelect>
              )}
              {isIPv6Route() && (
                <StyledFormControlFormSelect>
                  <FormLabel component="legend">IPv6 BGP広報経路</FormLabel>
                  <FormHelperText error>
                    {errors?.ipv6_route && errors.ipv6_route?.message}
                  </FormHelperText>
                  <Controller
                    name="ipv6_route"
                    control={control}
                    render={({ field }) => (
                      <Select
                        aria-label="gender"
                        onChange={(e) => {
                          field.onChange(e.target.value)
                        }}
                        value={field.value}
                      >
                        {template.ipv6_route?.map((v6Route, index) => (
                          <MenuItem key={'ipv6_route_' + index} value={v6Route}>
                            {v6Route}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </StyledFormControlFormSelect>
              )}
            </Grid>
          )}
          {ipv4Route === 'etc' && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('term_ip')}
              >
                <FormLabel component="legend">
                  1.1.1. IPv4 BGP広報経路(その他)
                </FormLabel>
                <StyledTextFieldLong
                  key={'ipv4_route_comment'}
                  label="IPv4 BGP広報経路(その他)"
                  variant="outlined"
                  {...register(`ipv4_route_comment`, { required: true })}
                  error={!!errors.ipv4_route_comment}
                />
              </FormControl>
            </Grid>
          )}
          {ipv6Route === 'etc' && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('term_ip')}
              >
                <FormLabel component="legend">
                  1.1.2. IPv6 BGP広報経路(その他)
                </FormLabel>
                <StyledTextFieldLong
                  key={'ipv6_route_comment'}
                  label="IPv6 BGP広報経路(その他)"
                  variant="outlined"
                  {...register(`ipv6_route_comment`, { required: true })}
                  error={!!errors.ipv6_route_comment}
                />
              </FormControl>
            </Grid>
          )}
          {serviceType !== '' && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('connection_template_id')}
              >
                <FormLabel>2. 接続方式をお選びください</FormLabel>
                <div>
                  接続情報を登録するサービスコードを以下からお選びください。
                </div>
                <FormHelperText error>
                  {errors?.connection_type && errors.connection_type?.message}
                </FormHelperText>
                <Controller
                  name="connection_type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      aria-label="gender"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                      value={field.value}
                    >
                      {template.connections?.map(
                        (map) =>
                          (map.is_l2 || (isNeedRoute() && map.is_l3)) && (
                            <FormControlLabel
                              key={'connection_type_' + map.type}
                              value={map.type}
                              control={<Radio />}
                              label={map.name + ': (' + map.comment + ')'}
                            />
                          )
                      )}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          )}
          {connectionType !== '' && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">2.1. RFC8950の利用</FormLabel>
                <div>
                  RFC8950利用の場合は、IPv6ピアにてIPv4の経路交換も行います。
                </div>
                <FormControlLabel
                  control={
                    <Controller
                      control={control}
                      name="rfc8950"
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          color="primary"
                          checked={value}
                          onChange={(event) => onChange(event.target.checked)}
                        />
                      )}
                    />
                  }
                  label={<Typography>RFC8950を利用する</Typography>}
                />
              </FormControl>
            </Grid>
          )}
          {isNeedComment(connectionType) && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('comment')}
              >
                <FormLabel component="legend">2.2. その他</FormLabel>
                <div>
                  {' '}
                  直接接続を選択された方は以下のフォームに詳しい情報(ラック情報など)をご記入ください。
                </div>
                <FormHelperText error>
                  {errors?.connection_comment &&
                    errors.connection_comment?.message}
                </FormHelperText>
                <StyledTextFieldLong
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="ご希望の接続方式をご記入ください"
                  id="comment"
                  {...register(`connection_comment`, { required: true })}
                  error={!!errors.connection_comment}
                />
              </FormControl>
            </Grid>
          )}
          {isIXConnection(connectionType) && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('ix')}
              >
                <FormLabel component="legend">
                  2.3. 接続するIXを選択してください
                </FormLabel>
                <FormHelperText error>
                  {errors?.ix && errors.ix?.message}
                </FormHelperText>
                <Controller
                  name="ix"
                  control={control}
                  render={({ field }) => (
                    <Select
                      aria-label="ix"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value ?? ''}
                    >
                      {template.ix?.map((ixTemplate, index) => (
                        <MenuItem key={'ix_' + index} value={ixTemplate.name}>
                          {ixTemplate.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          )}
          {isIXConnection(connectionType) && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('ix_peer_type')}
              >
                <FormLabel component="legend">
                  2.4. ピアリングタイプを選択してください
                </FormLabel>
                <FormHelperText error>
                  {errors?.ix_peer_type && errors.ix_peer_type?.message}
                </FormHelperText>
                <Controller
                  name="ix_peer_type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      aria-label="ix_peer_type"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <FormControlLabel
                        value="パブリック"
                        control={<Radio />}
                        label="パブリック（通常のピアリングLAN）"
                      />
                      <FormControlLabel
                        value="PI/CUG"
                        control={<Radio />}
                        label="PI/CUG（プライベートピアリング）"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          )}
          {isIXConnection(connectionType) && ixPeerType === 'PI/CUG' && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('ix_vlan_id')}
              >
                <FormLabel component="legend">2.5. VLAN-ID</FormLabel>
                <div>PI/CUGのVLAN-IDを入力してください</div>
                <FormHelperText error>
                  {errors?.ix_vlan_id && errors.ix_vlan_id?.message}
                </FormHelperText>
                <StyledTextFieldLong
                  key={'ix_vlan_id'}
                  label="VLAN-ID"
                  variant="outlined"
                  {...register(`ix_vlan_id`, { required: true })}
                  error={!!errors.ix_vlan_id}
                />
              </FormControl>
            </Grid>
          )}
          {isIXConnection(connectionType) && ixPeerType !== 'PI/CUG' && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={
                  errors?.hasOwnProperty('link_v4_your') ||
                  errors?.hasOwnProperty('link_v6_your')
                }
              >
                <FormLabel component="legend">
                  2.6. IX接続アドレス（貴団体側）
                </FormLabel>
                <div>IX接続で使用する貴団体側のIPアドレスを入力してください</div>
                {!rfc8950 && (
                  <>
                    <FormHelperText error>
                      {errors?.link_v4_your && errors.link_v4_your?.message}
                    </FormHelperText>
                    <StyledTextFieldLong
                      key={'link_v4_your'}
                      label="IPv4アドレス"
                      variant="outlined"
                      {...register(`link_v4_your`, { required: true })}
                      error={!!errors.link_v4_your}
                    />
                  </>
                )}
                <FormHelperText error>
                  {errors?.link_v6_your && errors.link_v6_your?.message}
                </FormHelperText>
                <StyledTextFieldLong
                  key={'link_v6_your'}
                  label="IPv6アドレス"
                  variant="outlined"
                  {...register(`link_v6_your`, { required: true })}
                  error={!!errors.link_v6_your}
                />
                {rfc8950 && (
                  <FormHelperText>
                    RFC8950のためIPv4アドレスは入力不要です。
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}
          {!isIXConnection(connectionType) && !isCrossConnect(connectionType) && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('preferred_ap')}
              >
                <FormLabel component="legend">
                  3.1. 希望接続場所をお選びください
                </FormLabel>
                <FormHelperText error>
                  {errors?.preferred_ap && errors.preferred_ap?.message}
                </FormHelperText>
                <Controller
                  name="preferred_ap"
                  control={control}
                  render={({ field }) => (
                    <Select
                      aria-label="gender"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      {template.preferred_ap?.map((row, index) => (
                        <MenuItem key={'preferred_ap_' + index} value={row}>
                          {row}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <br />
              <div>
                (当団体のNOC一覧は https://www.homenoc.ad.jp/en/tech/backbone/
                をご覧ください)
              </div>
            </Grid>
          )}
          {isNeedInternet(connectionType) && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('address')}
              >
                <FormLabel component="legend">
                  3.2. 終端先ユーザの都道府県市町村
                </FormLabel>
                <div>
                  都道府県と市町村のみ記入してください。例) 大阪府貝塚市
                </div>
                <FormHelperText error>
                  {errors?.address && errors.address?.message}
                </FormHelperText>
                <StyledTextFieldLong
                  key={'address'}
                  label="終端先ユーザの都道府県市町村"
                  variant="outlined"
                  {...register(`address`, { required: true })}
                  error={!!errors.address}
                />
              </FormControl>
            </Grid>
          )}
          {isNeedInternet(connectionType) && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('term_ip')}
              >
                <FormLabel component="legend">
                  3.3. トンネル終端IPアドレス
                </FormLabel>
                <div>
                  トンネル接続をご希望の方はトンネル終端先のIPv6アドレスをご記入ください
                </div>
                <FormHelperText error>
                  {errors?.term_ip && errors.term_ip?.message}
                </FormHelperText>
                <StyledTextFieldLong
                  key={'term_ip'}
                  label="終端アドレス"
                  variant="outlined"
                  {...register(`term_ip`, { required: true })}
                  error={!!errors.term_ip}
                />
              </FormControl>
            </Grid>
          )}
          {isNeedInternet(connectionType) && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('ntt_template_id')}
              >
                <FormLabel component="legend">
                  3.4. 接続終端場所にNTTフレッツ光が利用可能かをお知らせください
                </FormLabel>
                <div>
                  当団体ではトンネル接続を利用する場合、フレッツのIPoE(IPv6)接続をご利用頂くことを推奨しております。
                </div>
                <FormHelperText error>
                  {errors?.ntt && errors.ntt?.message}
                </FormHelperText>
                <Controller
                  name="ntt"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      aria-label="gender"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                      value={field.value}
                    >
                      {template.ntts?.map((ntt) => (
                        <FormControlLabel
                          key={'ntt_' + ntt}
                          value={ntt}
                          control={<Radio />}
                          label={ntt}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          )}
          {ntt === 'etc' && (
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={errors?.hasOwnProperty('term_ip')}
              >
                <FormLabel component="legend">
                  3.4.1. 接続終端場所の利用状況(その他)
                </FormLabel>
                <StyledTextFieldLong
                  key={'ntt_comment'}
                  label="NTT(その他)"
                  variant="outlined"
                  {...register(`ntt_comment`, { required: true })}
                  error={!!errors.ntt_comment}
                />
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              error={errors?.hasOwnProperty('monitor')}
            >
              <FormLabel component="legend">4. ネットワーク監視</FormLabel>
              <div>
                当団体によるネットワーク監視をご希望の場合はチェックを入れて下さい
              </div>
              <div>
                検証用などで頻繁に接続断が発生する予定の場合は当団体からの監視はお断りいたします
              </div>
              <FormHelperText error>
                {errors?.monitor && errors.monitor?.message}
              </FormHelperText>
              <FormControlLabel
                control={
                  <Controller
                    control={control}
                    name="monitor"
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        color="primary"
                        onChange={(e) => {
                          onChange(e.target.checked)
                        }}
                      />
                    )}
                  />
                }
                label={<Typography>希望する</Typography>}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>5. その他</FormLabel>
              <Typography variant="subtitle1" gutterBottom component="div">
                その他、なにかありましたらこちらにお書きください
              </Typography>
              <StyledTextFieldVeryLong
                id="comment"
                label="comment"
                multiline
                rows={4}
                variant="outlined"
                {...register('comment')}
                error={!!errors.comment}
              />
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <br />
        <Box mt={3}>
          <Button variant="contained" onClick={handleSubmit(onSubmit, onError)}>
            申請する
          </Button>
        </Box>
      </Fragment>
    </DashboardComponent>
  )
}
