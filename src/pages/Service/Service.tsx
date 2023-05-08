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
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { GetAll } from '../../api/Service'
import {
  DefaultServiceDetailDataArray,
  DefaultTemplateData,
  ServiceDetailData,
} from '../../interface'
import { useSnackbar } from 'notistack'
import { GetTemplate } from '../../api/Group'
import { useNavigate } from 'react-router-dom'
import {
  GenServiceCode,
  GenServiceCodeOnlyService,
} from '../../components/Tool'

export default function Service() {
  const navigate = useNavigate()
  const [services, setServices] = useState(DefaultServiceDetailDataArray)
  const [initServices, setInitServices] = useState(
    DefaultServiceDetailDataArray
  )
  const [template, setTemplate] = useState(DefaultTemplateData)
  const [reload, setReload] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  // 1:開通 2:未開通
  const [value, setValue] = React.useState(1)

  useEffect(() => {
    if (reload) {
      GetAll().then((res) => {
        if (res.error === '') {
          setServices(res.data)
          setInitServices(res.data)
          setReload(false)
        } else {
          enqueueSnackbar('' + res.error, { variant: 'error' })
        }
      })
    }
  }, [reload, template])

  useEffect(() => {
    GetTemplate().then((res) => {
      if (res.error === '') {
        setTemplate(res.data)
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
  }, [])

  const checkConnection = (service: ServiceDetailData) => {
    if (value === 1) {
      return service.pass
    }
    if (value === 2) {
      return !service.pass
    }
    return true
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value))
  }

  const handleFilter = (search: string) => {
    let tmp: ServiceDetailData[]
    if (search === '') {
      tmp = initServices
    } else {
      tmp = initServices.filter((service: ServiceDetailData) => {
        const code = GenServiceCodeOnlyService(service)
        return code.toLowerCase().includes(search.toLowerCase())
      })
    }
    setServices(tmp)
  }

  const clickGroupPage = (id: number) => navigate('/dashboard/group/' + id)
  const clickServicePage = (id: number) => navigate('/dashboard/service/' + id)

  return (
    <Dashboard title="Service List">
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
      {services
        .filter((service) => checkConnection(service))
        .map((service: ServiceDetailData) => (
          <StyledCard key={service.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {service.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {GenServiceCodeOnlyService(service)}
              </Typography>
            </CardContent>
            <CardActions>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => clickServicePage(service.ID)}
                >
                  Detail
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={service.group_id === undefined}
                  onClick={() => clickGroupPage(service.group_id)}
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
