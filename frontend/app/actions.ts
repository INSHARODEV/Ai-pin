import toast from "react-hot-toast";

export enum Methods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface Params {
  url: string;
  method: Methods;
  body?: any;
  queryString?: string;
  headers?: any;
}

const contentTypes = {
  json: 'application/json',
  form: 'multipart/form-data'
};

export async function MakeApiCall({ url, method, body, queryString, headers }: Params) {
  try {
    const customHeaders: Record<string, string> = {
      "Authorization": `Bearer ${localStorage?.getItem("accessToken")}`,
    };

    if (headers) {
      customHeaders["Content-Type"] = contentTypes[headers as keyof typeof contentTypes]  
    }

    const queryParam = queryString ? `?${queryString}` : '';
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}${queryParam}`, {
      method,
      body: body ? body : undefined,
      headers: customHeaders,
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        try {
          // Handle token refresh
          const authToken = await MakeApiCall({
            method: Methods.GET,
            url: '/auth/refresh'
          });
          
          console.log(authToken);
          localStorage.setItem('accessToken', authToken.data || authToken);
          
          // Retry the original request with new token
          customHeaders["Authorization"] = `Bearer ${authToken.data || authToken}`;
          const retryRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}${queryParam}`, {
            method,
            body: body ? body : undefined,
            headers: customHeaders,
            credentials: "include",
          });
          
          if (retryRes.ok) {
            return await retryRes.json();
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Redirect to login or handle auth failure
          window.location.href = '/login';
          throw new Error("Session expired. Please login again.");
        }
      }

      const errorData = await res.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await res.json();
  } catch (err: any) {
    console.error(err);
    toast.error(err.message);
    throw new Error(err.message);
  }
}