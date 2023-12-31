import { PipeTransform, ArgumentMetadata, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < 8) {
      throw new BadRequestException('Password should not be less than 8 characters');
    }
    return value.toString();
  }
}
@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly subject: string
  ) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`Maximum length of ${this.subject} is ${this.length}`);
    }
    return value.toString();
  }
}
@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly subject: string
  ) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < 8) {
      throw new BadRequestException(`Minimum length of ${this.subject} should be ${this.length}`);
    }
    return value.toString();
  }
}
