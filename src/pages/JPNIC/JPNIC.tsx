import React, {useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import {
    JPNICGetData,
    JPNICSearchData,
} from "../../interface";
import {useSnackbar} from "notistack";
import {GetAll} from "../../api/JPNIC";
import {
    Button, CardActions,
    CardContent, Chip,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import {restfulApiConfig} from "../../api/Config";
import {useNavigate} from "react-router-dom";
import {StyledCard, StyledInputBase, StyledPaperRootInput, StyledTypographyTitle} from '../Dashboard/styles';

export default function JPNIC() {
    const navigate = useNavigate();
    const [jpnics, setJpnics] = useState<JPNICGetData[]>();
    const [initJPNIC, setInitJPNIC] = useState<JPNICGetData[]>();
    const {enqueueSnackbar} = useSnackbar();
    const [search1, setSearch1] = React.useState("");
    const [search, setSearch] = React.useState<JPNICSearchData>({
        version: 4,
        org: String(restfulApiConfig.initJPNICSearch)
    });

    const searchChange = () => {
        GetAll(search).then(res => {
            if (res.error === "") {
                console.log(res);
                setJpnics(res.data);
                setInitJPNIC(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, version: Number(event.target.value)})
    };

    const handleFilter = (search: string) => {
        setSearch1(search);
        let tmp: JPNICGetData[];
        if (initJPNIC != null) {
            if (search === "") {
                tmp = initJPNIC;
            } else {
                tmp = initJPNIC?.filter((jpnic: JPNICGetData) => {
                    const data = jpnic.network_name + jpnic.org_name + jpnic.ip_address
                    return data.toLowerCase().includes(search.toLowerCase())
                });
            }
            setJpnics(tmp);
        }
    };

    const clickDetail = (version: number, url: string) => {
        if (version === 4) {
            // IPv4の場合は先頭に4を付加
            url = "/dashboard/jpnic/" + url.replace(/\/jpnic\/entryinfo_v4.do\?netwrk_id=/g, '4')
        } else if (version === 6) {
            // IPv6の場合は先頭に6を付加
            url = "/dashboard/jpnic/" + url.replace(/\/jpnic\/G11320.do\?netwrk_id=/g, '6')
        } else {
            return;
        }
        navigate(url);
    }

    return (
        <Dashboard title="JPNIC Info">
            <StyledPaperRootInput>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    value={search.org}
                    onChange={event => {
                        setSearch({...search, org: event.target.value})
                    }}
                />
            </StyledPaperRootInput>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="ip_version" value={search.version} onChange={handleChange}>
                    <FormControlLabel value={4} control={<Radio color="primary"/>} label="IPv4"/>
                    <FormControlLabel value={6} control={<Radio color="secondary"/>} label="IPv6"/>
                </RadioGroup>
            </FormControl>
            <Button size="small" variant="outlined" color={"primary"} onClick={() => searchChange()}>検索</Button>

            <StyledPaperRootInput>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    value={search1}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                />
            </StyledPaperRootInput>
            {
                jpnics?.map((jpnic: JPNICGetData) => (
                    <StyledCard>
                        <CardContent>
                            <StyledTypographyTitle color="textSecondary" gutterBottom>
                                Org: {jpnic.org_name}
                            </StyledTypographyTitle>
                            <Typography variant="h5" component="h2">
                                {jpnic.network_name}({jpnic.ip_address})
                            </Typography>
                            <br/>
                            <Chip
                                size="small"
                                color="primary"
                                label={jpnic.ip_address}
                            />
                            &nbsp;
                            {
                                jpnic.recep_no !== "" &&
                                <Chip
                                    size="small"
                                    color="primary"
                                    label={jpnic.recep_no}
                                />
                            }
                            &nbsp;
                            {
                                jpnic.kind_id !== "" &&
                                <Chip
                                    size="small"
                                    color="primary"
                                    label={jpnic.kind_id}
                                />
                            }
                            <br/> <br/>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color={"primary"}
                                    onClick={() => clickDetail(search.version, jpnic.detail_link)}>詳細</Button>
                        </CardActions>
                    </StyledCard>
                ))
            }
        </Dashboard>
    );
}
