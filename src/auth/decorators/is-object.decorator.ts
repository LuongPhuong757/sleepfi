import { Injectable } from '@nestjs/common'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { StackSettingDto } from 'src/admin/dtos/stacking_setting.dto'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsObject implements ValidatorConstraintInterface {
  async validate(array: Array<StackSettingDto>, args: ValidationArguments) {
    return array.every((item) => {
      for (const key in item) {
        if (typeof item[`${key}`] != 'number') {
          if (!item['end']) continue
          return false
        }
      }
      return (
        typeof item == 'object' &&
        item.hasOwnProperty('start') &&
        item.hasOwnProperty('end') &&
        item.hasOwnProperty('value')
      )
    })
  }

  defaultMessage() {
    return 'ARRAY.ARRAY_IS_INVALID'
  }
}

export function IsObjectCustom(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObject
    })
  }
}
