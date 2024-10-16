import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AccountService } from './account.service';

@Injectable()
export class AccountMiddleware implements NestMiddleware {

  constructor(
    private readonly accountService: AccountService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];

    const userId = this.accountService.isAuthenticated(authHeader);

    if (!userId) {
      // O NestJS já trata exceções lançadas dentro de middlewares e retorna uma resposta HTTP adequada
      throw new UnauthorizedException('Invalid token or session');
    }

    // se o usuário estiver autenticado, anexa os dados da sessão ao req para ser usados depois 
    req.userId = userId;

    // chama o próximo middleware / rota
    next();
  }
}