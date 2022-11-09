
/**
 * @Description log something into somewhere, like db or third party libraries.
*/
export class LogService {
  static log = (message: string, ...args: any[]) => {
    console.log(message, args);
  }

  static warn = (message: string, ...args: any[]) => {
    console.warn(message, args);
  }
}