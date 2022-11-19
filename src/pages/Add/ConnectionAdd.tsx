import React, {Fragment, useEffect, useState} from "react";
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {Get} from "../../api/Group";
import {DefaultGroupDetailData} from "../../interface";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
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
    Typography
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {StyledFormControlFormSelect, StyledTextFieldLong, StyledTextFieldVeryLong,} from "./style";
import {ObjectShape} from "yup/lib/object";
import {Post} from "../../api/Connection";
import {useRecoilValue} from "recoil";
import {TemplateState} from "../../api/Recoil";


export default function ConnectionAdd() {
    const {enqueueSnackbar} = useSnackbar();
    const template = useRecoilValue(TemplateState);
    const [group, setGroup] = useState(DefaultGroupDetailData);
    const navigate = useNavigate();
    const [serviceType, setServiceType] = React.useState("");
    const [serviceID, setServiceID] = React.useState(0);
    let groupID: string | undefined;
    ({id: groupID} = useParams());

    useEffect(() => {
        Get(groupID!).then(res => {
            console.log(res.data);
            if (res.error === "") {
                setGroup(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, [])

    const validationSchema = Yup.lazy(values => {
        let obj: ObjectShape = {
            connection_type: Yup.string()
                .required('接続情報を選択してください')
                .min(1, "正しく選択してください"),
            preferred_ap: Yup.string()
                .required('希望接続場所を選択してください')
                .min(1, "正しく選択してください"),
            monitor: Yup.bool(),
            comment: Yup.string(),
        }

        if ((template.connections?.find(ct => ct.type === values.connection_type)?.need_comment ?? false)) {
            obj["connection_comment"] = Yup.string()
                .required('その他の項目を入力してください')
        }

        if ((template.connections?.find(ct => ct.type === values.connection_type)?.need_internet ?? false)) {
            obj["ntt"] = Yup.string()
                .required('接続情報(NTT)を選択してください')
                .min(1, "正しく選択してください")
            obj["ntt_comment"] = Yup.string()
            obj["address"] = Yup.string()
                .required("終端先ユーザの市町村を入力してください")
            obj["term_ip"] = Yup.string()
                .required("終端アドレスを入力してください")
        }

        if ((template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_route)) {
            if (
                (group.services?.find(service => service.ID === serviceID)!.ip!.filter(ip => ip.version === 4)?.length ?? 0) > 0
                ||
                template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_global_as
            ) {
                obj["ipv4_route"] = Yup.string()
                    .required('IPv4経路広告方法を選択してください')
                    .min(1, "正しく選択してください")
                obj["ipv4_route_comment"] = Yup.string()
            }
            console.log(group.services?.find(service => service.ID === serviceID)!.ip!)
            if (
                (group.services?.find(service => service.ID === serviceID)!.ip!.filter(ip => ip.version === 6)?.length ?? 0) > 0
                ||
                template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_global_as
            ) {
                obj["ipv6_route"] = Yup.string()
                    .required('IPv6経路広告方法を選択してください')
                    .min(1, "正しく選択してください")
                obj["ipv6_route_comment"] = Yup.string()
            }
        }

        return Yup.object().shape(obj)
    });

    const {register, control, handleSubmit, formState: {errors}, watch} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            address: "",
            connection_type: "",
            connection_comment: "",
            ipv4_route: "",
            ipv4_route_comment: "",
            ipv6_route: "",
            ipv6_route_comment: "",
            ntt: "",
            ntt_comment: "",
            preferred_ap: "",
            term_ip: "",
            monitor: false,
            comment: ""
        }
    });

    const connectionType = watch("connection_type");
    const ipv4Route = watch("ipv4_route");
    const ipv6Route = watch("ipv6_route");
    const ntt = watch("ntt");

    const onSubmit = (data: any, e: any) => {
        console.log(data, e)
        let request: any = {
            connection_type: data.connection_type,
            preferred_ap: data.preferred_ap,
            monitor: data.monitor,
            comment: data.comment,
        };

        if ((template.connections?.find(ct => ct.type === connectionType)?.need_comment ?? false)) {
            request.comment_type = data.comment_type
        }
        if ((template.connections?.find(ct => ct.type === connectionType)?.need_internet ?? false)) {
            // check ntt(etc) form
            if (data.ntt === "etc") {
                request.ntt = data.ntt_comment
            } else {
                request.ntt = data.ntt
            }
            request.address = data.address
            request.term_ip = data.term_ip
        }

        if ((template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_route)) {
            if (
                (group.services?.find(service => service.ID === serviceID)!.ip!.filter(ip => ip.version === 4)?.length ?? 0) > 0
                ||
                template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_global_as
            ) {
                // check ipv4_route(etc) form
                if (data.ipv4_route === "etc") {
                    request.ipv4_route = data.ipv4_route_comment
                } else {
                    request.ipv4_route = data.ipv4_route
                }
            }
            if (
                (group.services?.find(service => service.ID === serviceID)!.ip!.filter(ip => ip.version === 6)?.length ?? 0) > 0
                ||
                template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_global_as
            ) {
                // check ipv6_route(etc) form
                if (data.ipv6_route === "etc") {
                    request.ipv6_route = data.ipv6_route_comment
                } else {
                    request.ipv6_route = data.ipv6_route
                }
            }
        }

        // check
        if (serviceID <= 0) {
            enqueueSnackbar("サービスが指定されていません。", {variant: "error"});
            return
        }

        console.log("service_id: ", serviceID);
        console.log("send_data: ", request);

        if (groupID == null) {
            enqueueSnackbar("Group IDのフォーマットが異なります。", {variant: "error"});
        }
        Post(serviceID, request).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
                navigate("/dashboard/group/" + groupID);
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
        })
    };

    const onError = (errors: any, e: any) => {
        console.log(errors, e);
        enqueueSnackbar("入力した内容を確認してください。", {variant: "error"});
    };


    return (
        <DashboardComponent title="接続情報の追加">
            <Fragment>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("service_code")}>
                            <FormLabel component="legend">1. 接続情報を登録するサービスコードを選択してください。</FormLabel>
                            <div>接続情報を登録するサービスコードを以下からお選びください。</div>
                            <Select
                                labelId="service_code"
                                id="service_code"
                                onChange={(event) => {
                                    const tmpService = group.services?.filter(data => data.ID === Number(event.target.value));
                                    if (tmpService != null) {
                                        setServiceType(tmpService[0].service_type)
                                    }
                                    setServiceID(Number(event.target.value));
                                }}
                            >
                                {
                                    group.services?.filter(tmp => tmp.add_allow).map((row, index) => (
                                        <MenuItem key={"service_code_" + index} value={row.ID}>
                                            {groupID + "-" + row.service_type + ('000' + row.service_number).slice(-3)}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {
                        serviceID !== 0 &&
                        template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)!.need_bgp &&
                      <Grid item xs={12}>
                        <FormLabel component="legend">1.1. BGPで当団体から広報する経路種類を選択してください。</FormLabel>
                          {
                              (
                                  ((group.services?.find(service => service.ID === serviceID)!.ip!.filter(ip => ip.version === 4)?.length ?? 0) > 0)
                                  ||
                                  template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_global_as
                              )
                              &&
                            <StyledFormControlFormSelect>
                              <FormLabel component="legend">IPv4 BGP広報経路</FormLabel>
                              <FormHelperText>
                                  {errors?.ipv4_route && errors.ipv4_route?.message}
                              </FormHelperText>
                              <Controller
                                name="ipv4_route"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Select
                                        aria-label="gender"
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                        }}
                                        value={field.value}
                                    >
                                        {
                                            template.ipv4_route?.map((v4Route, index) => (
                                                <MenuItem key={"ipv4_route_" + index}
                                                          value={v4Route}>{v4Route}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                )}
                              />
                            </StyledFormControlFormSelect>
                          }
                          {
                              (
                                  ((group.services?.find(service => service.ID === serviceID)!.ip!.filter(ip => ip.version === 6)?.length ?? 0) > 0)
                                  ||
                                  template.services?.find(serviceTemplate => serviceTemplate.type === serviceType)?.need_global_as
                              ) &&
                            <StyledFormControlFormSelect>
                              <FormLabel component="legend">IPv6 BGP広報経路</FormLabel>
                              <FormHelperText>
                                  {errors?.ipv6_route && errors.ipv6_route?.message}
                              </FormHelperText>
                              <Controller
                                name="ipv6_route"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Select
                                        aria-label="gender"
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                        }}
                                        value={field.value}
                                    >
                                        {
                                            template.ipv6_route?.map((v6Route, index) => (
                                                <MenuItem key={"ipv6_route_" + index}
                                                          value={v6Route}>{v6Route}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                )}
                              />
                            </StyledFormControlFormSelect>
                          }
                      </Grid>
                    }
                    {
                        ipv4Route === "etc" &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("term_ip")}>
                          <FormLabel component="legend">1.1.1. IPv4 BGP広報経路(その他)</FormLabel>
                          <StyledTextFieldLong
                            key={"ipv4_route_comment"}
                            label="IPv4 BGP広報経路(その他)"
                            variant="outlined"
                            {...register(`ipv4_route_comment`, {required: true})}
                            error={!!errors.ipv4_route_comment}
                          />
                        </FormControl>
                      </Grid>
                    }
                    {
                        ipv6Route === "etc" &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("term_ip")}>
                          <FormLabel component="legend">1.1.2. IPv6 BGP広報経路(その他)</FormLabel>
                          <StyledTextFieldLong
                            key={"ipv6_route_comment"}
                            label="IPv6 BGP広報経路(その他)"
                            variant="outlined"
                            {...register(`ipv6_route_comment`, {required: true})}
                            error={!!errors.ipv6_route_comment}
                          />
                        </FormControl>
                      </Grid>
                    }
                    {
                        serviceType !== "" &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("connection_template_id")}>
                          <FormLabel>2. 接続方式をお選びください</FormLabel>
                          <div>接続情報を登録するサービスコードを以下からお選びください。</div>
                          <FormHelperText>
                              {errors?.connection_type && errors.connection_type?.message}
                          </FormHelperText>
                          <Controller
                            name="connection_type"
                            control={control}
                            render={({field, fieldState}) => (
                                <RadioGroup
                                    aria-label="gender"
                                    onChange={(e) => {
                                        field.onChange(e.target.value)
                                    }}
                                    value={field.value}
                                >
                                    {
                                        template.connections?.map(map => (
                                            (
                                                (template.services?.find(st => st.type === serviceType)!.need_route && map.is_l2) ||
                                                (template.services?.find(st => st.type === serviceType)!.need_route && map.is_l3)
                                            ) &&
                                            <FormControlLabel key={"connection_type_" + map.type}
                                                              value={map.type} control={<Radio/>}
                                                              label={(map.name) + ": (" + (map.comment) + ")"}/>
                                        ))
                                    }
                                </RadioGroup>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    }
                    {
                        (template.connections?.find(ct => ct.type === connectionType)?.need_comment ?? false) &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("comment")}>
                          <FormLabel component="legend">2.1. その他</FormLabel>
                          <div> Cross Connectを選択された方は以下のフォームに詳しい情報(ラック情報など)をご記入ください。</div>
                          <FormHelperText>
                              {errors?.connection_comment && errors.connection_comment?.message}
                          </FormHelperText>
                          <StyledTextFieldLong
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="ご希望の接続方式をご記入ください"
                            id="comment"
                            {...register(`connection_comment`, {required: true})}
                            error={!!errors.connection_comment}
                          />
                        </FormControl>
                      </Grid>
                    }
                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("preferred_ap")}>
                            <FormLabel component="legend">3.1. 希望接続場所をお選びください</FormLabel>
                            <FormHelperText>
                                {errors?.preferred_ap && errors.preferred_ap?.message}
                            </FormHelperText>
                            <Controller
                                name="preferred_ap"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Select
                                        aria-label="gender"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        value={field.value}
                                    >
                                        {
                                            template.preferred_ap?.map((row, index) => (
                                                <MenuItem key={"preferred_ap_" + index} value={row}>{row}</MenuItem>
                                            ))

                                        }
                                    </Select>
                                )}
                            />
                        </FormControl>
                        <br/>
                        <div>(当団体のNOC一覧は https://www.homenoc.ad.jp/en/tech/backbone/ をご覧ください)</div>
                    </Grid>
                    {
                        (template.connections?.find(ct => ct.type === connectionType)?.need_internet ?? false) &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("address")}>
                          <FormLabel component="legend">3.2. 終端先ユーザの都道府県市町村</FormLabel>
                          <div>都道府県と市町村のみ記入してください。例) 大阪府貝塚市</div>
                          <FormHelperText>
                              {errors?.address && errors.address?.message}
                          </FormHelperText>
                          <StyledTextFieldLong
                            key={"address"}
                            label="終端先ユーザの都道府県市町村"
                            variant="outlined"
                            {...register(`address`, {required: true})}
                            error={!!errors.address}
                          />
                        </FormControl>
                      </Grid>
                    }
                    {
                        (template.connections?.find(ct => ct.type === connectionType)?.need_internet ?? false) &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("term_ip")}>
                          <FormLabel component="legend">3.3. トンネル終端IPアドレス</FormLabel>
                          <div>トンネル接続をご希望の方はトンネル終端先のIPv6アドレスをご記入ください</div>
                          <FormHelperText>
                              {errors?.term_ip && errors.term_ip?.message}
                          </FormHelperText>
                          <StyledTextFieldLong
                            key={"term_ip"}
                            label="終端アドレス"
                            variant="outlined"
                            {...register(`term_ip`, {required: true})}
                            error={!!errors.term_ip}
                          />
                        </FormControl>
                      </Grid>
                    }
                    {
                        (template.connections?.find(ct => ct.type === connectionType)?.need_internet ?? false) &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("ntt_template_id")}>
                          <FormLabel component="legend">3.4.
                            接続終端場所にNTTフレッツ光が利用可能かをお知らせください</FormLabel>
                          <div>接続方式に構内接続をご希望の方は何も選択せず次の項目に進んでください</div>
                          <div>当団体ではトンネル接続を利用する場合、フレッツのIPoE(IPv6)接続をご利用頂くことを推奨しております。</div>
                          <FormHelperText>
                              {errors?.ntt && errors.ntt?.message}
                          </FormHelperText>
                          <Controller
                            name="ntt"
                            control={control}
                            render={({field, fieldState}) => (
                                <RadioGroup
                                    aria-label="gender"
                                    onChange={(e) => {
                                        field.onChange(e.target.value)
                                    }}
                                    value={field.value}
                                >
                                    {
                                        template.ntts?.map(ntt => (
                                            <FormControlLabel key={"ntt_" + ntt} value={ntt} control={<Radio/>}
                                                              label={ntt}/>
                                        ))
                                    }
                                </RadioGroup>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    }
                    {
                        ntt === "etc" &&
                      <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("term_ip")}>
                          <FormLabel component="legend">3.4.1. 接続終端場所の利用状況(その他)</FormLabel>
                          <StyledTextFieldLong
                            key={"ntt_comment"}
                            label="NTT(その他)"
                            variant="outlined"
                            {...register(`ntt_comment`, {required: true})}
                            error={!!errors.ntt_comment}
                          />
                        </FormControl>
                      </Grid>
                    }
                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("monitor")}>
                            <FormLabel component="legend">4. ネットワーク監視</FormLabel>
                            <div>当団体によるネットワーク監視をご希望の場合はチェックを入れて下さい</div>
                            <div>検証用などで頻繁に接続断が発生する予定の場合は当団体からの監視はお断りいたします</div>
                            <FormHelperText>
                                {errors?.monitor && errors.monitor?.message}
                            </FormHelperText>
                            <FormControlLabel
                                control={<Controller
                                    control={control}
                                    name="monitor"
                                    render={({field: {onChange}}) => (
                                        <Checkbox
                                            color="primary"
                                            onChange={e => {
                                                onChange(e.target.checked)
                                            }}
                                        />
                                    )}/>
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
                <br/>
                <br/>
                <Box mt={3}>
                    <Button variant="contained" onClick={handleSubmit(onSubmit, onError)}>
                        申請する
                    </Button>
                </Box>
            </Fragment>
        </DashboardComponent>
    )
}
