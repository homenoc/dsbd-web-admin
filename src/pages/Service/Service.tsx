import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import {StyledCard, StyledInputBase, StyledPaperRootInput, StyledTypographyTitle} from "../Dashboard/styles"
import {
    CardActions,
    CardContent,
    FormControl,
    FormControlLabel,
    Radio, RadioGroup,
    Typography
} from "@mui/material";
import {GetAll} from "../../api/Service";
import {DefaultServiceDetailDataArray, DefaultTemplateData, ServiceDetailData} from "../../interface";
import {useSnackbar} from "notistack";
import ServiceGetDialogs from "./ServiceDetail/ServiceDialog";
import {GetTemplate} from "../../api/Group";


export default function Service() {
    const [services, setServices] = useState(DefaultServiceDetailDataArray);
    const [initServices, setInitServices] = useState(DefaultServiceDetailDataArray);
    const [template, setTemplate] = useState(DefaultTemplateData);
    const [reload, setReload] = useState(true)
    const {enqueueSnackbar} = useSnackbar();
    // 1:開通 2:未開通
    const [value, setValue] = React.useState(1);

    useEffect(() => {
        if (reload) {
            GetAll().then(res => {
                if (res.error === "") {
                    setServices(res.data);
                    setInitServices(res.data);
                    setReload(false);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
        }
    }, []);

    useEffect(() => {
        GetTemplate().then(res => {
            if (res.error === "") {
                setTemplate(res.data);
            } else {
                enqueueSnackbar("" + res.error, {variant: "error"});
            }
        })
    }, []);

    const serviceCode = (groupID: number, type: string, serviceNumber: number) => {
        return groupID + "-" + type + ('000' + serviceNumber).slice(-3)
    }

    const checkConnection = (service: ServiceDetailData) => {
        if (value === 1) {
            return service.pass
        }
        if (value === 2) {
            return !service.pass
        }
        return true;

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const handleFilter = (search: string) => {
        let tmp: ServiceDetailData[];
        if (search === "") {
            tmp = initServices;
        } else {
            tmp = initServices.filter((service: ServiceDetailData) => {
                const code = service.group_id + "-" + service.service_type + ('000' + service.service_number).slice(-3)
                return code.toLowerCase().includes(search.toLowerCase())
            });
        }
        setServices(tmp);
    };

    return (
        <Dashboard title="Service Info">
            <StyledPaperRootInput>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                />
            </StyledPaperRootInput>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="open" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="開通"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="未開通"/>
                </RadioGroup>
            </FormControl>
            {
                services.filter(service => checkConnection(service)).map((service: ServiceDetailData) => (
                    <StyledCard key={service.ID}>
                        <CardContent>
                            <StyledTypographyTitle color="textSecondary" gutterBottom>
                                ID: {service.ID}
                            </StyledTypographyTitle>
                            <Typography variant="h5" component="h2">
                                {serviceCode(service.group_id, service.service_type, service.service_number)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <ServiceGetDialogs key={service.ID + "Dialog"} service={service} reload={setReload}/>
                        </CardActions>
                    </StyledCard>
                ))
            }
        </Dashboard>
    );
}
