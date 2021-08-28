import React, {useEffect} from "react";
import {
    Button, Card, CardActions, CardContent,
    Typography,
} from "@material-ui/core";
import {
    JPNICGetDetailData,
} from "../../../interface";
import useStyles from "../../Dashboard/styles";
import cssModule from "../../Connection/ConnectionDetail/ConnectionDialog.module.scss";
import {useSnackbar} from "notistack";
import Dashboard from "../../../components/Dashboard/Dashboard";
import {Get} from "../../../api/JPNIC";
import {useParams} from "react-router-dom";

export default function JPNICDetail() {
    const [data, setData] = React.useState<JPNICGetDetailData>();
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    let url: string;
    ({url} = useParams());

    useEffect(() => {
        console.log(url)
        Get(url).then(res => {
            if (res.error === "") {
                console.log(res);
                setData(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

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
                                    <td>{data.admin_jpnic_handle_link}</td>
                                </tr>
                                <tr>
                                    <th>技術連絡担当者</th>
                                    <td>{data.tech_jpnic_handle}</td>
                                    <td>{data.tech_jpnic_handle_link}</td>
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
                        {/*<Button size="small" color={"secondary"}*/}
                        {/*        onClick={() => handleRefundProcess(payment.ID)}>返金</Button>*/}
                    </CardActions>
                </Card>
            }
        </Dashboard>
    );
}
