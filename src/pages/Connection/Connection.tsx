import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import useStyles from "../Dashboard/styles"
import {
    Card,
    CardActions,
    CardContent, FormControl, FormControlLabel,
    InputBase,
    Paper, Radio, RadioGroup,
    Typography
} from "@material-ui/core";
import {GetAll} from "../../api/Connection";
import {useSnackbar} from "notistack";
import ConnectionGetDialogs from "./ConnectionDetail/ConnectionDialog";
import {
    ConnectionDetailData,
    DefaultConnectionDetailDataArray,
    DefaultTemplateData,
} from "../../interface";
import {GetTemplate} from "../../api/Group";


export default function Connection() {
    const classes = useStyles();
    const [connections, setConnections] = useState(DefaultConnectionDetailDataArray);
    const [template, setTemplate] = useState(DefaultTemplateData);
    const [initConnections, setInitConnections] = useState(DefaultConnectionDetailDataArray);
    const [reload, setReload] = useState(true)
    const {enqueueSnackbar} = useSnackbar();
    // 1:開通 2:未開通
    const [value, setValue] = React.useState(1);

    useEffect(() => {
        if (reload) {
            GetTemplate().then(res => {
                if (res.error === "") {
                    console.log(res);
                    setTemplate(res.data);
                    console.log(template);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })

            GetAll().then(res => {
                if (res.error === "") {
                    console.log(res);
                    setConnections(res.data);
                    setInitConnections(res.data);
                    setReload(false);
                } else {
                    enqueueSnackbar("" + res.error, {variant: "error"});
                }
            })
        }
    }, []);

    const serviceCode = (connection: ConnectionDetailData) => {
        return connection.service?.group_id + "-" + connection.service?.service_template.type +
            ('000' + connection.service?.service_number).slice(-3) + "-" + connection.connection_template.type +
            ('000' + connection.connection_number).slice(-3)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value))
    };

    const checkConnection = (connection: ConnectionDetailData) => {
        if (value === 1) {
            return connection.open
        } else if (value === 2) {
            return !connection.open
        } else {
            return true;
        }
    }

    const handleFilter = (search: string) => {
        let tmp: ConnectionDetailData[];
        if (search === "") {
            tmp = initConnections;
        } else {
            tmp = initConnections.filter((connection: ConnectionDetailData) => {
                return serviceCode(connection).toLowerCase().includes(search.toLowerCase())
            });
        }
        setConnections(tmp);
    };

    return (
        <Dashboard title="Connection Info">
            <Paper component="form" className={classes.rootInput}>
                <InputBase
                    className={classes.input}
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                />
            </Paper>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="open" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio color="primary"/>} label="開通"/>
                    <FormControlLabel value={2} control={<Radio color="secondary"/>} label="未開通"/>
                </RadioGroup>
            </FormControl>
            {
                connections.filter(connection => checkConnection(connection)).map((connection: ConnectionDetailData) => (
                    <Card key={connection.ID} className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                ID: {connection.ID}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {serviceCode(connection)}
                            </Typography>
                            <br/>
                            {/*Group: {service.gr?.org}({service.group?.org_en})*/}
                        </CardContent>
                        <CardActions>
                            <ConnectionGetDialogs key={"connection_get_dialog"} connection={connection}
                                                  template={template} reload={setReload}/>
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
