import { HidedFields, MultipleQuestion } from './types/declaration'
import ValuesKeeper from './values-keeper'

const deductionHomeGroup: string = 'deduction_home_group'

const codeBuyType: string = 'home_buy_type'

const codeBuyTypeInvestment: string = 'home_buy_type_investment'
const codeBuyTypeAnother: string = 'home_buy_type_another'

const codeDateAct: string = 'home_date_act'
const codeDateRegister: string = 'home_date_register'

const codeValue: string = 'home_value'
const codePercent: string = 'home_percents_before'

const limitByValue: number = 2000000
const yearLimit: number = 2014

export class DeductionBuyProperty {
  private readonly question: MultipleQuestion
  private readonly valuesKeeper: ValuesKeeper
  private readonly date: string
  private readonly value: string | number
  private readonly percent: string | number
  private readonly ids: number[]
  private hidedFields: HidedFields

  constructor(question: MultipleQuestion, valuesKeeper: ValuesKeeper) {
    this.question = question
    this.valuesKeeper = valuesKeeper

    this.ids = this.valuesKeeper.getMultipleIds(this.question.code)
    const firstId = Object.values(this.ids).shift()
    this.date = this.valuesKeeper.getValue(this.getDateCode(firstId), firstId)
    this.value = this.valuesKeeper.getValue(codeValue, firstId)
    this.percent = this.valuesKeeper.getValue(codePercent, firstId)
    this.hidedFields = []
  }

  private getBlockingObject = (): Object => {
    return {
      addMultiple: () => false,
      copyMultiple: () => false,
      isShowAddMultiple: () => false,
      isShowCopyMultiple: () => false,
      getHidedChildrenQuestions: () => this.hidedFields,
    }
  }

  public init = (): Object => {
    if (!this.checkHomeGroup()) {
      return {}
    }

    if (this.checkDateActValuePercent()) {
      return this.getBlockingObject()
    } else if (this.checkDateActPercentWithLimit()) {
      return this.getBlockingObject()
    } else if (this.checkValueLimitAndOneOfPercent()) {
      return this.getBlockingObject()
    }

    return {
      getHidedChildrenQuestions: () => this.hidedFields,
    }
  }

  protected getDateCode = (id?: number): string => {
    const type = this.valuesKeeper.getValue(codeBuyType, id)
    switch (type) {
      case codeBuyTypeInvestment:
        return codeDateAct
      case codeBuyTypeAnother:
        return codeDateRegister
      default:
        return ''
    }
  }

  /**
   * 1. Если дата приобретения (часть 1) по первому жилью ранее 2014 года
   * и внесены данные отличные от «0» по имуществу
   * и по процентам по ипотеке — кнопка не активна или ее вообще нет
   */
  protected checkDateActValuePercent = (): boolean => {
    return (
      new Date(this.date).getFullYear() < yearLimit &&
      +this.value > 0 &&
      +this.percent > 0 &&
      this.ids.length === 1
    )
  }

  /**
   * 2. Если дата приобретения (часть 1) по первому жилью ранее 2014 года
   * и не вводились данные по кредиту — кнопка активна для ввода второго объекта,
   * но есть ограничение - дата приобретения жилья начиная с 01.01.2014 года,
   * и можно внести только данные по кредиту.
   * Далее кнопка добавления объекта больше не появляется или не активна.
   */
  protected checkDateActPercentWithLimit = (): boolean => {
    const isFirst =
      new Date(this.date).getFullYear() < yearLimit && +this.percent == 0
    let isSecond = false
    let isDate = false
    let i = 0
    for (let id of this.ids) {
      if (i === 1) {
        const date = this.valuesKeeper.getValue(this.getDateCode(id), id)
        const value = this.valuesKeeper.getValue(codeValue, id)
        const percent = this.valuesKeeper.getValue(codePercent, id)

        isDate = new Date(date).getFullYear() >= yearLimit
        isSecond = isDate || (!value.length && !percent.length)
      }
      i++
    }

    const arrCodesForHide =
      isFirst && isSecond && isDate
        ? [codeValue]
        : isFirst && !isSecond && !isDate
        ? [codeValue, codePercent]
        : []
    this.hidedFields = arrCodesForHide.length
      ? this.hideFieldsByCodesAfterFirst(arrCodesForHide)
      : []

    return isFirst && isSecond
  }

  /**
   * 3. Если дата приобретения  по первому и последующему жилью начиная с 01.01.2014 года.
   * Кнопка добавления нового объекта доступна до тех пор, пока общая стоимость жилья
   * (не достигнет 2 миллиона рублей и не будут внесены данные по кредиту).
   * ВАЖНО: нужно ограничение, что данные по кредиту можно внести только по одному жилью.
   * Как только они внесены у другого жилья эти данные внести нельзя.
   */
  protected checkValueLimitAndOneOfPercent = (): boolean => {
    let arDate: boolean[] = []
    let arValueForHide: number[] = []
    let totalValue: number = 0
    let totalLimit: number = limitByValue
    let hasOneEmpty: boolean[] = []
    for (let id of this.ids) {
      const date = this.valuesKeeper.getValue(this.getDateCode(id), id)
      arDate.push(new Date(date).getFullYear() >= yearLimit)
      const value = this.valuesKeeper.getValue(codeValue, id)
      const percent = this.valuesKeeper.getValue(codePercent, id)
      hasOneEmpty.push(!value.length && !percent.length)

      if (totalLimit >= +value && totalLimit !== 0) {
        totalLimit -= +value
      } else {
        arValueForHide.push(id)
      }
      totalValue += +value
    }

    const isDate = !!arDate.filter(item => !item).length
    const isHasEmpty = !!hasOneEmpty.filter(item => item).length
    const isValue = totalValue >= limitByValue

    if (isValue) {
      this.processHideFieldsByValue(arValueForHide)
    }

    if (!isDate) {
      this.processHideFieldsByPercent()
    }

    return (isDate || isValue || isHasEmpty) && this.ids.length !== 1
  }

  protected hideFieldsByCodesAfterFirst = (codes: string[]): HidedFields => {
    return this.ids.slice(1).map((id: number) => ({
      id,
      codes,
    }))
  }

  protected processHideFieldsByPercent = () => {
    let hasPercent: number[] = []
    for (let id of this.ids) {
      const percent = this.valuesKeeper.getValue(codePercent, id)
      if (+percent > 0) {
        hasPercent.push(+id)
      }
    }

    if (!!hasPercent.length) {
      const hidedFields: HidedFields = this.ids
        .filter((item: number) => item !== hasPercent[0])
        .map((item: number) => ({ id: item, codes: [codePercent] }))

      this.hidedFields = [...this.hidedFields, ...hidedFields] as HidedFields
    }
  }

  protected processHideFieldsByValue = (arValueForHide: number[]) => {
    if (!!arValueForHide.length) {
      const hidedFields: HidedFields = arValueForHide.map((id: number) => ({
        id,
        codes: [codeValue],
      }))

      this.hidedFields = [...this.hidedFields, ...hidedFields] as HidedFields
    }
  }

  protected checkHomeGroup = (): boolean => {
    return this.question.code === deductionHomeGroup
  }
}
