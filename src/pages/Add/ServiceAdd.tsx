import React, { Fragment, useEffect } from 'react'
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
  Paper,
  Radio,
  RadioGroup,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  StyledRootForm,
  StyledRootForm1,
  StyledTableRoot,
  StyledTextFieldLong,
  StyledTextFieldMedium,
  StyledTextFieldShort,
  StyledTextFieldTooVeryShort,
  StyledTextFieldVeryLong,
  StyledTextFieldVeryShort1,
} from './style'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { phoneRegExp, v4NetworkNameRegExp, v6NetworkNameRegExp } from './reg'
import { Post } from '../../api/Service'
import Dashboard from '../../components/Dashboard/Dashboard'
import { useRecoilValue } from 'recoil'
import { TemplateState } from '../../api/Recoil'

export default function ServiceAdd() {
  const template = useRecoilValue(TemplateState)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const today = new Date()
  const start_date = new Date()
  const end_date = new Date()

  const [isIpv4, setIsIpv4] = React.useState(false)
  const [ipv4Prefix, setIpv4Prefix] = React.useState('None')
  const [isIpv6, setIsIpv6] = React.useState(false)
  const [ipv6Prefix, setIpv6Prefix] = React.useState('None')
  const [isPermanent, setIsPermanent] = React.useState(false)
  const [isTrafficAs, setIsTrafficAs] = React.useState(false)
  const [ipv4Calc, setIpv4Calc] = React.useState({
    after: 0,
    half_year: 0,
    one_year: 0,
  })
  const [ipv4Count, setIpv4Count] = React.useState(0)
  start_date.setDate(start_date.getDate() + 7)
  end_date.setDate(today.getDate() + 30)
  let groupID: string | undefined
  ;({ id: groupID } = useParams())

  const isNeedJPNIC = (service_type: string) =>
    template.services?.find(
      (serviceTemplate) => serviceTemplate.type === service_type
    )?.need_jpnic ?? false

  const isGlobalAS = () =>
    template.services?.find(
      (serviceTemplate) => serviceTemplate.type === serviceType
    )?.need_global_as ?? false
  const isTransitUser = (service_type: string) => service_type === 'IP3B'

  const validationSchema = Yup.object().shape({
    service_type: Yup.string().min(1).required('service template is required'),
    acceptTerms: Yup.bool().oneOf(
      [true],
      '利用の規約に同意しないと次へ進めません。'
    ),
    hidden: Yup.bool(),
    start_date: Yup.date().required('利用開始日を入力してください'),
    end_date: Yup.date(),
    avg_upstream: Yup.number()
      .required('平均上り利用帯域を入力してください')
      .moreThan(0, '正しい帯域幅を入力してください'),
    max_upstream: Yup.number()
      .required('最大上り利用帯域を入力してください')
      .moreThan(0, '正しい帯域幅を入力してください'),
    avg_downstream: Yup.number()
      .required('平均下り利用帯域を入力してください')
      .moreThan(0, '正しい帯域幅を入力してください'),
    max_downstream: Yup.number()
      .required('最大下り利用帯域を入力してください')
      .moreThan(0, '正しい帯域幅を入力してください'),
    max_bandwidth_as: Yup.string(),
    comment: Yup.string(),

    // L2, L3 Static, L3 BGP, CoLocation
    org: Yup.string().when('service_type', {
      is: (value: string) => isNeedJPNIC(value),
      then: (value) =>
        value
          .required('Org is required')
          .max(255, 'Org must not exceed 255 characters'),
    }),
    org_en: Yup.string().when('service_type', {
      is: (value: string) => isNeedJPNIC(value),
      then: (value) =>
        value
          .required('Org(English) is required')
          .max(255, 'Org(English) must not exceed 255 characters'),
    }),
    postcode: Yup.string().when('service_type', {
      is: (value: string) => isNeedJPNIC(value),
      then: (value) =>
        value
          .required('PostCode is required')
          .min(8, 'PostCode must be at least 8 characters')
          .max(8, 'PostCode must not exceed 8 characters'),
    }),

    address: Yup.string().when('service_type', {
      is: (value: string) => isNeedJPNIC(value),
      then: (value) =>
        value
          .required('Address is required')
          .min(6, 'Address must be at least 6 characters')
          .max(255, 'Address must not exceed 255 characters'),
    }),
    address_en: Yup.string().when('service_type', {
      is: (value: string) => isNeedJPNIC(value),
      then: (value) =>
        value
          .required('Address(English) is required')
          .min(6, 'Address(English) must be at least 6 characters')
          .max(255, 'Address(English) must not exceed 255 characters'),
    }),
    abuse: Yup.string().required('Abuse is required').email(),
    jpnic_admin: Yup.object().when('service_type', {
      is: (value: string) => isNeedJPNIC(value),
      then: () =>
        Yup.object({
          is_group: Yup.bool(),
          org: Yup.string()
            .required('組織名を入力してください')
            .max(255, 'Org must not exceed 255 characters'),
          org_en: Yup.string()
            .required('組織名(English)を入力してください')
            .max(255, 'Org(English) must not exceed 255 characters'),
          mail: Yup.string()
            .required('E-Mailを入力してください')
            .max(255, 'E-Mail must not exceed 255 characters')
            .email(),
          postcode: Yup.string()
            .required('郵便番号を入力してください')
            .min(2, 'PostCode must be at least 2 characters')
            .max(20, 'PostCode must not exceed 20 characters'),
          address: Yup.string()
            .required('住所を入力してください')
            .min(6, 'Address must be at least 6 characters')
            .max(255, 'Address must not exceed 255 characters'),
          address_en: Yup.string()
            .required('住所(English)を入力してください')
            .min(6, 'Address(English) must be at least 6 characters')
            .max(255, 'Address(English) must not exceed 255 characters'),
          name: Yup.string()
            .required('グループ名 or 氏名を入力してください')
            .min(1, 'name must be at least 6 characters')
            .max(255, 'name must not exceed 255 characters'),
          name_en: Yup.string()
            .required('グループ名(English) or 氏名(English)を入力してください')
            .min(1, 'name(English) must be at least 6 characters')
            .max(255, 'name(English) must not exceed 255 characters'),
          dept: Yup.string().max(255, 'dept must not exceed 255 characters'),
          dept_en: Yup.string().max(
            255,
            'dept(English) must not exceed 255 characters'
          ),
          title: Yup.string().max(255, 'title must not exceed 255 characters'),
          title_en: Yup.string().max(
            255,
            'title(English) must not exceed 255 characters'
          ),
          country: Yup.string()
            .required('居住国を入力してください')
            .min(2, 'Country must be at least 2 characters')
            .max(40, 'Country must not exceed 40 characters'),
          tel: Yup.string()
            .required('電話番号を入力してください')
            .matches(phoneRegExp, '電話番号の形式に誤りがあります'),
          fax: Yup.string(),
        }),
    }),
    jpnic_tech: Yup.array().when('service_type', {
      is: (value: string) => isNeedJPNIC(value),
      then: (value) =>
        value.of(
          Yup.object({
            is_group: Yup.bool(),
            org: Yup.string()
              .required('組織名を入力してください')
              .max(255, 'Org must not exceed 255 characters'),
            org_en: Yup.string()
              .required('組織名(English)を入力してください')
              .max(255, 'Org(English) must not exceed 255 characters'),
            mail: Yup.string()
              .required('E-Mailを入力してください')
              .max(255, 'E-Mail must not exceed 255 characters')
              .email(),
            postcode: Yup.string()
              .required('郵便番号を入力してください')
              .min(2, 'PostCode must be at least 2 characters')
              .max(20, 'PostCode must not exceed 20 characters'),
            address: Yup.string()
              .required('住所を入力してください')
              .min(6, 'Address must be at least 6 characters')
              .max(255, 'Address must not exceed 255 characters'),
            address_en: Yup.string()
              .required('住所(English)を入力してください')
              .min(6, 'Address(English) must be at least 6 characters')
              .max(255, 'Address(English) must not exceed 255 characters'),
            name: Yup.string()
              .required('グループ名 or 氏名を入力してください')
              .min(1, 'name must be at least 6 characters')
              .max(255, 'name must not exceed 255 characters'),
            name_en: Yup.string()
              .required(
                'グループ名(English) or 氏名(English)を入力してください'
              )
              .min(1, 'name(English) must be at least 6 characters')
              .max(255, 'name(English) must not exceed 255 characters'),
            dept: Yup.string().max(255, 'dept must not exceed 255 characters'),
            dept_en: Yup.string().max(
              255,
              'dept(English) must not exceed 255 characters'
            ),
            title: Yup.string().max(
              255,
              'title must not exceed 255 characters'
            ),
            title_en: Yup.string().max(
              255,
              'title(English) must not exceed 255 characters'
            ),
            country: Yup.string()
              .required('居住国を入力してください')
              .min(2, 'Country must be at least 2 characters')
              .max(40, 'Country must not exceed 40 characters'),
            tel: Yup.string()
              .required('電話番号を入力してください')
              .matches(phoneRegExp, '電話番号の形式に誤りがあります'),
            fax: Yup.string(),
          })
        ),
    }),
    // Transit AS
    bgp_comment: Yup.string().when('service_type', {
      is: (value: string) => isTransitUser(value),
      then: (value) => value.required(`入力してください`),
    }),
    asn: Yup.number().when('service_type', {
      is: (value: string) => isTransitUser(value),
      then: (value) =>
        value
          .required(`入力してください`)
          .moreThan(0, '正しいAS番号を入力してください'),
    }),
    // is_ipv4
    route_v4: Yup.string().when({
      is: isIpv4,
      then: (value) =>
        value
          .required('ネットワーク名を入力してください')
          .min(1, 'Network Name must be at least 1 characters')
          .max(12, 'Network Name must not exceed 12 characters')
          .matches(v4NetworkNameRegExp, '文字形式に誤りがあります。'),
    }),
    // L2, L3 Static, L3 BGP, CoLocation
    plan: Yup.array().when('service_type', {
      is: (value: string) => isIpv4 && isNeedJPNIC(value),
      then: (value) =>
        value.of(
          Yup.object().shape({
            name: Yup.string().min(1, '文字を入力してください'),
            after: Yup.number().moreThan(-1, '0以上の数字を入れてください'),
            half_year: Yup.number().moreThan(-1, '0以上の数字を入れてください'),
            one_year: Yup.number().moreThan(-1, '0以上の数字を入れてください'),
          })
        ),
    }),

    // is_ipv6
    route_v6: Yup.string().when({
      is: isIpv6,
      then: (value) =>
        value
          .required('ネットワーク名を入力してください')
          .min(1, 'Network Name must be at least 1 characters')
          .max(12, 'Network Name must not exceed 12 characters')
          .matches(v6NetworkNameRegExp, '文字形式に誤りがあります。'),
    }),
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
      service_type: '',
      route_v4: '',
      route_v6: '',
      org: '',
      org_en: '',
      postcode: '',
      address: '',
      address_en: '',
      abuse: '',
      plan: [{ name: '', after: 0, half_year: 0, one_year: 0 }],
      jpnic_admin: {
        hidden: false,
        is_group: false,
        org: '',
        org_en: '',
        mail: '',
        postcode: '',
        address: '',
        address_en: '',
        name: '',
        name_en: '',
        dept: '',
        dept_en: '',
        title: '',
        title_en: '',
        country: '',
        tel: '',
        fax: '',
      },
      jpnic_tech: [
        {
          hidden: false,
          is_group: false,
          org: '',
          org_en: '',
          mail: '',
          postcode: '',
          address: '',
          address_en: '',
          name: '',
          name_en: '',
          dept: '',
          dept_en: '',
          title: '',
          title_en: '',
          country: '',
          tel: '',
          fax: '',
        },
      ],
      start_date: start_date,
      end_date: end_date,
      avg_upstream: 10,
      max_upstream: 100,
      avg_downstream: 10,
      max_downstream: 100,
      max_bandwidth_as: "",
      asn: 0,
      comment: '',
      bgp_comment: '',
    },
  })

  const {
    fields: fieldsPlan,
    append: appendPlan,
    remove: removePlan,
  } = useFieldArray({
    name: 'plan',
    control,
  })
  const {
    fields: fieldsJpnicTech,
    append: appendJpnicTech,
    remove: removeJpnicTech,
  } = useFieldArray({
    name: 'jpnic_tech',
    control,
  })

  const planFieldArray = watch('plan')
  const controlledPlanFields = fieldsPlan.map((field, index) => {
    return {
      ...field,
      ...planFieldArray[index],
    }
  })
  const jpnicAdmin = watch('jpnic_admin')

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // Plan計算
      if (name?.match(/plan./)) {
        let after = 0
        let half_year = 0
        let one_year = 0

        for (const plan of value.plan!) {
          if (plan?.after !== undefined) {
            after += Number(plan?.after)
          }
          if (plan?.half_year !== undefined) {
            half_year += Number(plan?.half_year)
          }
          if (plan?.one_year !== undefined) {
            one_year += Number(plan?.one_year)
          }
        }
        setIpv4Calc({ after: after, half_year: half_year, one_year: one_year })
      }
    })
    return () => subscription.unsubscribe()
  }, [planFieldArray])

  const jpnicTechFieldArray = watch('jpnic_tech')
  const controlledJpnicTechFields = fieldsJpnicTech.map((field, index) => {
    return {
      ...field,
      ...jpnicTechFieldArray[index],
    }
  })

  const getBool = (dataBool: boolean | undefined) => {
    return !!dataBool
  }

  const serviceType = watch('service_type')

  const onSubmit = (data: any, e: any) => {
    const start_date =
      data.start_date.getFullYear() +
      '-' +
      ('00' + (data.start_date.getMonth() + 1)).slice(-2) +
      '-' +
      ('00' + data.start_date.getDate()).slice(-2)
    let end_date = undefined
    if (!isPermanent) {
      end_date =
        data.end_date.getFullYear() +
        '-' +
        ('00' + (data.end_date.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + data.end_date.getDate()).slice(-2)
      // error process
      if (data.start_date >= data.end_date) {
        enqueueSnackbar('終了時間を修正してください。', { variant: 'error' })
        return
      }
    }

    const request: any = {
      service_type: data.service_type,
      abuse: data.abuse,
      org: data.org,
      org_en: data.org_en,
      postcode: data.postcode,
      address: data.address,
      address_en: data.address_en,
      avg_upstream: data.avg_upstream,
      max_upstream: data.max_upstream,
      avg_downstream: data.avg_downstream,
      max_downstream: data.max_downstream,
      asn: data.asn,
      comment: data.comment,
      start_date,
      end_date,
    }
    if (isTrafficAs) {
      request.max_bandwidth_as = data.max_bandwidth_as
    }

    // error process
    const base_start_date = new Date()
    base_start_date.setDate(base_start_date.getDate() + 7)
    if (data.start_date < base_start_date) {
      enqueueSnackbar('開始時間を修正してください。', { variant: 'error' })
      return
    }

    // L2, L3 Static, L3 BGP, CoLocation
    if (isNeedJPNIC(serviceType)) {
      request.jpnic_admin = data.jpnic_admin
      request.jpnic_tech = data.jpnic_tech
      const ip: any[] = []

      // plan check
      // after
      if (ipv4Count - 2 < ipv4Calc.after) {
        enqueueSnackbar('直後のアドレス数が超えています。', {
          variant: 'error',
        })
        return
      }
      if (ipv4Calc.after < ipv4Count / 4) {
        enqueueSnackbar('直後のアドレス数が少ないです。', { variant: 'error' })
        return
      }
      // half_year
      if (ipv4Count - 2 < ipv4Calc.half_year) {
        enqueueSnackbar('半年後のアドレス数が超えています。', {
          variant: 'error',
        })
        return
      }
      if (ipv4Calc.half_year < ipv4Count / 4) {
        enqueueSnackbar('半年後のアドレス数が少ないです。', {
          variant: 'error',
        })
        return
      }
      // one_year
      if (ipv4Count - 2 < ipv4Calc.one_year) {
        enqueueSnackbar('1年後のアドレス数が超えています。', {
          variant: 'error',
        })
        return
      }
      if (ipv4Calc.one_year < ipv4Count / 4) {
        enqueueSnackbar('1年後のアドレス数が少ないです。', { variant: 'error' })
        return
      }

      // ipv4
      if (isIpv4) {
        ip.push({
          version: 4,
          ip: ipv4Prefix,
          plan: data.plan,
          name: data.route_v4,
          start_date: start_date,
          end_date: end_date,
        })
      }

      // ipv6
      if (isIpv6) {
        ip.push({
          version: 6,
          ip: ipv6Prefix,
          name: data.route_v6,
          start_date: start_date,
          end_date: end_date,
        })
      }

      request.ip = ip
    }

    // Transit AS
    if (request.bgp_comment) {
      request.bgp_comment = data.bgp_comment
    }

    if (groupID == null) {
      enqueueSnackbar('Group IDのフォーマットが異なります。', {
        variant: 'error',
      })
    }

    // eslint-disable-next-line no-console
    console.log(groupID, request)

    Post(Number(groupID), request).then((res) => {
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

  // eslint-disable @ts-ignore
  return (
    <Dashboard title={'サービス情報の追加'}>
      <Fragment>
        <Grid container spacing={3}>
          <br />
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              error={errors?.hasOwnProperty('service_type')}
            >
              <FormLabel>1. ご希望のサービスをお選びください</FormLabel>
              <FormHelperText error>
                {errors?.service_type && errors.service_type?.message}
              </FormHelperText>
              <Controller
                name="service_type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    aria-label="gender"
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    value={field.value === undefined ? '' : field.value}
                  >
                    {template.services?.map(
                      (map) =>
                        !map.hidden && (
                          <FormControlLabel
                            key={'service_template_' + map.type}
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
            <br />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>1.1.0. Abuse情報</FormLabel>
              <Typography variant="subtitle1" gutterBottom component="div">
                Abuse通知用のメールアドレスを記入してください。
              </Typography>
              <FormHelperText error>
                {errors?.abuse && errors.abuse?.message}
              </FormHelperText>
              <StyledTextFieldLong
                id="abuse"
                label="Abuse"
                variant="outlined"
                {...register('abuse')}
                error={!!errors.abuse}
              />
            </FormControl>
          </Grid>
          {getBool(isNeedJPNIC(serviceType)) && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>
                  1.1.1. 割り当てを希望するIPアドレスをお知らせください
                </FormLabel>
                {/*    IPv4*/}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isIpv4}
                      onChange={() => setIsIpv4(!isIpv4)}
                      name="is_ipv4"
                      color="primary"
                    />
                  }
                  label="IPv4アドレスのアサインを希望する"
                />
                {isIpv4 && getBool(isNeedJPNIC(serviceType)) && (
                  <div>
                    <p>
                      (英大文字, 数字, "-" (ハイフン) のみを用いて12文字以上)
                    </p>
                    <Box sx={{ minWidth: 20 }}>
                      <Select
                        aria-label="gender"
                        id="ipv4_subnet"
                        value={ipv4Prefix}
                        onChange={(event) => {
                          setIpv4Prefix(event.target.value)
                          const tmpPrefix = template.ipv4?.find(
                            (item) => item === event.target.value
                          )
                          if (tmpPrefix != null) {
                            const addressCount = Math.pow(
                              2,
                              32 - parseInt(tmpPrefix.substr(1), 10)
                            )
                            setIpv4Count(addressCount)
                          }
                        }}
                      >
                        <MenuItem value={'None'} disabled={true}>
                          なし
                        </MenuItem>
                        {template.ipv4?.map((v4, index) => (
                          <MenuItem key={index} value={v4}>
                            {v4}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <br />
                    <StyledTextFieldShort
                      id="route_v4"
                      label="IPv4ネットワーク名"
                      multiline
                      variant="outlined"
                      {...register('route_v4')}
                      error={!!errors.route_v4}
                    />
                  </div>
                )}
                {/*    IPv6*/}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isIpv6}
                      onChange={() => setIsIpv6(!isIpv6)}
                      name="is_ipv6"
                      color="primary"
                    />
                  }
                  label="IPv6アドレスのアサインを希望する"
                />
                <br />
                {isIpv6 && getBool(isNeedJPNIC(serviceType)) && (
                  <div>
                    <p>
                      (英大文字, 数字, "-" (ハイフン) のみを用いて12文字以上)
                    </p>
                    <Box sx={{ minWidth: 20 }}>
                      <Select
                        aria-label="gender"
                        id="ipv6_subnet"
                        value={ipv6Prefix}
                        onChange={(event) => setIpv6Prefix(event.target.value)}
                      >
                        <MenuItem value={'None'} disabled={true}>
                          なし
                        </MenuItem>
                        {template.ipv6?.map((v6, index) => (
                          <MenuItem key={index} value={v6}>
                            {v6}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <br />
                    <StyledTextFieldShort
                      id="route_v6"
                      label="IPv6ネットワーク名"
                      multiline
                      variant="outlined"
                      {...register('route_v6')}
                      error={!!errors.route_v6}
                    />
                  </div>
                )}
              </FormControl>
              <br />
              {isIpv4 && getBool(isNeedJPNIC(serviceType)) && (
                <FormControl component="fieldset">
                  <FormLabel>
                    1.1.2. IPv4のネットワークプランをお知らせください
                  </FormLabel>
                  <div>
                    {' '}
                    IPv4アドレスの割り当てには、JPNICの定めるIPアドレスの利用率を満たして頂く必要がございます。
                  </div>
                  <div>
                    最低でも割り当てから3カ月以内に25%、6カ月以内に25%、1年以内に50％をご利用いただく必要があります。
                  </div>
                  <div>
                    以下のフォームにIPアドレスの利用計画をご記入ください。
                  </div>
                  <br />
                  {controlledPlanFields.map((field, index) => {
                    return (
                      <StyledRootForm1
                        noValidate
                        autoComplete="off"
                        key={'ipv4_plan_' + index}
                      >
                        <StyledTextFieldMedium
                          required
                          key={'name_' + index}
                          label="Name"
                          variant="outlined"
                          {...register(`plan.${index}.name`, {
                            required: true,
                          })}
                          error={!!errors.plan?.[index]?.name}
                        />
                        <StyledTextFieldTooVeryShort
                          required
                          key={'after_' + index}
                          label="直後"
                          type="number"
                          variant="outlined"
                          {...register(`plan.${index}.after`, {
                            required: true,
                          })}
                          error={!!errors.plan?.[index]?.after}
                        />
                        <StyledTextFieldTooVeryShort
                          required
                          key={'half_year_' + index}
                          label="半年後"
                          type="number"
                          variant="outlined"
                          {...register(`plan.${index}.half_year`, {
                            required: true,
                          })}
                          error={!!errors.plan?.[index]?.half_year}
                        />
                        <StyledTextFieldTooVeryShort
                          required
                          key={'one_year_' + index}
                          label="1年後"
                          type="number"
                          variant="outlined"
                          {...register(`plan.${index}.one_year`, {
                            required: true,
                          })}
                          error={!!errors.plan?.[index]?.one_year}
                        />
                        {index >= 0 && (
                          <Button
                            key={'ip_delete_' + index}
                            size="medium"
                            variant="contained"
                            color="secondary"
                            onClick={() => removePlan(index)}
                          >
                            削除
                          </Button>
                        )}
                      </StyledRootForm1>
                    )
                  })}
                  <br />
                  <Box sx={{ width: 100 }}>
                    <Button
                      key={'ip_add_append'}
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        appendPlan({
                          name: '',
                          after: 0,
                          half_year: 0,
                          one_year: 0,
                        })
                      }
                    >
                      追加
                    </Button>
                  </Box>
                  <br />
                  <TableContainer component={Paper}>
                    <StyledTableRoot size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">直後</TableCell>
                          <TableCell align="right">半年後</TableCell>
                          <TableCell align="right">1年後</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={'min_and_max'}>
                          <TableCell component="th" scope="row">
                            <b>(合計)</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>{ipv4Calc.after}</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>{ipv4Calc.half_year}</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>{ipv4Calc.one_year}</b>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableBody>
                        <TableRow key={'min_and_max'}>
                          <TableCell component="th" scope="row">
                            <b>(必要最低IP数/最大IP数)</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>
                              {ipv4Count / 4}/{ipv4Count - 2}
                            </b>
                          </TableCell>
                          <TableCell align="right">
                            <b>
                              {ipv4Count / 4}/{ipv4Count - 2}
                            </b>
                          </TableCell>
                          <TableCell align="right">
                            <b>
                              {ipv4Count / 2}/{ipv4Count - 2}
                            </b>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </StyledTableRoot>
                  </TableContainer>
                  {ipv4Count - 2 < ipv4Calc.after && (
                    <FormHelperText error>
                      直後のアドレス数が超えています。
                    </FormHelperText>
                  )}
                  {ipv4Calc.after < ipv4Count / 4 && (
                    <FormHelperText error>
                      直後のアドレス数が少ないです。
                    </FormHelperText>
                  )}
                  {ipv4Count - 2 < ipv4Calc.half_year && (
                    <FormHelperText error>
                      半年後のアドレス数が超えています。
                    </FormHelperText>
                  )}
                  {ipv4Calc.half_year < ipv4Count / 4 && (
                    <FormHelperText error>
                      半年後のアドレス数が少ないです。
                    </FormHelperText>
                  )}
                  {ipv4Count - 2 < ipv4Calc.one_year && (
                    <FormHelperText error>
                      1年後のアドレス数が超えています。
                    </FormHelperText>
                  )}
                  {ipv4Calc.one_year < ipv4Count / 2 && (
                    <FormHelperText error>
                      1年後のアドレス数が少ないです。
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            </Grid>
          )}
          {getBool(isGlobalAS()) && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>1.1.1. AS番号</FormLabel>
                <Typography variant="subtitle1" gutterBottom component="div">
                  広報したいAS番号をこちらにお書きください。
                </Typography>
                <FormHelperText error>
                  {errors?.asn && errors.asn?.message}
                </FormHelperText>
                <StyledTextFieldVeryShort1
                  required
                  id="asn"
                  label="ASN"
                  variant="outlined"
                  {...register('asn')}
                  error={!!errors.asn}
                />
                <div>複数ある場合は、コンマ「,」で区切ってください。</div>
              </FormControl>
            </Grid>
          )}
          {getBool(isGlobalAS()) && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>1.1.2. 広報する経路など</FormLabel>
                <Typography variant="subtitle1" gutterBottom component="div">
                  広報する経路などありましたら、こちらにお書きください。
                </Typography>
                <FormHelperText error>
                  {errors?.bgp_comment && errors.bgp_comment?.message}
                </FormHelperText>
                <StyledTextFieldVeryLong
                  id="bgp_comment"
                  label="bgp_comment"
                  multiline
                  rows={4}
                  variant="outlined"
                  {...register('bgp_comment')}
                  error={!!errors.bgp_comment}
                />
              </FormControl>
            </Grid>
          )}
          {getBool(isNeedJPNIC(serviceType)) && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>1.2.1. 基本登録情報</FormLabel>
                <div>JPNIC/HomeNOCに登録する情報を記入してください。</div>
                <div>（注意：郵便番号はハイフンを入力してください。）</div>
                <StyledRootForm noValidate autoComplete="off">
                  <FormHelperText error>{errors.org?.message}</FormHelperText>
                  <StyledTextFieldShort
                    id="org"
                    label="組織名"
                    multiline
                    variant="outlined"
                    {...register('org')}
                    error={!!errors.org}
                  />
                  <FormHelperText error>
                    {errors.org_en?.message}
                  </FormHelperText>
                  <StyledTextFieldShort
                    id="org_en"
                    label="組織名(英語)"
                    multiline
                    variant="outlined"
                    {...register('org_en')}
                    error={!!errors.org_en}
                  />
                  <FormHelperText error>
                    {errors.org_en?.message}
                  </FormHelperText>
                  <StyledTextFieldVeryShort1
                    id="postcode"
                    label="郵便番号"
                    multiline
                    variant="outlined"
                    {...register('postcode')}
                    error={!!errors.postcode}
                  />
                  <FormHelperText error>
                    {errors.postcode?.message}
                  </FormHelperText>
                  <StyledTextFieldLong
                    id="address"
                    label="住所(日本語)"
                    multiline
                    variant="outlined"
                    {...register('address')}
                    error={!!errors.address}
                  />
                  <FormHelperText error>
                    {errors.address?.message}
                  </FormHelperText>
                  <StyledTextFieldLong
                    id="address_en"
                    label="住所(英語)"
                    multiline
                    variant="outlined"
                    {...register('address_en')}
                    error={!!errors.address_en}
                  />
                  <FormHelperText error>
                    {errors.address_en?.message}
                  </FormHelperText>
                </StyledRootForm>
              </FormControl>
            </Grid>
          )}
          {getBool(isNeedJPNIC(serviceType)) && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>1.2.2. 管理者連絡窓口</FormLabel>
                <div>割り当てるIPアドレスの管理連絡窓口をご記入ください。</div>
                <div>（注意：郵便番号はハイフンを入力してください。）</div>
                <FormControlLabel
                  control={
                    <Controller
                      control={control}
                      name="jpnic_admin.is_group"
                      render={({ field: { onChange } }) => (
                        <Checkbox
                          color="primary"
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      )}
                    />
                  }
                  label={
                    <Typography
                      color={errors.jpnic_admin?.is_group ? 'error' : 'inherit'}
                    >
                      グループハンドルで登録する
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Controller
                      control={control}
                      name="jpnic_admin.hidden"
                      render={({ field: { onChange } }) => (
                        <Checkbox
                          color="primary"
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      )}
                    />
                  }
                  label={
                    <Typography
                      color={errors.jpnic_admin?.hidden ? 'error' : 'inherit'}
                    >
                      非公開
                    </Typography>
                  }
                />
                <br />
                <StyledRootForm noValidate autoComplete="off">
                  <FormHelperText error>
                    {errors.jpnic_admin?.org?.message}
                    <br />
                    {errors.jpnic_admin?.org_en?.message}
                  </FormHelperText>
                  <StyledTextFieldShort
                    id="org"
                    label="組織名"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.org')}
                    error={!!errors.jpnic_admin?.org?.message}
                  />
                  <StyledTextFieldShort
                    id="org_en"
                    label="組織名(英語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.org_en')}
                    error={!!errors.jpnic_admin?.org_en?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.name?.message}
                    <br />
                    {errors.jpnic_admin?.name_en?.message}
                  </FormHelperText>
                  <StyledTextFieldShort
                    id="name"
                    label="グループ名/氏名"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.name')}
                    error={!!errors.jpnic_admin?.name?.message}
                  />
                  <StyledTextFieldShort
                    id="name_en"
                    label="グループ名/氏名(英語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.name_en')}
                    error={!!errors.jpnic_admin?.name_en?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.postcode?.message}
                  </FormHelperText>
                  <StyledTextFieldVeryShort1
                    id="postcode"
                    label="郵便番号"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.postcode')}
                    error={!!errors.jpnic_admin?.postcode?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.address?.message}
                  </FormHelperText>
                  <StyledTextFieldLong
                    id="address"
                    label="住所(日本語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.address')}
                    error={!!errors.jpnic_admin?.address?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.address_en?.message}
                  </FormHelperText>
                  <StyledTextFieldLong
                    id="address_en"
                    label="住所(英語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.address_en')}
                    error={!!errors.jpnic_admin?.address_en?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.dept?.message}
                    <br />
                    {errors.jpnic_admin?.dept_en?.message}
                  </FormHelperText>
                  <StyledTextFieldMedium
                    id="dept"
                    label="部署(日本語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.dept')}
                    error={!!errors.jpnic_admin?.dept?.message}
                  />
                  <StyledTextFieldMedium
                    id="dept_en"
                    label="部署(英語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.dept_en')}
                    error={!!errors.jpnic_admin?.dept_en?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.title?.message}
                    <br />
                    {errors.jpnic_admin?.title_en?.message}
                  </FormHelperText>
                  <StyledTextFieldMedium
                    id="title"
                    label="肩書(日本語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.title')}
                    error={!!errors.jpnic_admin?.title?.message}
                  />
                  <StyledTextFieldMedium
                    id="title_en"
                    label="肩書(英語)"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.title_en')}
                    error={!!errors.jpnic_admin?.title_en?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.tel?.message}
                    <br />
                    {errors.jpnic_admin?.fax?.message}
                  </FormHelperText>
                  <StyledTextFieldMedium
                    id="tel"
                    label="電話番号"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.tel')}
                    error={!!errors.jpnic_admin?.tel?.message}
                  />
                  <StyledTextFieldMedium
                    id="fax"
                    label="Fax"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.fax')}
                    error={!!errors.jpnic_admin?.fax?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.mail?.message}
                  </FormHelperText>
                  <StyledTextFieldLong
                    id="email"
                    label="E-Mail"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.mail')}
                    error={!!errors.jpnic_admin?.mail?.message}
                  />
                  <br />
                  <FormHelperText error>
                    {errors.jpnic_admin?.country?.message}
                  </FormHelperText>
                  <StyledTextFieldMedium
                    id="country"
                    label="居住地"
                    multiline
                    variant="outlined"
                    {...register('jpnic_admin.country')}
                    error={!!errors.jpnic_admin?.country?.message}
                  />
                </StyledRootForm>
              </FormControl>
            </Grid>
          )}
          {getBool(isNeedJPNIC(serviceType)) && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>1.2.3. 技術連絡担当者</FormLabel>
                <div>割り当てるIPアドレスの管理連絡窓口をご記入ください</div>
                <div>（注意：郵便番号はハイフンを入力してください。）</div>
                {controlledJpnicTechFields.map((field, index) => {
                  return (
                    <StyledRootForm1
                      noValidate
                      autoComplete="off"
                      key={`jpnic_tech.${index}`}
                    >
                      <FormControlLabel
                        control={
                          <Controller
                            control={control}
                            name={`jpnic_tech.${index}.is_group`}
                            render={({ field: { onChange } }) => (
                              <Checkbox
                                color="primary"
                                onChange={(e) => onChange(e.target.checked)}
                              />
                            )}
                          />
                        }
                        label={
                          <Typography
                            color={
                              errors.jpnic_tech?.[index]?.is_group
                                ? 'error'
                                : 'inherit'
                            }
                          >
                            グループハンドルで登録する
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Controller
                            control={control}
                            name={`jpnic_tech.${index}.hidden`}
                            render={({ field: { onChange } }) => (
                              <Checkbox
                                color="primary"
                                onChange={(e) => onChange(e.target.checked)}
                              />
                            )}
                          />
                        }
                        label={
                          <Typography
                            color={
                              errors.jpnic_tech?.[index]?.hidden
                                ? 'error'
                                : 'inherit'
                            }
                          >
                            非公開
                          </Typography>
                        }
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.org?.message}
                        <br />
                        {errors.jpnic_tech?.[index]?.org_en?.message}
                      </FormHelperText>
                      <StyledTextFieldShort
                        id={'jpnic_tech_' + index + '_org'}
                        key={'jpnic-tech_org_' + index}
                        label="組織名"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.org`)}
                        error={!!errors.jpnic_tech?.[index]?.org}
                      />
                      <StyledTextFieldShort
                        id={'jpnic_tech_' + index + '_org_en'}
                        label="組織名(英語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.org_en`)}
                        error={!!errors.jpnic_tech?.[index]?.org_en}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.name?.message}
                        <br />
                        {errors.jpnic_tech?.[index]?.name_en?.message}
                      </FormHelperText>
                      <StyledTextFieldShort
                        id={'jpnic_tech_' + index + '_name'}
                        label="グループ名/氏名"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.name`)}
                        error={!!errors.jpnic_tech?.[index]?.name}
                      />
                      <StyledTextFieldShort
                        id={'jpnic_tech_' + index + '_name_en'}
                        label="グループ名/氏名(英語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.name_en`)}
                        error={!!errors.jpnic_tech?.[index]?.name_en}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.postcode?.message}
                      </FormHelperText>
                      <StyledTextFieldVeryShort1
                        id={'jpnic_tech_' + index + '_postcode'}
                        label="郵便番号"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.postcode`)}
                        error={!!errors.jpnic_tech?.[index]?.postcode}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.address?.message}
                      </FormHelperText>
                      <StyledTextFieldLong
                        id={'jpnic_tech_' + index + '_address'}
                        label="住所(日本語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.address`)}
                        error={!!errors.jpnic_tech?.[index]?.address?.message}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.address_en?.message}
                      </FormHelperText>
                      <StyledTextFieldLong
                        id={'jpnic_tech_' + index + '_address_en'}
                        label="住所(英語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.address_en`)}
                        error={
                          !!errors.jpnic_tech?.[index]?.address_en?.message
                        }
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.dept?.message}
                        <br />
                        {errors.jpnic_tech?.[index]?.dept_en?.message}
                      </FormHelperText>
                      <StyledTextFieldMedium
                        id={'jpnic_tech_' + index + '_dept'}
                        label="部署(日本語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.dept`)}
                        error={!!errors.jpnic_tech?.[index]?.dept?.message}
                      />
                      <StyledTextFieldMedium
                        id={'jpnic_tech_' + index + '_dept_en'}
                        label="部署(英語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.dept_en`)}
                        error={!!errors.jpnic_tech?.[index]?.dept_en?.message}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.title?.message}
                        <br />
                        {errors.jpnic_tech?.[index]?.title_en?.message}
                      </FormHelperText>
                      <StyledTextFieldMedium
                        id="title"
                        label="肩書(日本語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.title`)}
                        error={!!errors.jpnic_tech?.[index]?.title?.message}
                      />
                      <StyledTextFieldMedium
                        id="title_en"
                        label="肩書(英語)"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.title_en`)}
                        error={!!errors.jpnic_tech?.[index]?.title_en?.message}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.tel?.message}
                        <br />
                        {errors.jpnic_tech?.[index]?.fax?.message}
                      </FormHelperText>
                      <StyledTextFieldMedium
                        id={'jpnic_tech_' + index + '_tel'}
                        label="電話番号"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.tel`)}
                        error={!!errors.jpnic_tech?.[index]?.tel?.message}
                      />
                      <StyledTextFieldMedium
                        id={'jpnic_tech_' + index + '_fax'}
                        label="Fax"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.fax`)}
                        error={!!errors.jpnic_tech?.[index]?.fax?.message}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.mail?.message}
                      </FormHelperText>
                      <StyledTextFieldLong
                        id={'jpnic_tech_' + index + '_email'}
                        label="E-Mail"
                        multiline
                        variant="outlined"
                        type={'email'}
                        {...register(`jpnic_tech.${index}.mail`)}
                        error={!!errors.jpnic_tech?.[index]?.mail?.message}
                      />
                      <br />
                      <FormHelperText error>
                        {errors.jpnic_tech?.[index]?.country?.message}
                      </FormHelperText>
                      <StyledTextFieldMedium
                        id={'jpnic_tech_' + index + '_country'}
                        label="居住地"
                        multiline
                        variant="outlined"
                        {...register(`jpnic_tech.${index}.country`)}
                        error={!!errors.jpnic_tech?.[index]?.country?.message}
                      />
                      {index === 0 && (
                        <Button
                          key={'copy_jpnic_admin_' + index}
                          size="medium"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setValue('jpnic_tech.0', jpnicAdmin)
                          }}
                        >
                          JPNIC管理者連絡窓口をコピー
                        </Button>
                      )}
                      <br />
                      {index >= 0 && (
                        <Button
                          key={'ip_delete_' + index}
                          size="medium"
                          variant="contained"
                          color="secondary"
                          onClick={() => removeJpnicTech(index)}
                        >
                          削除
                        </Button>
                      )}
                    </StyledRootForm1>
                  )
                })}
                <br />
                <Box sx={{ width: 100 }}>
                  <Button
                    key={'jpnic_tech_add_append'}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      appendJpnicTech({
                        hidden: false,
                        is_group: false,
                        org: '',
                        org_en: '',
                        mail: '',
                        postcode: '',
                        address: '',
                        address_en: '',
                        name: '',
                        name_en: '',
                        dept: '',
                        dept_en: '',
                        title: '',
                        title_en: '',
                        country: '',
                        tel: '',
                        fax: '',
                      })
                    }
                  >
                    追加
                  </Button>
                </Box>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>2. 利用開始・終了日</FormLabel>
              <div>
                利用開始日に関しましては、ベストエフォートとなりますので、期待に応じられない可能性があります。
              </div>
              <div>
                確認のため在学を証明するもの（学生証）を提出していただく場合もありますが、ご了承ください。
              </div>
              <Box sx={{ width: 200 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label="Date of start date"
                        slotProps={{
                          textField: {
                            helperText: 'yyyy/MM/dd',
                          },
                        }}
                        disablePast
                        value={value}
                        onChange={(value) => onChange(value)}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <br />
              <b>接続終了日は未定の場合はここにチェックしてください。</b>
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPermanent}
                    onChange={() => setIsPermanent(!isPermanent)}
                    name="is_permanent"
                    color="primary"
                  />
                }
                label="接続終了日が未定"
              />
              {!isPermanent && (
                <Box sx={{ width: 200 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <br />
                    <Controller
                      name="end_date"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          disablePast
                          label="Date of end date"
                          slotProps={{
                            textField: {
                              helperText: 'yyyy/MM/dd',
                            },
                          }}
                          value={value}
                          onChange={(value) => onChange(value)}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>3. ご利用帯域について教えてください。</FormLabel>
              <div>
                本接続で利用する帯域をお知らせください。また、特定のASに対する大量通信がある場合は詳細をお知らせください。
              </div>
              <div>
                利用帯域が分からない場合は申し込み時点での想定をご記入ください。
              </div>
              <div>
                {' '}
                設備都合などによりご希望の帯域を提供できない場合がございます。
              </div>
              <br />
              <StyledRootForm noValidate autoComplete="off">
                <StyledTextFieldVeryShort1
                  id="avg_upstream"
                  label="平均上り利用帯域"
                  multiline
                  type="number"
                  variant="outlined"
                  {...register('avg_upstream')}
                  error={!!errors.avg_upstream}
                />
                <StyledTextFieldVeryShort1
                  id="max_upstream"
                  label="最大上り利用帯域"
                  multiline
                  type="number"
                  variant="outlined"
                  {...register('max_upstream')}
                  error={!!errors.max_upstream}
                />
                <br />
                <StyledTextFieldVeryShort1
                  id="avg_downstream"
                  label="平均下り利用帯域"
                  multiline
                  type="number"
                  variant="outlined"
                  {...register('avg_downstream')}
                  error={!!errors.avg_downstream}
                />
                <StyledTextFieldVeryShort1
                  id="max_downstream"
                  label="最大下り利用帯域"
                  multiline
                  type="number"
                  variant="outlined"
                  {...register('max_downstream')}
                  error={!!errors.max_downstream}
                />
              </StyledRootForm>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>
                3.1. 特定のASに対する大量の通信があるか教えてください
              </FormLabel>
              <StyledRootForm>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isTrafficAs}
                      onChange={() => setIsTrafficAs(!isTrafficAs)}
                      name="is_traffic_as"
                      color="primary"
                    />
                  }
                  label="特定のASに対する大量の通信がある"
                />
                {isTrafficAs && (
                  <div>
                    <StyledTextFieldVeryShort1
                      id="max_bandwidth_as"
                      label="AS番号"
                      multiline
                      variant="outlined"
                      {...register('max_bandwidth_as')}
                      error={!!errors.max_bandwidth_as}
                    />
                    <div>複数ある場合は、コンマ「,」で区切ってください。</div>
                  </div>
                )}
                <br />
                <b>
                  ※
                  大量の通信とは平均20Mbps程度の通信が常時発生する状況を指します
                </b>
              </StyledRootForm>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>4. その他</FormLabel>
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
    </Dashboard>
  )
}
