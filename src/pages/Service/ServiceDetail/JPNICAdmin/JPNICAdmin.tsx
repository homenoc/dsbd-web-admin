import { JPNICData } from '../../../../interface'
import React, { Dispatch, SetStateAction } from 'react'
import { Card, CardContent } from '@mui/material'
import cssModule from '../../../Connection/ConnectionDetail/ConnectionDialog.module.scss'
import { JPNICDetail } from '../../../../components/Dashboard/JPNIC/JPNIC'

export function ServiceJPNICAdminBase(props: {
  serviceID: number
  jpnic: JPNICData | undefined
  reload: Dispatch<SetStateAction<boolean>>
}) {
  const { jpnic, serviceID, reload } = props

  if (jpnic === undefined) {
    return (
      <Card>
        <CardContent>
          <h3>JPNIC管理者連絡窓口</h3>
          <p>
            <b>情報なし</b>
          </p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className={cssModule.contract}>
      <CardContent>
        <h3>JPNIC管理者連絡窓口</h3>
        <JPNICDetail
          key={serviceID}
          jpnicAdmin={true}
          serviceID={serviceID}
          jpnic={jpnic}
          reload={reload}
        />
      </CardContent>
    </Card>
  )
}
