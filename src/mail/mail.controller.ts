import { Controller, Post, Body, ParseIntPipe, Param } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('send')
  async sendMail(@Body('to') to: string) {
    return await this.mailService.sendMail(to);
  }
  @Post(':code')
  verifyCode(@Param('code', ParseIntPipe) code: number, @Body('to') to: string) {
    return this.mailService.confirmVerificationCode(to, code);
  }
}
