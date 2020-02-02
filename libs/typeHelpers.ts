import InvalidValueError from '~/libs/InvalidValueError'

// 型Tと同一のプロパティを持つが、プロパティの型が全部 unknown となる型の作成
export type PropertyHolder<T> = {
  readonly [P in keyof T]?: unknown
}

// `'string' => string` といった型を表す文字列から型へのマッピング
// @see [Generic type guard in Typescript - DEV Community 👩‍💻👨‍💻](https://dev.to/krumpet/generic-type-guard-in-typescript-258l)
// @see [typeof - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof#Description)
interface TypeMap {
  string: string
  number: number
  boolean: boolean
  object: object
  symbol: symbol
  function: (...args: any[]) => any
}

// コンストラクタか型を表す文字列
// constructor | 'string' | 'number' | 'boolean' | 'object' | 'symbol' | 'undefined' | 'function'
type ConstructorOrTypename = (new (...args: any[]) => any) | keyof TypeMap

// コンストラクタを持つものならその型を、そうでないなら型を表す文字列に該当する型を返す
type GuardedType<T extends ConstructorOrTypename> = T extends new (
  ...args: any[]
) => infer U
  ? U
  : T extends keyof TypeMap
  ? TypeMap[T]
  : never

function isType(value: unknown, type: any): boolean {
  if (typeof type === 'string') {
    return typeof value === type
  } else if (typeof type.fromObject === 'function') {
    try {
      type.fromObject(value)
      return true
    } catch (e) {
      if (e instanceof InvalidValueError) {
        return false
      }
      throw e
    }
  } else {
    return value instanceof type
  }
}

export function isNotNullType<T extends ConstructorOrTypename>(
  value: unknown,
  type: T
): value is GuardedType<T> {
  if (isUndefined(value)) {
    return false
  }
  if (isNull(value)) {
    return false
  }
  return isType(value, type)
}

export function isNullableType<T extends ConstructorOrTypename>(
  value: unknown,
  type: T
): value is GuardedType<T> | null {
  if (isUndefined(value)) {
    return false
  }
  if (isNull(value)) {
    return true
  }
  return isType(value, type)
}

export function isOptionalType<T extends ConstructorOrTypename>(
  value: unknown,
  type: T
): value is GuardedType<T> | undefined {
  if (isUndefined(value)) {
    return true
  }
  if (isNull(value)) {
    return false
  }
  return isType(value, type)
}

export function isOptionalNullableType<T extends ConstructorOrTypename>(
  value: unknown,
  type: T
): value is GuardedType<T> | undefined | null {
  if (isUndefined(value)) {
    return true
  }
  if (isNull(value)) {
    return true
  }
  return isType(value, type)
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined'
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function booleanFromObject(value: unknown) {
  switch (value) {
    case true:
    case 'true':
      return true
    case false:
    case 'false':
      return false
    default:
      throw new InvalidValueError('value', value)
  }
}

export function integerFromObject(value: unknown) {
  if (!isNotNullType(value, 'string') && !isNotNullType(value, 'number')) {
    throw new InvalidValueError('value', value)
  }
  const integer = parseInt(value.toString(), 10)
  if (isNaN(integer)) {
    throw new InvalidValueError('value', value)
  }
  return integer
}

export function floatFromObject(value: unknown) {
  if (!isNotNullType(value, 'string') && !isNotNullType(value, 'number')) {
    throw new InvalidValueError('value', value)
  }
  const integer = parseFloat(value.toString())
  if (isNaN(integer)) {
    throw new InvalidValueError('value', value)
  }
  return integer
}

export function dateFromObject(value: unknown) {
  if (!isNotNullType(value, 'string') && !(value instanceof Date)) {
    throw new InvalidValueError('value', value)
  }
  const date = new Date(value)
  if (date.toString() === 'Invalid Date') {
    throw new InvalidValueError('value', value)
  }
  return date
}
