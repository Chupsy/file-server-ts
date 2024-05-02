export class Exception extends Error {
    public readonly internalCode:number;
    public readonly message:string;
  
    constructor(message:string, internalCode:number) {
      super(message);
      this.message= message;
      this.internalCode = internalCode;
    }
}
  