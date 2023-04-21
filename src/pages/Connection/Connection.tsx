import React, { useEffect, useState } from 'react'
import Dashboard from '../../components/Dashboard/Dashboard'
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles'
import {
  Button,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup, Stack,
  Typography
} from "@mui/material";
import { GetAll } from '../../api/Connection'
import { useSnackbar } from 'notistack'
import ConnectionGetDialogs from './ConnectionDetail/ConnectionDialog'
import {
  ConnectionDetailData,
  DefaultConnectionDetailDataArray,
} from '../../interface'
import { GetTemplate } from '../../api/Group'
import { useRecoilState } from 'recoil'
import { TemplateState } from '../../api/Recoil'
import ServiceGetDialogs from "../Service/ServiceDetail/ServiceDialog";
import { useNavigate } from "react-router-dom";

export default function Connection() {
  const navigate = useNavigate()
  const [connections, setConnections] = useState(
    DefaultConnectionDetailDataArray
  )
  const [template, setTemplate] = useRecoilState(TemplateState)
  const [initConnections, setInitConnections] = useState(
    DefaultConnectionDetailDataArray
  )
  const [reload, setReload] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  // 1:開通 2:未開通
  const [value, setValue] = React.useState(1)

  useEffect(() => {
    if (reload) {
      GetTemplate().then((res) => {
        if (res.error === '') {
          setTemplate(res.data)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })

      GetAll().then((res) => {
        if (res.error === '') {
          setConnections(res.data)
          setInitConnections(res.data)
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
    }
  }, [])

  const serviceCode = (connection: ConnectionDetailData) => {
    return (
      connection.service?.group_id +
      '-' +
      connection.service?.service_type +
      ('000' + connection.service?.service_number).slice(-3) +
      '-' +
      connection.connection_type +
      ('000' + connection.connection_number).slice(-3)
    )
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value))
  }

  const checkConnection = (connection: ConnectionDetailData) => {
    if (value === 1) {
      return connection.open
    }
    if (value === 2) {
      return !connection.open
    }
    return true
  }

  const handleFilter = (search: string) => {
    let tmp: ConnectionDetailData[]
    if (search === '') {
      tmp = initConnections
    } else {
      tmp = initConnections.filter((connection: ConnectionDetailData) => {
        return serviceCode(connection)
          .toLowerCase()
          .includes(search.toLowerCase())
      })
    }
    setConnections(tmp)
  }

  return (
    <Dashboard title="Connection List">
      <StyledPaperRootInput>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value)
          }}
        />
      </StyledPaperRootInput>
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="gender"
          name="open"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value={1}
            control={<Radio color="primary" />}
            label="開通"
          />
          <FormControlLabel
            value={2}
            control={<Radio color="secondary" />}
            label="未開通"
          />
        </RadioGroup>
      </FormControl>
      {connections
        .filter((connection) => checkConnection(connection))
        .map((connection: ConnectionDetailData) => (
          <StyledCard key={connection.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {connection.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {serviceCode(connection)}
              </Typography>
              <br />
              {/*Group: {service.gr?.org}({service.group?.org_en})*/}
            </CardContent>
            <CardActions>
              <Stack direction="row" spacing={1}>
                {connection.service !== undefined && (
                  <ConnectionGetDialogs
                    key={'connection_get_dialog'}
                    connection={connection}
                    reload={setReload}
                    service={connection.service}
                  />
                )}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    navigate('/dashboard/group/' + connection.service?.group_id)
                  }
                >
                  Group
                </Button>
              </Stack>
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  )
}
