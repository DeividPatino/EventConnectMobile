export interface User {
  uid: string;                
  email: string;              
  firstName: string;      
  lastName: string;           
  idType: 'cc' | 'ce' | 'ti' | 'passport';  
  idNumber: string;           
  phone: string;           
  password: string;           
  birthDate: string;          
  photos: string[];     
  role?: 'user' | 'organizer' | 'admin';
}