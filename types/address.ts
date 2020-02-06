import { AddressQuestion } from './declaration'

export interface FiasElement {
  id: string
  name: string
  type: string
  description: string
}

export interface FiasFullAddress {
  region: FiasElement
  area: FiasElement
  city: FiasElement
  street: FiasElement
  house: FiasElement
  housing: FiasElement
  flat: FiasElement
}

export interface Address {
  fullAddressString: string
  region: FiasElement
  area: FiasElement
  city: FiasElement
  street: FiasElement
  house: FiasElement
  housing: FiasElement
  flat: FiasElement
  ifnsfl: string
  ifnsflName: string
  oktmo: string
  postal: string
  description: string
  userEdited: boolean
}

export type FiasElements = 'region' | 'area' | 'city' | 'street' | 'house'  | 'housing' | 'flat'

export type ClearableElements = FiasElements

// const relatedFields: { [key in FiasElements]: ClearableElements[] } = {
//   region: ['area'],
//   area: ['city'],
//   city: ['street', 'house', 'flat'],
//   street: ['house', 'flat'],
//   house: ['flat'],
// }

const relatedFields: { [key in FiasElements]: ClearableElements[] } = {
  region: [],
  area: [],
  city: [],
  street: [],
  house: [],
  housing: [],
  flat: [],
}

// const checkParentFields: { [key in FiasElements]: FiasElements[] } = {
//   region: [],
//   area: ['region'],
//   city: ['area'],
//   street: ['city'],
//   house: ['street', 'city'],
// }

const checkParentFields: { [key in FiasElements]: FiasElements[] } = {
  region: [],
  area: [],
  city: [],
  street: [],
  house: [],
  housing: [],
  flat: [],
}

const defaultFiasElement: FiasElement = {
  id: '',
  name: '',
  type: '',
  description: '',
}
const defaultFields = {
  fullAddressString: '',
  ifnsfl: '',
  ifnsflName: '',
  oktmo: '',
  postal: '',
  description: '',
  userEdited: false,
}

const getAdditionalFields = (address: Address & { ifnsfl_name: string }) => {
  return {
    ifnsfl: address.ifnsfl ? address.ifnsfl : '',
    ifnsflName: address.ifnsflName
      ? address.ifnsflName
      : address.ifnsfl_name
      ? address.ifnsfl_name
      : '',
    oktmo: address.oktmo ? address.oktmo : '',
    postal: address.postal ? address.postal : '',
  }
}

export const AddressModel = {
  create: (jsonValue: string | null): Address => {
    const value = JSON.parse(jsonValue || '{}') as Omit<Partial<Address>, 'flat' | 'housing'>
      & Partial<{flat: FiasElement | string, housing: FiasElement | string}>
    return {
      ...defaultFields,
      ...value,
      region: {
        ...defaultFiasElement,
        ...(value.region ? value.region : {}),
      },
      area: {
        ...defaultFiasElement,
        ...(value.area ? value.area : {}),
      },
      city: {
        ...defaultFiasElement,
        ...(value.city ? value.city : {}),
      },
      street: {
        ...defaultFiasElement,
        ...(value.street ? value.street : {}),
      },
      house: {
        ...defaultFiasElement,
        ...(value.house ? value.house : {}),
      },
      housing: typeof value.housing === 'string' ?
        {
          name: value.housing
        } : value.housing,
      flat: typeof value.flat === 'string' ?
        {
          name: value.flat
        } : value.flat,
      ...getAdditionalFields({
        ...value,
        ...(value.house ? value.house : {}),
      } as Address & { ifnsfl_name: string }),
    } as Address
  },
  serialize: (value: Address) => JSON.stringify(value),
  changeFiasElement: (
    oldValue: Address,
    field: FiasElements,
    label: string,
    changeValue: any,
    isUserEdited: boolean
  ) => {
    const newFiasElementValue = {
      ...oldValue[field],
    }
    newFiasElementValue.name = label
    newFiasElementValue.id = isUserEdited ? '' : changeValue.id
    newFiasElementValue.type = isUserEdited ? '' : changeValue.type
    newFiasElementValue.description = isUserEdited
      ? ''
      : changeValue.description

    const newAddress = { ...oldValue, [field]: newFiasElementValue }
    const relations = relatedFields[field]
    relations.forEach(item => {
      newAddress[item] = { ...defaultFiasElement }
    })

    let isParent = true
    if (isUserEdited) {
      const check = checkParentFields[field]
      const parent = check.map(item => {
        return oldValue[field].id === oldValue[item].id
      })
      if (parent.length) {
        isParent = parent.reduce(item => item)
      }
    }

    if (changeValue.ifnsfl) {
      newAddress.ifnsfl = changeValue.ifnsfl
    } else if (oldValue.ifnsfl) {
      newAddress.ifnsfl = !isParent ? '' : oldValue.ifnsfl
    }
    if (changeValue.ifnsfl_name) {
      newAddress.ifnsflName = changeValue.ifnsfl_name
    } else if (oldValue.ifnsflName) {
      newAddress.ifnsflName = !isParent ? '' : oldValue.ifnsflName
    }
    if (changeValue.oktmo) {
      newAddress.oktmo = changeValue.oktmo
    } else if (oldValue.oktmo) {
      newAddress.oktmo = !isParent ? '' : oldValue.oktmo
    }
    if (changeValue.postal) {
      newAddress.postal = changeValue.postal
    } else if (oldValue.postal) {
      newAddress.postal = !isParent ? '' : oldValue.postal
    }

    newAddress.userEdited = isUserEdited
    return newAddress
  },

  getFullCodeName: (question: AddressQuestion, name: string) =>
    question.code + name,

  skipDefault: ['fullAddressString', 'street', 'housing', 'flat', 'area', 'description'],
  skipOnShort: ['oktmo', 'ifnsfl', 'ifnsflName'],
  skipRegion: ['region'],

  validate: (
    value: string,
    isTouched: (name: string) => boolean,
    short: boolean,
    skipRegion: boolean
  ) => {
    const address = AddressModel.create(value)
    const result: { [key: string]: string[] } = {}
    const skip = AddressModel.skipDefault
    if (short) {
      skip.push(...AddressModel.skipOnShort)
    }
    if (skipRegion) {
      skip.push(...AddressModel.skipRegion)
    }

    for (let key in address) {
      if (!isTouched(key)) {
        result[key] = []
        continue
      }
      if (skip.includes(key)) {
        result[key] = []
        continue
      }
      if (
        address[key as keyof Address] === '' ||
        (address[key as FiasElements] &&
          address[key as FiasElements].name === '')
      ) {
        result[key] = ['Не заполнено поле']
        continue
      }
      result[key] = []
    }
    return result as { [key in keyof Address]: string[] }
  },
}
