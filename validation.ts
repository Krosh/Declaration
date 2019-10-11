import { Validation } from './types/declaration'

const initialValidation: Validation = {
  canBeSkipped: false,
}

const validate = (
  questionCode: string,
  qValidation: Validation | undefined,
  getValue: (questionCode: string) => string,
  requiredFromAction: boolean
) => {
  const value = getValue(questionCode)
  const validation: Validation = { ...initialValidation, ...qValidation }

  if (value === '' && (validation.canBeSkipped || !requiredFromAction)) {
    return []
  }

  if (
    value === '' &&
    validation.oneOf &&
    validation.oneOf.some(item => getValue(item) !== '')
  ) {
    return []
  }

  if (value === '') {
    if (validation.oneOf) {
      return ['Пожалуйста, заполните хотя бы одно из этих полей']
    }
    return ['Не должен быть пустым']
  }

  if (validation.type) {
    if (validation.type === 'phone') {
      return validatePhone(value)
    }
    if (validation.type === 'okved') {
      return validateOkved(value)
    }
    if (validation.type === 'year') {
      const result = validateYear(value)
      if (!!result.length) {
        return result
      }
    }
    if (validation.type === 'inn') {
      const result = validateInn(value)
      if (!!result.length) {
        return result
      }
    }

    if (validation.type === 'kpp') {
      const result = validateKpp(value)
      if (!!result.length) {
        return result
      }
    }

    if (validation.type === 'bik') {
      const result = validateBik(value)
      if (!!result.length) {
        return result
      }
    }

    if (validation.type === 'correspondent_account') {
      const result = validateKs(value, getValue(validation.bikName!))
      if (!!result.length) {
        return result
      }
    }

    if (validation.type === 'client_account') {
      const result = validateRs(value, getValue(validation.bikName!))
      if (!!result.length) {
        return result
      }
    }
  }

  return []
}

export function validatePhone(value: string) {
  if (value.replace(/\D/g, () => '').length !== 11) {
    return ['Введен некорректный телефон']
  }
  return []
}

export function validateOkved(value: string) {
  if (!value.match(/\d\d\.\d\d\.\d\d/)) {
    return ['Некорректный код ОКВЭД']
  }
  return []
}

export function validateYear(value: string) {
  if (parseInt(value) < 1950 || parseInt(value) > 2050) {
    return ['Указан некорректный год']
  }
  return []
}

export function validateBik(bik: string | number) {
  if (typeof bik === 'number') {
    bik = bik.toString()
  } else if (typeof bik !== 'string') {
    bik = ''
  }
  if (!bik.length) {
    return ['БИК пуст']
  } else if (/[^0-9]/.test(bik)) {
    return ['БИК может состоять только из цифр']
  } else if (bik.length !== 9) {
    return ['БИК может состоять только из 9 цифр']
  } else {
    return []
  }
}

export function validateInn(inn: string | number) {
  var result = false
  if (typeof inn === 'number') {
    inn = inn.toString()
  } else if (typeof inn !== 'string') {
    inn = ''
  }
  if (!inn.length) {
    return ['ИНН пуст']
  } else if (/[^0-9]/.test(inn)) {
    return ['ИНН может состоять только из цифр']
  } else if ([10, 12].indexOf(inn.length) === -1) {
    return ['ИНН может состоять только из 10 или 12 цифр']
  } else {
    const checkDigit = (inn: any, coefficients: any) => {
      var n = 0
      for (var i in coefficients) {
        n += coefficients[i] * inn[i]
      }
      return parseInt(((n % 11) % 10) as any)
    }
    switch (inn.length) {
      case 10:
        var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8])
        if (n10 === parseInt(inn[9])) {
          result = true
        }
        break
      case 12:
        var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8])
        var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8])
        if (n11 === parseInt(inn[10]) && n12 === parseInt(inn[11])) {
          result = true
        }
        break
    }
    if (!result) {
      return ['Неправильное контрольное число']
    }
  }
  return []
}

export function validateKpp(kpp: string | number) {
  var result = false
  if (typeof kpp === 'number') {
    kpp = kpp.toString()
  } else if (typeof kpp !== 'string') {
    kpp = ''
  }
  if (!kpp.length) {
    return ['КПП пуст']
  } else if (kpp.length !== 9) {
    return [
      'КПП может состоять только из 9 знаков (цифр или заглавных букв латинского алфавита от A до Z)',
    ]
  } else if (!/^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/.test(kpp)) {
    return ['Неправильный формат КПП']
  }
  return []
}

