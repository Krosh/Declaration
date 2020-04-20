import { MultipleQuestion } from './types/declaration';
import ValuesKeeper from './values-keeper';
export declare class DeductionBuyProperty {
    private readonly question;
    private readonly valuesKeeper;
    private readonly date;
    private readonly value;
    private readonly percent;
    private readonly ids;
    private hidedFields;
    constructor(question: MultipleQuestion, valuesKeeper: ValuesKeeper);
    private getBlockingObject;
    init: () => Object;
    protected getDateCode: (id?: number | undefined) => string;
    /**
     * 1. Если дата приобретения (часть 1) по первому жилью ранее 2014 года
     * и внесены данные отличные от «0» по имуществу
     * и по процентам по ипотеке — кнопка не активна или ее вообще нет
     */
    protected checkDateActValuePercent: () => boolean;
    /**
     * 2. Если дата приобретения (часть 1) по первому жилью ранее 2014 года
     * и не вводились данные по кредиту — кнопка активна для ввода второго объекта,
     * но есть ограничение - дата приобретения жилья начиная с 01.01.2014 года,
     * и можно внести только данные по кредиту.
     * Далее кнопка добавления объекта больше не появляется или не активна.
     */
    protected checkDateActPercentWithLimit: () => boolean;
    /**
     * 3. Если дата приобретения  по первому и последующему жилью начиная с 01.01.2014 года.
     * Кнопка добавления нового объекта доступна до тех пор, пока общая стоимость жилья
     * (не достигнет 2 миллиона рублей и не будут внесены данные по кредиту).
     * ВАЖНО: нужно ограничение, что данные по кредиту можно внести только по одному жилью.
     * Как только они внесены у другого жилья эти данные внести нельзя.
     */
    protected checkValueLimitAndOneOfPercent: () => boolean;
    protected hideFieldsByCodesAfterFirst: (codes: string[]) => {
        id: number;
        codes: string[];
    }[];
    protected processHideFields: () => void;
    protected checkHomeGroup: () => boolean;
}
