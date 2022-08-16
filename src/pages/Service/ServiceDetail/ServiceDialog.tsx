import React, {Dispatch, SetStateAction, useState} from "react";
import {Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid,} from "@mui/material";
import cssModule from "../../Connection/ConnectionDetail/ConnectionDialog.module.scss";
import {ServiceDetailData} from "../../../interface";
import {ServiceAddAllowButton} from "./ServiceMenu";
import {useSnackbar} from "notistack";
import {Put} from "../../../api/Service";
import {ServiceJPNICTechBase} from "./JPNICTech/JPNICTech";
import {ServiceJPNICAdminBase} from "./JPNICAdmin/JPNICAdmin";
import {ServiceIPBase} from "./IP/IP";
import {
    StyledCardRoot1,
    StyledChip1,
    StyledDivRoot1,
    StyledRootForm,
    StyledTextFieldMedium,
    StyledTextFieldVeryShort1
} from "../../../style";


export default function ServiceGetDialogs(props: {
    service: ServiceDetailData,
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {service, reload} = props
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" variant="outlined" onClick={handleClickOpen}>
                Detail
            </Button>
            <Dialog onClose={handleClose} fullScreen={true} aria-labelledby="customized-dialog-title" open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    Service Dialog
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <ServiceStatus key={"ServiceStatus"} service={service}/>
                        </Grid>
                        <Grid item xs={3}>
                            <ServiceOpen key={"ServiceOpen"} service={service} reload={reload}/>
                        </Grid>
                        <Grid item xs={3}>
                            <ServiceMainMenu key={"ServiceMainMenu"} service={service} reload={reload}/>
                        </Grid>
                        <Grid item xs={3}>
                            <StyledCardRoot1>
                                <CardContent>
                                    <h3>Help</h3>
                                    <h4>開通に向けて手順</h4>
                                    <div>1. 該当のサービスを審査OKにする</div>
                                    <div>2. 登録されたIPアドレスを確認/JPNICへの登録が完了すれば、該当のIPステータスを開通にする。</div>
                                    <div>3. 接続情報を元に、開通作業を行う</div>
                                    <div>4. 開通が完了すれば、接続情報からステータスを開通にする。</div>
                                </CardContent>
                            </StyledCardRoot1>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={cssModule.contract}>
                                <ServiceEtc key={"ServiceEtc"} service={service}/>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <ServiceIPBase key={"ServiceIPBase"} ip={service.ip} serviceID={service.ID}
                                           reload={reload}/>
                        </Grid>
                        <Grid item xs={12}>
                            <ServiceAdminBase key={"ServiceAdminBase"} service={service} reload={reload}/>
                        </Grid>
                        <Grid item xs={6}>
                            <ServiceJPNICAdminBase key={"ServiceJPNICAdminBase"} serviceID={service.ID}
                                                   jpnic={service.jpnic_admin} reload={reload}/>
                        </Grid>
                        <Grid item xs={6}>
                            <ServiceJPNICTechBase key={"ServiceJPNICTechBase"} serviceID={service.ID}
                                                  jpnicAdmin={service.jpnic_admin}
                                                  jpnicTech={service.jpnic_tech} reload={reload}/>
                        </Grid>
                        <Grid>
                            <div className={cssModule.contract}>
                            </div>
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
    );
}

export function ServiceStatus(props: { service: ServiceDetailData }): any {
    const {service} = props;
    const createDate = "作成日: " + service.CreatedAt;
    const updateDate = "更新日: " + service.UpdatedAt;

    return (
        <StyledCardRoot1>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <h3>Org</h3>
                        {service.org}
                    </Grid>
                    <br/>
                    <Grid item xs={6}>
                        <h3>Org(English)</h3>
                        {service.org_en}
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                        <h3>Date</h3>
                        <StyledChip1
                            size="small"
                            color="primary"
                            label={createDate}
                        />
                        <Chip
                            size="small"
                            color="primary"
                            label={updateDate}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </StyledCardRoot1>
    );
}

export function ServiceMainMenu(props: { service: ServiceDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const {service, reload} = props;

    return (
        <StyledCardRoot1>
            <CardContent>
                <h3>Menu</h3>
                <ServiceAddAllowButton key={"serviceAddAllowButton"} service={service} reload={reload}/>
                <br/>
            </CardContent>
        </StyledCardRoot1>
    )
}

export function ServiceOpenButton(props: {
    service: ServiceDetailData,
    lockInfo: boolean,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {service, lockInfo, reload} = props;
    const {enqueueSnackbar} = useSnackbar();

    // Update Service Information
    const updateInfo = (pass: boolean) => {
        service.pass = pass;
        Put(service.ID, service).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            reload(true);
        })
    }

    if (!service.pass) {
        return (
            <Button size="small" color="primary" disabled={lockInfo} onClick={() => updateInfo(true)}>
                審査済に変更
            </Button>
        )
    } else {
        return (
            <Button size="small" color="secondary" disabled={lockInfo} onClick={() => updateInfo(false)}>
                審査中に変更
            </Button>
        )
    }
}

