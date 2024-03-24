import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EditUserDto } from 'src/auth/dto/edit-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
  private transporter;
  private OTPs = {};
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      // SMTP 설정
      host: 'smtp.gmail.com', //smtp 호스트
      port: 587,
      secure: false,
      auth: {
        user: configService.get('MAILER_ID'),
        pass: configService.get('MAILER_PASS')
      }
    });
  }
  async sendMail(to: string, forPwd: boolean = false) {
    // console.log('22)');
    // console.log(to);
    const checkUser = await this.usersService.checkUser(to);
    // console.log(checkUser);

    if (!forPwd && checkUser) {
      throw new BadRequestException('Email already exists.');
    }
    if (forPwd && !checkUser) {
      throw new BadRequestException("Email doesn't exists.");
    }

    this.OTPs[to] = Math.floor(Math.random() * 888889);
    // console.log(this.OTP);
    // console.log(this.OTPs);
    // console.log(to);

    try {
      await this.transporter.sendMail({
        from: 'noreply@potato.com',
        to: to, //string or Array
        subject: 'Varicication code Potato',
        text: `Hi, here's your verification code: ${this.OTPs[to]}`
        /* 
        html: htmlData, //내용이 html이라면 text 대신 사용
        cc: [ex1@kigo.com, ex2@kigo.com] //참조
        attachments: attachments //첨부파일
        */
      });
      console.log('메일이 전송되었습니다 mailservice 38');
      setTimeout(
        () => {
          if (Object.keys(this.OTPs).includes(to)) {
            delete this.OTPs[to];
          }
        },
        1000 * 60 * 5
      );
      return true;
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
    }
  }
  clearOTP() {
    // this.OTP = null;
  }
  confirmVerificationCode(to: string, code: number) {
    // console.log(this.OTPs[to]);
    console.log(`mail service line 70 ${to} ${code}`);
    if (code === this.OTPs[to]) {
      this.clearOTP();

      return true;
    } else {
      throw new UnauthorizedException('Code is not correct');
    }
  }
  changePasswordByCode(body: EditUserDto) {
    // console.log(body);
    // console.log(body.code);
    // console.log(this.OTPs[body.email]);
    // const pwdDto = { password: pwd };
    if (Number(body.code) === this.OTPs[body.email]) {
      this.usersService.changePwd(body.email, body);
    } else {
      throw new UnauthorizedException('Code is expired or wrong. Try with new code');
    }
  }
}
