import { User } from '@/api/users/entities/user.entity';
import { UserService } from '@/api/users/services/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url =
      user.role.id === 8
        ? `http://localhost:3000/confirm?token=${user.id}`
        : `http://localhost:3000/reset?token=${user.id}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Welcome to Anik Rwanda! Confirm your Email',
      template: user.role.id === 8 ? '/confirmation' : '/reset',
      context: {
        name: user.name,
        url,
      },
    });
    return { message: 'user created successfully', data: user };
  }
}
