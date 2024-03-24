import { Controller, Post, Body, ParseIntPipe, Param, ParseBoolPipe, Patch } from '@nestjs/common';
import { MailService } from './mail.service';
import { EditUserDto } from 'src/auth/dto/edit-user.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('send/:forPwd')
  async sendMail(@Body('email') to: string, @Param('forPwd', ParseBoolPipe) forPwd: boolean) {
    console.log(forPwd);
    if (forPwd) {
      return await this.mailService.sendMail(to, forPwd);
    }
    return await this.mailService.sendMail(to);
  }
  @Post(':code')
  verifyCode(@Param('code', ParseIntPipe) code: number, @Body('email') to: string) {
    // console.log(code);
    return this.mailService.confirmVerificationCode(to, code);
  }
  @Patch('findPassword')
  findPassword(@Body() body: EditUserDto) {
    // const {email, code, password} = body;
    return this.mailService.changePasswordByCode(body);
  }
}
