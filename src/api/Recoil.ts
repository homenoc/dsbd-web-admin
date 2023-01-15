import { atom } from 'recoil'
import { DefaultTemplateData } from '../interface'

export const TemplateState = atom({
  key: 'templateState',
  default: DefaultTemplateData,
})
