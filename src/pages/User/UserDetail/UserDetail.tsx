import React, { useEffect, useState } from 'react'
import Dashboard from '../../../components/Dashboard/Dashboard'
import {
  Button,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Get } from '../../../api/User'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DefaultUserDetailData } from '../../../interface'
import { StyledCardRoot1, StyledDivRoot1 } from '../../../style'

export default function UserDetail() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(DefaultUserDetailData)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  let id: string | undefined
  ;({ id } = useParams())
  useEffect(() => {
    Get(id!).then((res) => {
      if (res.error === '') {
        setUser(res.data)
        setLoading(false)
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
  }, [])

  return (
    <Dashboard title="User Info">
      {loading ? (
        <StyledDivRoot1>
          <CircularProgress />
          <div>loading</div>
        </StyledDivRoot1>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <StyledCardRoot1>
              <CardContent>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 200 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Key</TableCell>
                        <TableCell align="right">Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key={'name'}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Name
                        </TableCell>
                        <TableCell align="right" scope="row">
                          {user.name}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key={'name_en'}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Name(English)
                        </TableCell>
                        <TableCell align="right" scope="row">
                          {user.name_en}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key={'email'}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          E-Mail
                        </TableCell>
                        <TableCell align="right" scope="row">
                          {user.email}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key={'group_id'}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          GroupID
                        </TableCell>
                        <TableCell align="right" scope="row">
                          {user.group_id}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        key={'level'}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Level
                        </TableCell>
                        <TableCell align="right" scope="row">
                          {user.level}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </StyledCardRoot1>
          </Grid>
          <Grid item xs={3}>
            <StyledCardRoot1>
              <CardContent>
                Operation
                <br/>
              </CardContent>
            </StyledCardRoot1>
          </Grid>
          <Grid item xs={3}>
            <StyledCardRoot1>
              <CardContent>
                Link
                <br/>
                {user.group_id != null && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/dashboard/group/${user.group_id}`)
                    }
                  >
                    Group
                  </Button>
                )}
              </CardContent>
            </StyledCardRoot1>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      )}
    </Dashboard>
  )
}
