import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { userCredentials } from './account.types';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async register(@Body() userData: userCredentials) {
    return this.accountService.createAccount(userData);
  }

  @Post('login')
  async login(@Body() userData: userCredentials) {
    return this.accountService.login(userData);
  }
}
