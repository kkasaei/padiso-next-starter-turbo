import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClerkService } from './clerk.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () =>
  (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(IS_PUBLIC_KEY, true, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(IS_PUBLIC_KEY, true, target);
    return target;
  };

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private clerkService: ClerkService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    // Try to verify as Clerk session token first
    const clerkResult = await this.clerkService.verifyToken(token);
    if (clerkResult.isValid) {
      request.userId = clerkResult.userId;
      request.auth = { userId: clerkResult.userId, type: 'clerk' };
      return true;
    }

    // Try to verify as MCP token
    const mcpResult = await this.clerkService.verifyMcpToken(token);
    if (mcpResult.isValid) {
      request.userId = mcpResult.userId;
      request.auth = { userId: mcpResult.userId, type: 'mcp' };
      return true;
    }

    throw new UnauthorizedException('Invalid token');
  }
}
