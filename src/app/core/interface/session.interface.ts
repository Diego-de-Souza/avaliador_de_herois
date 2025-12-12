export interface ActiveSession {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    isCurrent?: boolean;   
    isLoggingOut?: boolean;   
}