import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { tokenLogin, userCredentials } from './account.types';

@Injectable()
export class AccountService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount( userData: userCredentials ) : Promise<tokenLogin | BadRequestException> {
    try{
      // criamos o hash da senha para armazenamento seguro
      const hashedPassword = await argon2.hash(userData.password);
  
      // criamos o usuário no banco de dados com prisma
      await this.prismaService.user.create({
        data: { 
          email: userData.email, 
          password: hashedPassword 
        },
      });
  
    } catch(e) {
      // em caso de erros como email duplicado ou qualquer outo, retornamos um erro 400
      // Não informamos se a conta já existe por questões de segurança.
      throw new BadRequestException('Failed to create account')
    }
  
    // se não parou no catch, já adiantamos o login para retornar o token de autenticação da conta recém-criada
    return this.login({ 
      email: userData.email, 
      password: userData.password 
    });
  }

  async login(userData: userCredentials) : Promise<tokenLogin | UnauthorizedException> {
    // desencapsulamos o email e a senha do objeto userData em variáveis separadas
    const { email, password } = userData;

    // realizamos a busca do usuário no banco de dados, apenas pelo e-mail, para verificar o argon2 depois
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      // retornamos uma mensagem genérica por questões de segurança.
      throw new UnauthorizedException('Invalid email or password');
    }

    // com o registro em mãos, podemos verificar a senha salva (user.password) com a senha fornecida (password)
    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      // retornamos uma mensagem genérica por questões de segurança.
      throw new UnauthorizedException('Invalid email or password');
    }

    // se tudo certo, criamos um jwt assinado com o id do usuário
    const token = this.jwtService.sign({ userId: user.id });

    return { token };
  }

  isAuthenticated(authHeader : string) : false | number {
    
    // receberemos o header de autorização, que deve ser do tipo Bearer com jwt
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    // separamos o token do header ("Bearer token") -> token
    const token = authHeader.split(' ')[1];

    try {
      // Verifica e decodifica o JWT
      const payload = this.jwtService.verify(token);

      // Retorna o userId do payload se o token for válido
      return payload.userId
    } catch (error) {
      return false;
    }
  }
}