const TOKEN_KEY = 'auth_token'

// Armazenar o token no localStorage
export function setSessionToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

// Obter o token do localStorage
export function getSessionToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// Remover o token (logout)
export function removeSessionToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// Verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  if (!getSessionToken()) {
    return false
  }

  return true;
}
