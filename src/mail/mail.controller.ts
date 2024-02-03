import { Controller, Post, Body, ParseIntPipe, Param } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('send')
  async sendMail(@Body('email') to: string) {
    return await this.mailService.sendMail(to);
  }
  @Post(':code')
  verifyCode(@Param('code', ParseIntPipe) code: number, @Body('email') to: string) {
    // console.log(code);
    return this.mailService.confirmVerificationCode(to, code);
  }
}
