import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
/* eslint-disable @typescript-eslint/no-var-requires */
const nodemailer = require('nodemailer');

handlebars.registerHelper('capitalize', function (value) {
  return value.charAt(0);
});

handlebars.registerHelper('highlightMentionedUser', function (comment) {
  const regex = /(\()([^)]+)(\))/g;
  return comment.replace(regex, '<span style="color: #218DE3">$2</span>');
});

type ITemplate = { to: string; [key: string]: any };

@Injectable()
export class MailService {
  private MAIL_FROM: string;
  private LMS_HOST: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.LMS_HOST = configService.getOrThrow('ORIGIN_URL');
    this.MAIL_FROM = configService.getOrThrow('MAIL_FROM');
  }

  async sendEmail(to: string, subject: string, html: string) {
    const port = this.configService.get('MAIL_PORT');
    const transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port,
      secure: port == 465,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });

    const message = {
      from: `"LMS" <${this.MAIL_FROM}>`,
      to,
      subject,
      html,
    };

    try {
      // Will retry sending 3 times
      const retrySending = async (retry = 3, error?: any) => {
        if (retry == 0) {
          throw new Error(error);
        }
        console.log(retry);
        try {
          return await transporter.sendMail(message);
        } catch (error) {
          await retrySending((retry -= 1), error);
        }
      };
      return await retrySending();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Failed to send an email, please try again later'
      );
    }
  }

  stripTrailingSlash(hostname: string) {
    return hostname?.endsWith('/') ? hostname.slice(0, -1) : hostname;
  }

  private createTemplate = (filename: string, replacements: ITemplate) => {
    const filePath = path.join(__dirname, '/mails/templates/' + filename);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlToSend = template({
      ...replacements,
      appName: 'LMS',
      appLink: '',
    });
    return htmlToSend;
  };

  async sendPasswordResetEmail(to: string, token: string, firstName: string) {
    const subject = 'Password Reset Instructions';
    const url = `${this.LMS_HOST}/auth/changepass/${token}`;
    // Attach template
    const html = this.createTemplate('welcome.hbs', {
      to,
      token,
      url,
      name: firstName,
    });

    await this.sendEmail(to, subject, html);
  }
}
