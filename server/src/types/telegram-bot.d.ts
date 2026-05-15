declare module 'node-telegram-bot-api' {
  class TelegramBot {
    constructor(token: string, options?: { polling?: boolean; webHook?: boolean });
    sendMessage(chatId: number, text: string, options?: any): Promise<any>;
    getFileLink(fileId: string): Promise<string>;
    onText(regexp: RegExp, callback: (msg: any, match: any) => void): void;
    on(event: string, callback: (msg: any) => void): void;
    answerCallbackQuery(callbackQueryId: string, options?: any): Promise<any>;
  }
  export default TelegramBot;
}
