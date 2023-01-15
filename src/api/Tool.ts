import { ConnectionTemplateData, ServiceTemplateData } from '../interface'
import { useRecoilValue } from 'recoil'
import { TemplateState } from './Recoil'

export function GetServiceWithTemplate(
  serviceType: string
): ServiceTemplateData | undefined {
  const template = useRecoilValue(TemplateState)

  const serviceTemplate = template.services?.find(
    (item) => item.type === serviceType
  )
  if (serviceTemplate == null) {
    return undefined
  }

  return serviceTemplate
}

export function GetConnectionWithTemplate(
  connectionType: string
): ConnectionTemplateData | undefined {
  const template = useRecoilValue(TemplateState)

  const connectionTemplate = template.connections?.find(
    (item) => item.type === connectionType
  )
  if (connectionTemplate == null) {
    return undefined
  }

  return connectionTemplate
}
