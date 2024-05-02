export class Exception extends Error {
  constructor(
    public readonly message: string,
    public readonly internalCode: number,
    public readonly errors?: {
      property: string;
      errors: {};
    }[],
  ) {
    super(message);
  }
}
