//interfaces genericas de api.
export interface SuccessResponse {
	success: boolean;
	message: string;
}

export interface IdResponse {
	id: number;
	message: string;
}

export interface DataResponse<T> {
	data: T;
	message: string;
}
