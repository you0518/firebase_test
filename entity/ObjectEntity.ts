import InvalidValueError from '~/libs/InvalidValueError'
import { isNotNullType } from '~/libs/typeHelpers'
import { FromObject } from '@/entity/EntityBase'

export const fromObject: FromObject<object> = (value) => {
  if (!isNotNullType(value, 'object')) {
    throw new InvalidValueError('object', value)
  }
  return value
}
