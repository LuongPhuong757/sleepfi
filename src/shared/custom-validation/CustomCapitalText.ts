import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'CustomCapital', async: false })
export class CustomCapitalText implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    for (let i = 0; i < text.length; i++) {
      const character = text.charAt(i)
      if (/^[A-Z]*$/.test(character)) {
        return false
      }
    }
    return true
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is contains uppercase character.'
  }
}
