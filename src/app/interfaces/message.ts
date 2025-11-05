export interface IMessage {
  sender: 'user' | 'bot';  
  content: string;           
  timestamp?: Date;        
}
