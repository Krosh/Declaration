import { AddressQuestion } from './declaration'

export interface FiasElement {
  name: string
  code: string
  type: string
  description: string
}

export interface FiasFullAddress {
  region: FiasElement
  area: FiasElement
  city: FiasElement
  street: FiasElement
  house: FiasElement
}

export interface Address {
  fullAddress: FiasFullAddress
  region: FiasElement
  area: FiasElement
  city: FiasElement
  street: FiasElement
  house: FiasElement
  housing: string
  flat: string
  ifnsfl: string
  ifnsflName: string
  oktmo: string
  postal: string
  description: string,
  userEdited: boolean
}

export type FiasElements = 'region' | 'area' | 'city' | 'street' | 'house'

const relatedFields: { [key in FiasElements]: FiasElements[] } = {
  region: ['area'],
  area: ['city'],
  city: ['street', 'house'],
  street: ['house'],
  house: [],
}

const checkParentFields: { [key in FiasElements]: FiasElements[] } = {
  region: [],
  area: ['region'],
  city: ['area'],
  street: ['city'],
  house: ['street', 'city'],
}

const defaultFiasElement: FiasElement = {
  name: '',
  code: '',
  type: '',
  description: ''
}
const defaultFields = {
  housing: '',
  flat: '',
  ifnsfl: '',
  ifnsflName: '',
  oktmo: '',
  postal: '',
  description: '',
  userEdited: false,
}

export const AddressModel = {
  create: (jsonValue: string | null): Address => {
    const value = JSON.parse(jsonValue || '{}') as Partial<Address>

    return {
      ...defaultFields,
      ...value,
      fullAddress: {
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
        }
      },
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
    }
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
    newFiasElementValue.code = isUserEdited ? '' : changeValue.id
    newFiasElementValue.type = isUserEdited ? '' : changeValue.type
    newFiasElementValue.description = isUserEdited ? '' : changeValue.description

    const newAddress = { ...oldValue, [field]: newFiasElementValue }
    const relations = relatedFields[field]
    relations.forEach(item => (newAddress[item] = { ...defaultFiasElement }))

    let isParent = true
    if (isUserEdited) {
      const check = checkParentFields[field]
      const parent = check.map(item => {
        return oldValue[field].code === oldValue[item].code
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

  skipDefault: ['street', 'housing', 'flat'],
  skipOnShort: ['oktmo', 'ifnsfl', 'ifnsflName'],

  validate: (
    value: string,
    isTouched: (name: string) => boolean,
    short: boolean,
  ) => {
    const address = AddressModel.create(value)
    const result: { [key: string]: string[] } = {}
    for (let key in address) {
      if (!isTouched(key)) {
        result[key] = []
        continue
      }
      const skip = short
        ? AddressModel.skipOnShort.concat(AddressModel.skipDefault)
        : AddressModel.skipDefault
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
