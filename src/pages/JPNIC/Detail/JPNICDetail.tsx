import React, {useEffect} from "react";
import {
    Button, Card, CardActions, CardContent,
    Typography,
} from "@material-ui/core";
import {
    DefaultJPNICReturnData,
    JPNICGetDetailData,
} from "../../../interface";
import useStyles from "../../Dashboard/styles";
import cssModule from "../../Connection/ConnectionDetail/ConnectionDialog.module.scss";
import {useSnackbar} from "notistack";
import Dashboard from "../../../components/Dashboard/Dashboard";
import {Get, ReturnAddress} from "../../../api/JPNIC";
import {useHistory, useParams} from "react-router-dom";
import {restfulApiConfig} from "../../../api/Config";

export default function JPNICDetail() {
    const history = useHistory();
    const [data, setData] = React.useState<JPNICGetDetailData>();
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    let url: string;
    ({url} = useParams());

    useEffect(() => {
        Get(url).then(res => {
            if (res.error === "") {
                setData(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    const handleReturnProcess = () => {
        let returnData = DefaultJPNICReturnData;
        returnData.version = Number(url.substr(0, 1));
        if (data?.ip_address !== undefined) {
            returnData.address[0] = data.ip_address;
        }
        if (data?.network_name !== undefined) {
            returnData.network_name = data.network_name;
        }
        returnData.notify_e_mail = String(restfulApiConfig.notifyEMail);

        ReturnAddress(returnData).then(res => {
            if (res.error === "") {
                enqueueSnackbar("" + res.error, {variant: "error"});
                history.push('/dashboard/jpnic');
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }

    const clickHandlePage = (handleURL: string) => {
        const version = url.substr(0, 1);
        url = "/dashboard/jpnic/handle/" + handleURL.replace(/entryinfo_handle.do\?jpnic_hdl=/g, version);

        history.push(url);
    }

    const getVersion = () => {
        const version = url.substr(0, 1);
        if (version === "4") {
            return "IPv4";
        } else if (version === "6") {
            return "IPv6";
        }
        return "";
    }

    return (
        <Dashboard title="JPNIC Detail Info">
            {
                data !== undefined &&
                <Card className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {data?.org}({data?.org_en})
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {data?.network_name}({data?.ip_address})
                        </Typography>
                        <br/>
                        <div className={cssModule.contract}>
                            <table aria-colspan={3}>
                                <thead>
                                <tr>
                                    <th colSpan={3}>内容</th>
                                </tr>
                                <tr>
                                    <th>IP Version</th>
                                    <td colSpan={2}> {getVersion()}</td>
                                </tr>
                                <tr>
                                    <th>アドレス種別</th>
                                    <td colSpan={2}> {data.type}</td>
                                </tr>
                                <tr>
                                    <th>インフラ・ユーザ区分</th>
                                    <td colSpan={2}> {data.infra_user_kind}</td>
                                </tr>
                                <tr>
                                    <th>Org</th>
                                    <td> {data.org}</td>
                                    <td> {data.org_en}</td>
                                </tr>
                                <tr>
                                    <th>郵便番号</th>
                                    <td colSpan={2}> {data.infra_user_kind}</td>
                                </tr>
                                <tr>
                                    <th>住所</th>
                                    <td> {data.address}</td>
                                    <td> {data.address_en}</td>
                                </tr>
                                <tr>
                                    <th>管理者連絡窓口</th>
                                    <td>{data.admin_jpnic_handle}</td>
                                    <td>
                                        <Button size="small" variant="outlined"
                                                onClick={() => clickHandlePage(data.admin_jpnic_handle_link)}>詳細</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <th>技術連絡担当者</th>
                                    <td>{data.tech_jpnic_handle}</td>
                                    <td>
                                        <Button size="small" variant="outlined"
                                                onClick={() => clickHandlePage(data.tech_jpnic_handle_link)}>詳細</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <th>NameServer</th>
                                    <td colSpan={2}> {data.name_server}</td>
                                </tr>
                                <tr>
                                    <th>DSレコード</th>
                                    <td colSpan={2}> {data.ds_record}</td>
                                </tr>
                                <tr>
                                    <th>通知アドレス</th>
                                    <td colSpan={2}> {data.notify_address}</td>
                                </tr>
                                <tr>
                                    <th>割当日</th>
                                    <td colSpan={2}> {data.assign_date}</td>
                                </tr>
                                <tr>
                                    <th>返却日</th>
                                    <td colSpan={2}> {data.return_date}</td>
                                </tr>
                                <tr>
                                    <th>最終更新日</th>
                                    <td colSpan={2}> {data.update_date}</td>
                                </tr>
                                </thead>
                            </table>
                        </div>

                        <br/>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color={"secondary"} onClick={() => handleReturnProcess()}>アドレスの返却</Button>
                    </CardActions>
                </Card>
            }
        </Dashboard>
    );
}