export function validateKs(ks: string | number, bik: string | number) {
  const bikErrors = validateBik(bik)
  if (!!bikErrors.length) {
    return bikErrors
  }
  if (typeof ks === 'number') {
    ks = ks.toString()
  } else if (typeof ks !== 'string') {
    ks = ''
  }
  if (!ks.length) {
    return ['К/С пуст']
  } else if (/[^0-9]/.test(ks)) {
    return ['К/С может состоять только из цифр']
  } else if (ks.length !== 20) {
    return ['К/С может состоять только из 20 цифр']
  } else {
    var bikKs = '0' + bik.toString().slice(4, 6) + ks
    var checksum = 0
    var coefficients = [
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
    ]
    for (var i in coefficients) {
      checksum += coefficients[i] * ((bikKs[i] as any) % 10)
    }
    if (checksum % 10 === 0) {
      return []
    } else {
      return ['Неправильное контрольное число']
    }
  }
}

export function validateOgrn(ogrn: string | number) {
  if (typeof ogrn === 'number') {
    ogrn = ogrn.toString()
  } else if (typeof ogrn !== 'string') {
    ogrn = ''
  }
  if (!ogrn.length) {
    return ['ОГРН пуст']
  } else if (/[^0-9]/.test(ogrn)) {
    return ['ОГРН может состоять только из цифр']
  } else if (ogrn.length !== 13) {
    return ['ОГРН может состоять только из 13 цифр']
  } else {
    var n13 = parseInt((parseInt(ogrn.slice(0, -1)) % 11).toString().slice(-1))
    if (n13 === parseInt(ogrn[12])) {
      return []
    } else {
      return ['Неправильное контрольное число']
    }
  }
}

export function validateOgrnip(ogrnip: string | number) {
  if (typeof ogrnip === 'number') {
    ogrnip = ogrnip.toString()
  } else if (typeof ogrnip !== 'string') {
    ogrnip = ''
  }
  if (!ogrnip.length) {
    return ['ОГРНИП пуст']
  } else if (/[^0-9]/.test(ogrnip)) {
    return ['ОГРНИП может состоять только из цифр']
  } else if (ogrnip.length !== 15) {
    return ['ОГРНИП может состоять только из 15 цифр']
  } else {
    var n15 = parseInt(
      (parseInt(ogrnip.slice(0, -1)) % 13).toString().slice(-1)
    )
    if (n15 === parseInt(ogrnip[14])) {
      return []
    } else {
      return ['Неправильное контрольное число']
    }
  }
}

export function validateRs(rs: string | number, bik: string | number) {
  const bikErrors = validateBik(bik)

  if (!!bikErrors.length) {
    return bikErrors
  }

  if (typeof rs === 'number') {
    rs = rs.toString()
  } else if (typeof rs !== 'string') {
    rs = ''
  }
  if (!rs.length) {
    return ['Р/С пуст']
  } else if (/[^0-9]/.test(rs)) {
    return ['Р/С может состоять только из цифр']
  } else if (rs.length !== 20) {
    return ['Р/С может состоять только из 20 цифр']
  } else {
    var bikRs = bik.toString().slice(-3) + rs
    var checksum = 0
    var coefficients = [
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
      3,
      7,
      1,
    ]
    for (var i in coefficients) {
      checksum += coefficients[i] * ((bikRs[i] as any) % 10)
    }
    if (checksum % 10 === 0) {
      return []
    } else {
      return ['Неправильное контрольное число']
    }
  }
}

export function validateSnils(snils: string | number) {
  var result = false
  if (typeof snils === 'number') {
    snils = snils.toString()
  } else if (typeof snils !== 'string') {
    snils = ''
  }
  if (!snils.length) {
    return ['СНИЛС пуст']
  } else if (/[^0-9]/.test(snils)) {
    return ['СНИЛС может состоять только из цифр']
  } else if (snils.length !== 11) {
    return ['СНИЛС может состоять только из 11 цифр']
  } else {
    var sum = 0
    for (var i = 0; i < 9; i++) {
      sum += parseInt(snils[i]) * (9 - i)
    }
    var checkDigit = 0
    if (sum < 100) {
      checkDigit = sum
    } else if (sum > 101) {
      checkDigit = parseInt((sum % 101) as any)
      if (checkDigit === 100) {
        checkDigit = 0
      }
    }
    if (checkDigit === parseInt(snils.slice(-2))) {
      return []
    } else {
      return ['Неправильное контрольное число']
    }
  }
}

export default validate
