import { Menu, MenuItem } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { GroupDetailData } from '../../../interface'
import { Put } from '../../../api/Group'
import { useSnackbar } from 'notistack'
import { StyledButton1 } from '../../../style'

export function GroupStatusButton(props: {
  data: GroupDetailData
  autoMail: Dispatch<SetStateAction<string>>
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { data, autoMail, setReload } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changePassStatus = (pass: boolean) => {
    data.pass = pass
    Put(data.ID, data).then((res) => {
      if (res.error === '') {
        // console.log(res.error);
      }

      if (pass) {
        autoMail('pass_the_examination')
      }

      handleClose()
      setReload(true)
    })
  }

  const changeAddAllowStatus = (add_allow: boolean) => {
    data.add_allow = add_allow
    Put(data.ID, data).then((res) => {
      if (res.error === '') {
        // console.log(res.error);
      }

      handleClose()
      setReload(true)
    })
  }

  return (
    <div>
      {!data.pass && (
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => changePassStatus(true)}
          color={'primary'}
          variant="contained"
        >
          審査OK
        </StyledButton1>
      )}
      {!data.add_allow && (
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => changeAddAllowStatus(true)}
          color={'primary'}
          variant="contained"
        >
          サービス申請許可
        </StyledButton1>
      )}
      {data.add_allow && (
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => changeAddAllowStatus(false)}
          color={'secondary'}
          variant="outlined"
        >
          サービス新規申請を禁止
        </StyledButton1>
      )}
    </div>
  )
}

export function GroupLockButton(props: {
  data: GroupDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { data, setReload } = props
  const { enqueueSnackbar } = useSnackbar()

  const changeLock = (pass: boolean) => {
    data.pass = pass

    Put(data.ID, data).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  if (data.pass) {
    return (
      <StyledButton1
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={() => changeLock(false)}
        color={'secondary'}
        variant="outlined"
      >
        変更を禁止
      </StyledButton1>
    )
  }
  return (
    <StyledButton1
      aria-controls="simple-menu"
      aria-haspopup="true"
      onClick={() => changeLock(true)}
      color={'primary'}
      variant="outlined"
    >
      変更を許可
    </StyledButton1>
  )
}

export function GroupAbolition(props: {
  data: GroupDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}): any {
  const { data, setReload } = props
  const { enqueueSnackbar } = useSnackbar()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  const handleClickExpire = (expired_status: number) => {
    data.expired_status = expired_status

    Put(data.ID, data).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
    handleClose()
  }

  const clickActive = () => {
    data.expired_status = 0

    Put(data.ID, data).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  if (data.expired_status !== 0) {
    return (
      <div>
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={clickActive}
          color={'primary'}
          variant="outlined"
        >
          Active処理
        </StyledButton1>
      </div>
    )
  }
  return (
    <div>
      <StyledButton1
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color={'secondary'}
        variant="outlined"
      >
        廃止処理
      </StyledButton1>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClickExpire(1)}>審査落ち</MenuItem>
        <MenuItem onClick={() => handleClickExpire(2)}>ユーザより廃止</MenuItem>
        <MenuItem onClick={() => handleClickExpire(3)}>
          運営委員より廃止
        </MenuItem>
      </Menu>
    </div>
  )
}
