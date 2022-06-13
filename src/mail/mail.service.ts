import { User } from '@/api/users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:4000/auth/confirm?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Welcome to Anik Rwanda! Confirm your Email',
      template: '/confirmation',
      context: {
        name: user.name,
        url,
      },
    });
    return { message: 'user created successfully', data: user };
  }
}
