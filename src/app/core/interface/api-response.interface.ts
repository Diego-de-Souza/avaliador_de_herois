export interface ApiResponse<T> {
    status: number;
    message: string;
    dataUnit?: T;
    data?: T[];
}