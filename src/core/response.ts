export function error(message?: string, error?: any, maintenance: boolean = false): { success: boolean, message: string, error: any, maintenance: boolean } {
  return {
    success: false,
    message,
    error,
    maintenance
  };
}

export function success(message?: string, data?: any): { success: boolean, message: string, data: any } {
  // check if with pagination
  if (data && data.paging) {
    const newResult: any = {};
    newResult.success = true;
    newResult.message = message;
    newResult.data = data.results || data.result || data;
    newResult.paging = data.paging;
    return newResult;
  }
  return {
    success: true,
    message,
    data
  };
}
