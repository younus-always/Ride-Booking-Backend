export interface TErrrorSources {
      path: string;
      message: string;
};

export interface TErrorResponse {
      statusCode: number;
      message: string;
      errorSources?: TErrrorSources[];
};