import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  /*
   * Properties of ValidationArguments
   * 1) value* 검증되고 있는 값
   * 2) constraints* 파라미터에 입력된 제한 사항들(ex 최소길이, 최대길이 배열 형식)
   * 3) targetName
   * 4) object
   * 5) property* 검증되고 있는 객체의 이름
   */
  if (args.constraints.length === 2) {
    return `${args.property} should be between ${args.constraints[0]} and ${args.constraints[1]} characters.`;
  } else {
    return `${args.property} should be at least ${args.constraints[0]} characters.`;
  }
};
