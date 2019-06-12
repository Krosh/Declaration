import { AddressQuestion } from './declaration'

export interface FiasElement {
  name: string
  code: string
  type: string
}
export interface Address {
  city: FiasElement
  street: FiasElement
  house: FiasElement
  housing: string
  flat: string
  ifnsfl: string
  ifnsflName: string
  okato: string
  oktmo: string
  postal: string
  userEdited: boolean
}

export type FiasElements = 'city' | 'street' | 'house'

const relatedFields: { [key in FiasElements]: FiasElements[] } = {
  city: ['street', 'house'],
  street: ['house'],
  house: [],
}

const defaultFiasElement: FiasElement = {
  name: '',
  code: '',
  type: '',
}
const defaultFields = {
  housing: '',
  flat: '',
  ifnsfl: '',
  ifnsflName: '',
  okato: '',
  oktmo: '',
  postal: '',
  userEdited: false,
}

export const AddressModel = {
  create: (jsonValue: string | null): Address => {
    const value = JSON.parse(jsonValue || '{}') as Partial<Address>

    return {
      ...defaultFields,
      ...value,
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

    const newAddress = { ...oldValue, [field]: newFiasElementValue }
    const relations = relatedFields[field]
    relations.forEach(item => (newAddress[item] = { ...defaultFiasElement }))
    newAddress.ifnsfl = isUserEdited ? '' : changeValue.ifnsfl
    newAddress.ifnsflName = isUserEdited ? '' : changeValue.ifnsfl_name
    newAddress.okato = isUserEdited ? '' : changeValue.okato
    newAddress.oktmo = isUserEdited ? '' : changeValue.oktmo
    newAddress.postal = isUserEdited ? '' : changeValue.postal

    newAddress.userEdited = isUserEdited
    return newAddress
  },

  getFullCodeName: (question: AddressQuestion, name: string) =>
    question.code + name,

  validate: (value: string, isTouched: (name: string) => boolean) => {
    const address = AddressModel.create(value)
    const result: { [key: string]: string[] } = {}
    for (let key in address) {
      if (!isTouched(key)) {
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
