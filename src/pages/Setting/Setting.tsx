import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import Dashboard from '../../components/Dashboard/Dashboard'
import NocSetting from './NocSetting'
import RouterSetting from './RouterSetting'
import GatewaySetting from './GatewaySetting'

function TabPanel(props: {
  children?: React.ReactNode
  index: number
  value: number
}) {
  const { children, value, index } = props
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Setting() {
  const [tab, setTab] = useState(0)

  return (
    <Dashboard title="Setting">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="NOC" />
          <Tab label="BGP Router" />
          <Tab label="Gateway" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <NocSetting />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <RouterSetting />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <GatewaySetting />
      </TabPanel>
    </Dashboard>
  )
}
