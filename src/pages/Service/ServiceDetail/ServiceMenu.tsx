import React, { Dispatch, SetStateAction } from 'react'
import { useSnackbar } from 'notistack'
import { ServiceDetailData } from '../../../interface'
import { Put } from '../../../api/Service'
import { StyledButton1 } from '../../../style'

export function ServiceAddAllowButton(props: {
  service: ServiceDetailData
  setReload: Dispatch<SetStateAction<boolean>>
}) {
  const { service, setReload } = props
  const { enqueueSnackbar } = useSnackbar()

  const changeLock = (add_allow: boolean) => {
    service.add_allow = add_allow

    Put(service.ID, service).then((res) => {
      if (res.error === '') {
        enqueueSnackbar('Request Success', { variant: 'success' })
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }

      setReload(true)
    })
  }

  if (service.add_allow) {
    return (
      <StyledButton1
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={() => changeLock(false)}
        color={'secondary'}
        variant="outlined"
      >
        追加を禁止
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
      接続追加を許可
    </StyledButton1>
  )
}
