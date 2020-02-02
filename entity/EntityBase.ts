import { uniqueId } from 'lodash'
import InvalidValueError from '~/libs/InvalidValueError'
import {
  isNotNullType,
  isOptionalType,
  PropertyHolder,
  isUndefined
} from '~/libs/typeHelpers'
/**
 * JSONのデシリアライズ時のような型付けされていない Object から値を作成する。
 * また、 `'true'` のような文字列になっている真偽値を `true` に変換するなどもする。
 */
export type FromObject<T> = (value: Readonly<unknown>) => T
/**
 * 新しい値を作成する
 */
export type MakeEntity<T> = (value: Readonly<Partial<T>>) => T
/**
 * 対象のレコードに新しい値を代入する
 */
export type AssignEntity<T> = (
  record: Readonly<T>,
  value: Readonly<Partial<T>>
) => T

export interface Entity<Data> {
  fromObject: FromObject<Data>
  makeEntity: MakeEntity<Data>
  assignEntity: AssignEntity<Data>
}

export interface EntityBase {
  _instanceId: string
  createAt: Date
}

const entity: Entity<EntityBase> = {
  fromObject(value) {
    if (!isNotNullType(value, 'object')) {
      throw new InvalidValueError('object', value)
    }
    const object: PropertyHolder<EntityBase> = value
    const result: Partial<EntityBase> = {}

    // _instanceId
    if (!isOptionalType(object._instanceId, 'string')) {
      throw new InvalidValueError('object._instanceId', object._instanceId)
    }
    result._instanceId = object._instanceId || uniqueId()

    if (isUndefined(object.createAt)) {
      result.createAt = new Date()
    } else if (object.createAt instanceof Date) {
      result.createAt = object.createAt
    } else {
      // firebaseから取得した時のため
      result.createAt = (object.createAt as any).toDate()
    }

    return result as EntityBase
  },

  makeEntity(values = {}) {
    return this.fromObject(values)
  },

  assignEntity(record, _values) {
    return this.fromObject({
      _instanceId: record._instanceId,
      _createdAt: record.createAt
    })
  }
}

export default entity
