import InvalidValueError from '~/libs/InvalidValueError'
import { isNotNullType, PropertyHolder } from '~/libs/typeHelpers'
import entityBase, { Entity, EntityBase } from '~/entity/EntityBase'
import * as objectEntity from '~/entity/ObjectEntity'

export type Content = EntityBase & {
  uid: string
  name: string
}

const entity: Entity<Content> = {
  fromObject(value) {
    const object: PropertyHolder<Content> = objectEntity.fromObject(value)
    const base = entityBase.fromObject(value)

    if (!isNotNullType(object.uid, 'string')) {
      throw new InvalidValueError('object.uid', object.uid)
    }
    if (!isNotNullType(object.name, 'string')) {
      throw new InvalidValueError('object.name', object.name)
    }
    return {
      ...base,
      uid: object.uid,
      name: object.name
    }
  },

  makeEntity(value = {}) {
    const input: Content = {
      ...entityBase.makeEntity(value),
      uid: value.uid || '',
      name: value.name || ''
    }
    return this.fromObject(input)
  },

  assignEntity(record, value) {
    const input: Partial<Content> = {
      ...entityBase.assignEntity(record, value),
      uid: value.uid,
      name: value.name
    }
    return this.fromObject(input)
  }
}

export default entity
