import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import cssModule from '../../Connection/ConnectionDetail/ConnectionDialog.module.scss'
import { DefaultServiceDetailData, ServiceDetailData } from '../../../interface'
import { ServiceAddAllowButton } from './ServiceMenu'
import { useSnackbar } from 'notistack'
import { Get, Put } from '../../../api/Service'
import { ServiceJPNICTechBase } from './JPNICTech/JPNICTech'
import { ServiceJPNICAdminBase } from './JPNICAdmin/JPNICAdmin'
import { ServiceIPBase } from './IP/IP'
import {
  StyledCardRoot1,
  StyledChip1,
  StyledDivRoot1,
  StyledRootForm,
  StyledTextFieldMedium,
  StyledTextFieldLong,
  StyledTextFieldVeryShort1,
  StyledButton1,
} from '../../../style'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../../api/Recoil'
import Dashboard from '../../../components/Dashboard/Dashboard'
import { useNavigate, useParams } from 'react-router-dom'
import { GenServiceCodeOnlyService } from '../../../components/Tool'
import { ConnectionList } from './ConnectionList'

export default function ServiceDetail() {
  const template = useRecoilValue(TemplateState)
  const [reload, setReload] = useState(true)
  const [service, setService] = useState(DefaultServiceDetailData)
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()

  useEffect(() => {
    if (reload) {
      Get(Number(id)).then((res) => {
        if (res.error !== '') {
          enqueueSnackbar('' + res.error, { variant: 'error' })
          return
        }
        setService(res.data)
        setReload(false)
      })
    }
  }, [template, reload])

  return (
    <Dashboard title="Service Dialog">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ServiceStatus key={'ServiceStatus'} service={service} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ServiceOpen
            key={'ServiceOpen'}
            service={service}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ServiceMainMenu
            key={'ServiceMainMenu'}
            service={service}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StyledCardRoot1>
            <CardContent>
              <h3>Help</h3>
              <h4>開通に向けて手順</h4>
              <div>1. 該当のサービスを審査OKにする</div>
              <div>
                2.
                登録されたIPアドレスを確認/JPNICへの登録が完了すれば、該当のIPステータスを開通にする。
              </div>
              <div>3. 接続情報を元に、開通作業を行う</div>
              <div>
                4. 開通が完了すれば、接続情報からステータスを開通にする。
              </div>
            </CardContent>
          </StyledCardRoot1>
        </Grid>
        <Grid item xs={12}>
          <div className={cssModule.contract}>
            <ServiceEtc1 key={'ServiceEtc1'} service={service} />
          </div>
        </Grid>
        {template.services?.find((ser) => ser.type === service.service_type)
          ?.need_jpnic && (
          <Grid item xs={6}>
            <ServiceIPBase
              key={'ServiceIPBase'}
              ip={service.ip}
              serviceID={service.ID}
              setReload={setReload}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <ServiceEtc2 key={'ServiceEtc2'} service={service} />
        </Grid>
        {template.services?.find((ser) => ser.type === service.service_type)
          ?.need_jpnic && (
          <Grid item xs={12}>
            <ServiceJPNICBase
              key={'ServiceJPNICBase'}
              service={service}
              setReload={setReload}
            />
          </Grid>
        )}
        {template.services?.find((ser) => ser.type === service.service_type)
          ?.need_jpnic && (
          <Grid item xs={6}>
            <ServiceJPNICAdminBase
              key={'ServiceJPNICAdminBase'}
              serviceID={service.ID}
              jpnic={service.jpnic_admin}
              setReload={setReload}
            />
          </Grid>
        )}
        {template.services?.find((ser) => ser.type === service.service_type)
          ?.need_jpnic && (
          <Grid item xs={6}>
            <ServiceJPNICTechBase
              key={'ServiceJPNICTechBase'}
              serviceID={service.ID}
              jpnicAdmin={service.jpnic_admin}
              jpnicTech={service.jpnic_tech}
              setReload={setReload}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <ServiceBase
            key={'ServiceBase'}
            service={service}
            setReload={setReload}
          />
        </Grid>
        <Grid>
          <div className={cssModule.contract}></div>
        </Grid>
        <Grid item xs={12}>
          <ConnectionList
            key={'connection_list'}
            service={service}
            setReload={setReload}
          />
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </Dashboard>
  )
}

export function ServiceStatus(props: { service: ServiceDetailData }) {
  const { service } = props
  const createDate = '作成日: ' + service.CreatedAt
  const updateDate = '更新日: ' + service.UpdatedAt

  return (
    <StyledCardRoot1>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <h3>Org</h3>
            {service.org}
          </Grid>
          <br />
          <Grid item xs={6}>
            <h3>Org(English)</h3>
            {service.org_en}
          </Grid>
          <br />
          <Grid item xs={12}>
            <h3>Date</h3>
            <StyledChip1 size="small" color="primary" label={createDate} />
            <Chip size="small" color="primary" label={updateDate} />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot1>
  )
}

export function ServiceMainMenu(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props
  const navigate = useNavigate()

  const clickGroupPage = () => navigate('/dashboard/group/' + service.group_id)

  return (
    <StyledCardRoot1>
      <CardContent>
        <h3>Menu</h3>
        <ServiceAddAllowButton
          key={'serviceAddAllowButton'}
          service={service}
          setReload={setReload}
        />
        <br />
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => clickGroupPage()}
          color={'primary'}
          variant="contained"
        >
          Group
        </StyledButton1>
      </CardContent>
    </StyledCardRoot1>
  )
}

export function ServiceOpenButton(props: {
  service: ServiceDetailData
  lockInfo: boolean
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, lockInfo, setReload } = props
  const { enqueueSnackbar } = useSnackbar()

  // Update Service Information
  const updateInfo = (pass: boolean) => {
    service.pass = pass
    Put(service.ID, service).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  if (!service.pass) {
    return (
      <Button
        size="small"
        color="primary"
        disabled={lockInfo}
        onClick={() => updateInfo(true)}
      >
        審査済に変更
      </Button>
    )
  }
  return (
    <Button
      size="small"
      color="secondary"
      disabled={lockInfo}
      onClick={() => updateInfo(false)}
    >
      審査中に変更
    </Button>
  )
}

export function ServiceOpen(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props
  const [serviceCopy, setServiceCopy] = useState(service)
  const serviceCode = GenServiceCodeOnlyService(service)
  const [lock, setLockInfo] = React.useState(true)

  const clickLockInfo = () => {
    setLockInfo(!lock)
  }

  const resetAction = () => {
    setServiceCopy(service)
    setLockInfo(true)
  }

  return (
    <StyledCardRoot1>
      <CardContent>
        <h3>ServiceCode</h3>
        <Chip size="small" color="primary" label={serviceCode} />
        <br />
        <h3>Pass</h3>
        {service.pass && <Chip size="small" color="primary" label="審査OK" />}
        {!service.pass && (
          <Chip size="small" color="secondary" label="審査中/審査NG" />
        )}
        <br />
        <br />
        <StyledRootForm noValidate autoComplete="off">
          <StyledTextFieldVeryShort1
            required
            id="outlined-required"
            label="ASN"
            InputProps={{
              readOnly: lock,
            }}
            value={serviceCopy.asn}
            type="number"
            variant="outlined"
            onChange={(event) => {
              setServiceCopy({
                ...serviceCopy,
                asn: parseInt(event.target.value, 10),
              })
            }}
          />
        </StyledRootForm>
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
        <ServiceOpenButton
          service={serviceCopy}
          lockInfo={lock}
          setReload={setReload}
        />
      </CardContent>
    </StyledCardRoot1>
  )
}

export function ServiceEtc1(props: { service: ServiceDetailData }) {
  const { service } = props

  return (
    <StyledCardRoot1>
      <CardContent>
        <h3>Bandwidth</h3>
        <table aria-colspan={3}>
          <thead>
            <tr>
              <th colSpan={1} />
              <th colSpan={1}>上り</th>
              <th colSpan={1}>下り</th>
            </tr>
            <tr>
              <th>最大</th>
              <td>{service.max_upstream}Mbps</td>
              <td>{service.max_downstream}Mbps</td>
            </tr>
            <tr>
              <th>平均</th>
              <td>{service.avg_upstream}Mbps</td>
              <td>{service.avg_downstream}Mbps</td>
            </tr>
          </thead>
        </table>
        <br />
        <table aria-colspan={2}>
          <thead>
            <tr>
              <th colSpan={2}>大量に通信する可能性のあるAS</th>
            </tr>
            <tr>
              <th>AS</th>
              <td>{service.max_bandwidth_as}</td>
            </tr>
          </thead>
        </table>
      </CardContent>
    </StyledCardRoot1>
  )
}

export function ServiceEtc2(props: { service: ServiceDetailData }) {
  const { service } = props

  return (
    <Card className={cssModule.contract}>
      <CardContent>
        <h3>サービスその他情報</h3>
        <Grid container spacing={3}>
          {service.service_comment !== '' && (
            <Grid item xs={12}>
              <h3>ServiceTypeの追加情報(ServiceComment)</h3>
              {service.service_comment}
            </Grid>
          )}
          {service.bgp_comment !== '' && (
            <Grid item xs={12}>
              <h3>BGPの追加情報(BGPComment)</h3>
              {service.bgp_comment}
            </Grid>
          )}
          <Grid item xs={12}>
            <h3>その他情報(Comment)</h3>
            {service.comment !== '' && <p>{service.comment}</p>}
            {service.comment === '' && <p>なし</p>}
          </Grid>
          <Grid item xs={12}>
            <table aria-colspan={2}>
              <thead>
                <tr>
                  <th colSpan={1}>利用開始日</th>
                  <th colSpan={1}>利用終了日</th>
                </tr>
                <tr>
                  {/*<th>利用開始日</th>*/}
                  <td>{service.start_date}</td>
                  {service.end_date == null && <td>未定</td>}
                  {service.end_date != null && <td>{service.end_date}</td>}
                </tr>
              </thead>
            </table>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export function ServiceJPNICBase(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props

  return (
    <Card className={cssModule.contract}>
      <CardContent>
        <h3>JPNIC基本情報</h3>
        <ServiceJPNICDetail
          key={'ServiceJPNICDetail'}
          service={service}
          setReload={setReload}
        />
      </CardContent>
    </Card>
  )
}

export function ServiceJPNICDetail(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props
  const [lock, setLockInfo] = React.useState(true)
  const [serviceCopy, setServiceCopy] = useState(service)
  const { enqueueSnackbar } = useSnackbar()

  const clickLockInfo = () => {
    setLockInfo(!lock)
  }
  const resetAction = () => {
    setServiceCopy(service)
    setLockInfo(true)
  }

  // Update Group Information
  const updateInfo = () => {
    Put(service.ID, serviceCopy).then((res) => {
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
    <StyledDivRoot1>
      <StyledRootForm noValidate autoComplete="off">
        <StyledTextFieldMedium
          required
          id="outlined-required"
          label="Org"
          InputProps={{
            readOnly: lock,
          }}
          value={serviceCopy.org}
          variant="outlined"
          onChange={(event) => {
            setServiceCopy({ ...serviceCopy, org: event.target.value })
          }}
        />
        <StyledTextFieldMedium
          required
          id="outlined-required"
          label="Org(English)"
          InputProps={{
            readOnly: lock,
          }}
          value={serviceCopy.org_en}
          variant="outlined"
          onChange={(event) => {
            setServiceCopy({ ...serviceCopy, org_en: event.target.value })
          }}
        />
        <br />
        <StyledTextFieldVeryShort1
          required
          id="outlined-required"
          label="郵便番号"
          InputProps={{
            readOnly: lock,
          }}
          value={serviceCopy.postcode}
          variant="outlined"
          onChange={(event) => {
            setServiceCopy({ ...serviceCopy, postcode: event.target.value })
          }}
        />
        <StyledTextFieldMedium
          required
          id="outlined-required"
          label="住所"
          InputProps={{
            readOnly: lock,
          }}
          value={serviceCopy.address}
          variant="outlined"
          onChange={(event) => {
            setServiceCopy({ ...serviceCopy, address: event.target.value })
          }}
        />
        <StyledTextFieldMedium
          required
          id="outlined-required"
          label="住所(English)"
          InputProps={{
            readOnly: lock,
          }}
          value={serviceCopy.address_en}
          variant="outlined"
          onChange={(event) => {
            setServiceCopy({ ...serviceCopy, address_en: event.target.value })
          }}
        />
        <br />
        <StyledTextFieldLong
          required
          id="outlined-required"
          label="Abuse"
          InputProps={{
            readOnly: lock,
          }}
          value={serviceCopy.abuse}
          variant="outlined"
          onChange={(event) => {
            setServiceCopy({ ...serviceCopy, abuse: event.target.value })
          }}
        />
      </StyledRootForm>
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
      <Button size="small" color="primary" disabled={lock} onClick={updateInfo}>
        Apply
      </Button>
    </StyledDivRoot1>
  )
}

export function ServiceBase(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props
  const [lock, setLockInfo] = React.useState(true)
  const [serviceCopy, setServiceCopy] = useState(service)
  const { enqueueSnackbar } = useSnackbar()
  const template = useRecoilValue(TemplateState)

  const clickLockInfo = () => {
    setLockInfo(!lock)
  }
  const resetAction = () => {
    setServiceCopy(service)
    setLockInfo(true)
  }

  // Update Group Information
  const updateInfo = () => {
    Put(service.ID, serviceCopy).then((res) => {
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
    <Card>
      <CardContent>
        <Grid item xs={12}>
          <h3>その他情報</h3>
        </Grid>
        <Grid item xs={12}>
          <h4>Comment</h4>
          {service.comment !== '' && <p>{service.comment}</p>}
          {service.comment === '' && <p>なし</p>}
        </Grid>
        <Grid item xs={12}>
          <h4>Comment(BGP接続)</h4>
          {service.bgp_comment !== '' && <p>{service.bgp_comment}</p>}
          {service.bgp_comment === '' && <p>なし</p>}
        </Grid>
        <Grid item xs={12}>
          <h3>情報編集</h3>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id={'connection_type_label'}>
              サービスタイプ(注意)
            </InputLabel>
            <Select
              labelId="connection_type_label"
              id="connection_type"
              aria-label="gender"
              onChange={(event) => {
                setServiceCopy({
                  ...serviceCopy,
                  service_type: event.target.value,
                })
              }}
              value={serviceCopy.service_type}
              inputProps={{
                readOnly: lock,
              }}
            >
              {template.services?.map((service_type, index) => (
                <MenuItem
                  key={'service_template' + index}
                  value={service_type.type}
                >
                  {service_type.type}: {service_type.name}(
                  {service_type.comment})
                </MenuItem>
              ))}
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
      </CardContent>
    </Card>
  )
}
