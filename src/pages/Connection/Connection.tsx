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
import { GetAll } from '../../api/Connection'
import { useSnackbar } from 'notistack'
import {
  ConnectionDetailData,
  DefaultConnectionDetailDataArray,
} from '../../interface'
import { GetTemplate } from '../../api/Group'
import { useRecoilState } from 'recoil'
import { TemplateState } from '../../api/Recoil'
import { useNavigate } from 'react-router-dom'
import { GenServiceCode } from '../../components/Tool'

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
        return GenServiceCode(connection)
          .toLowerCase()
          .includes(search.toLowerCase())
      })
    }
    setConnections(tmp)
  }
  const clickGroupPage = (id: number) => navigate('/dashboard/group/' + id)
  const clickServicePage = (id: number) => navigate('/dashboard/service/' + id)
  const clickConnectionPage = (id: number) =>
    navigate('/dashboard/connection/' + id)

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
                {GenServiceCode(connection)}
              </Typography>
              <br />
              {/*Group: {service.gr?.org}({service.group?.org_en})*/}
            </CardContent>
            <CardActions>
              <Stack direction="row" spacing={1}>
                {connection.service !== undefined && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => clickConnectionPage(connection.ID)}
                  >
                    Detail
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  disabled={connection.service?.group_id === undefined}
                  onClick={() => clickServicePage(connection.service?.ID ?? 0)}
                >
                  Service
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={connection.service?.group_id === undefined}
                  onClick={() =>
                    clickGroupPage(connection.service?.group_id ?? 0)
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
