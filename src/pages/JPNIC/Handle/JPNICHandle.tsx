import React, {useEffect} from "react";
import {
    CardActions, CardContent, Chip,
    Typography,
} from "@mui/material";
import {
    JPNICGetHandleData,
} from "../../../interface";
import {StyledCard, StyledTypographyTitle} from "../../Dashboard/styles";
import cssModule from "../../Connection/ConnectionDetail/ConnectionDialog.module.scss";
import {useSnackbar} from "notistack";
import Dashboard from "../../../components/Dashboard/Dashboard";
import {useParams} from "react-router-dom";
import {GetHandle} from "../../../api/JPNIC";

export default function JPNICHandle() {
    const [data, setData] = React.useState<JPNICGetHandleData>();
    const {enqueueSnackbar} = useSnackbar();
    let handle: string | undefined;
    ({handle} = useParams());

    useEffect(() => {
        console.log(handle)
        GetHandle(handle!).then(res => {
            if (res.error === "") {
                console.log(res);
                setData(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    return (
        <Dashboard title="JPNIC/Group Handle Detail Info">
            {
                data !== undefined &&
                <StyledCard>
                    <CardContent>
                        <StyledTypographyTitle color="textSecondary" gutterBottom>
                            {data?.org}({data?.org_en})
                        </StyledTypographyTitle>
                        <Typography variant="h5" component="h2">
                            {data?.jpnic_handle}
                        </Typography>
                        <br/>
                        <div className={cssModule.contract}>
                            <table aria-colspan={3}>
                                <thead>
                                <tr>
                                    <th colSpan={3}>内容</th>
                                </tr>
                                <tr>
                                    <th>種別</th>
                                    <td colSpan={2}>
                                        {
                                            data.jpnic_handle &&
                                            <Chip
                                                size="small"
                                                color="primary"
                                                label={"JPNICハンドル"}
                                            />
                                        }
                                        {
                                            !data.jpnic_handle &&
                                            <Chip
                                                size="small"
                                                color="primary"
                                                label={"グループハンドル"}
                                            />
                                        }
                                    </td>
                                </tr>
                                {
                                    data.jpnic_handle &&
                                    <tr>
                                        <th>名前</th>
                                        <td> {data.name}</td>
                                        <td> {data.name_en}</td>
                                    </tr>
                                }
                                {
                                    !data.jpnic_handle &&
                                    <tr>
                                        <th>組織名</th>
                                        <td> {data.name}</td>
                                        <td> {data.name_en}</td>
                                    </tr>
                                }
                                <tr>
                                    <th>E-Mail</th>
                                    <td colSpan={2}> {data.email}</td>
                                </tr>
                                <tr>
                                    <th>Org</th>
                                    <td> {data.org}</td>
                                    <td> {data.org_en}</td>
                                </tr>
                                <tr>
                                    <th>部署</th>
                                    <td>{data.division}</td>
                                    <td>{data.division_en}</td>
                                </tr>
                                <tr>
                                    <th>肩書</th>
                                    <td>{data.title}</td>
                                    <td>{data.title_en}</td>
                                </tr>
                                <tr>
                                    <th>電話番号</th>
                                    <td colSpan={2}> {data.tel}</td>
                                </tr>
                                <tr>
                                    <th>Fax</th>
                                    <td colSpan={2}> {data.fax}</td>
                                </tr>
                                <tr>
                                    <th>通知アドレス</th>
                                    <td colSpan={2}> {data.notify_address}</td>
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
                </StyledCard>
            }
        </Dashboard>
    );
}
