import { Values } from '../types/declaration'

export default class ValuesKeeper {
  values: Values

  constructor(initialValues: Values) {
    this.values = initialValues
  }

  setValue = (code: string, id: number, newValue: string) => {
    this.values[code] = this.values[code] || {}
    this.values[code][id] = newValue
  }

  getValue = (code: string, id?: number) => {
    if (!id) {
      id = 0
    }
    if (!this.values[code] || !this.values[code][id]) {
      return ''
    }
    return this.values[code][id]
  }
}
