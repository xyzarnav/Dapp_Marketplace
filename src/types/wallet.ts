export class WalletError extends Error {
  code?: number;
  constructor(message: string, code?: number) {
    super(message);
    this.name = 'WalletError';
    this.code = code;
  }
}
