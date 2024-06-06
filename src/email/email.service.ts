import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(user: User) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                from: '"Safety Driving Team" <afdulrohmat03@gmail.com>', // override default from
                subject: 'Welcome to Safety Driving App! Confirm your Email',
                template: './confirmation', // `.hbs` extension is appended automatically
                context: { // ✏️ filling curly brackets with content
                    name: user.username,
                    activationCode: user.activationCode,
                },
            });

            return {
                success: true,
            };
        } catch (error) {
            console.log("smtp error: ", error)
            return {
                success: false,
            };
        }

    }
}