export function ServiceOpen(props: { service: ServiceDetailData, reload: Dispatch<SetStateAction<boolean>> }): any {
    const {service, reload} = props;
    const [serviceCopy, setServiceCopy] = useState(service);
    const serviceCode = service.group_id + "-" + service.service_type +
        ('000' + service.service_number).slice(-3);
    const [lock, setLockInfo] = React.useState(true);

    const clickLockInfo = () => {
        setLockInfo(!lock);
    }

    const resetAction = () => {
        setServiceCopy(service);
        setLockInfo(true);
    }

    return (
        <StyledCardRoot1>
            <CardContent>
                <h3>ServiceCode</h3>
                <Chip
                    size="small"
                    color="primary"
                    label={serviceCode}
                />
                <br/>
                <h3>Pass</h3>
                {
                    service.pass &&
                  <Chip
                    size="small"
                    color="primary"
                    label="審査OK"
                  />
                }
                {
                    !service.pass &&
                  <Chip
                    size="small"
                    color="secondary"
                    label="審査中/審査NG"
                  />
                }
                <br/>
                <br/>
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
                        onChange={event => {
                            setServiceCopy({...serviceCopy, asn: parseInt(event.target.value)});
                        }}
                    />
                </StyledRootForm>
                <Button size="small" color="secondary" disabled={!lock} onClick={clickLockInfo}>ロック解除</Button>
                <Button size="small" disabled={lock} onClick={resetAction}>Reset</Button>
                <ServiceOpenButton service={serviceCopy} lockInfo={lock} reload={reload}/>
            </CardContent>
        </StyledCardRoot1>
    );
}


export function ServiceEtc(props: { service: ServiceDetailData }): any {
    const {service} = props;

    return (
        <StyledCardRoot1>
            <CardContent>
                <h3>Bandwidth</h3>
                <table aria-colspan={3}>
                    <thead>
                    <tr>
                        <th colSpan={1}/>
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
                <br/>
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
    );
}

export function ServiceAdminBase(props: {
    service: ServiceDetailData,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {service, reload} = props;

    return (
        <Card className={cssModule.contract}>
            <CardContent>
                <h3>サービス管理者情報</h3>
                <ServiceDetail key={"service_admin_info"} service={service} reload={reload}/>
                <br/>
                <Grid container spacing={3}>
                    {
                        service.service_comment !== "" &&
                      <Grid item xs={12}>
                        <h3>ServiceTypeの追加情報(ServiceComment)</h3>
                          {service.service_comment}
                      </Grid>
                    }
                    {
                        service.bgp_comment !== "" &&
                      <Grid item xs={12}>
                        <h3>BGPの追加情報(BGPComment)</h3>
                          {service.bgp_comment}
                      </Grid>
                    }
                    <Grid item xs={12}>
                        <h3>その他情報(Comment)</h3>
                        {
                            service.comment !== "" &&
                          <p>{service.comment}</p>
                        }
                        {
                            service.comment === "" &&
                          <p>なし</p>
                        }
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
                                {
                                    service.end_date == null &&
                                  <td>未定</td>
                                }
                                {
                                    service.end_date != null &&
                                  <td>{service.end_date}</td>
                                }
                            </tr>
                            </thead>
                        </table>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export function ServiceDetail(props: {
    service: ServiceDetailData,
    reload: Dispatch<SetStateAction<boolean>>
}): any {
    const {service, reload} = props;
    const [lock, setLockInfo] = React.useState(true);
    const [serviceCopy, setServiceCopy] = useState(service);
    const {enqueueSnackbar} = useSnackbar();

    const clickLockInfo = () => {
        setLockInfo(!lock);

    }
    const resetAction = () => {
        setServiceCopy(service);
        setLockInfo(true);
    }

    // Update Group Information
    const updateInfo = () => {
        Put(service.ID, serviceCopy).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
                setLockInfo(true);
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }

            reload(true);
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
                    onChange={event => {
                        setServiceCopy({...serviceCopy, org: event.target.value});
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
                    onChange={event => {
                        setServiceCopy({...serviceCopy, org_en: event.target.value});
                    }}
                />
                <br/>
                <StyledTextFieldVeryShort1
                    required
                    id="outlined-required"
                    label="郵便番号"
                    InputProps={{
                        readOnly: lock,
                    }}
                    value={serviceCopy.postcode}
                    variant="outlined"
                    onChange={event => {
                        setServiceCopy({...serviceCopy, postcode: event.target.value});
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
                    onChange={event => {
                        setServiceCopy({...serviceCopy, address: event.target.value});
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
                    onChange={event => {
                        setServiceCopy({...serviceCopy, address_en: event.target.value});
                    }}
                />
            </StyledRootForm>
            <Button size="small" color="secondary" disabled={!lock}
                    onClick={clickLockInfo}>ロック解除</Button>
            <Button size="small" onClick={resetAction} disabled={lock}>Reset</Button>
            <Button size="small" color="primary" disabled={lock}
                    onClick={updateInfo}>
                Apply
            </Button>
        </StyledDivRoot1>
    );
}
