import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  /*
   * Properties of ValidationArguments
   * 1) value*
   * 2) constraints*
   * 3) targetName
   * 4) object
   * 5) property*
   */
  if (args.constraints.length === 2) {
    return `${args.property} should be between ${args.constraints[0]} and ${args.constraints[1]} characters.`;
  } else {
    return `${args.property} should be at least ${args.constraints[0]} characters.`;
  }
};
