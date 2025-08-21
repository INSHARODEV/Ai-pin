 
import toast from "react-hot-toast";
export enum Methods {
  POST,
  GET,
  PUT,
  PATCH,
  DELETE,
}
export interface Params {
  url: string;
  method: Methods;
  body: any;
}
export async function MakeApiCall({ url, method, body }: Params) {
    console.log(body)
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
      method: Methods[method],
      body: body  ? body  : null,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`${await res.json()}`);
    }

    return await res.json();
  } catch (err: any) {
    console.log(err)
    alert(err.message)
    toast.error(err.meesage);
  throw new Error('unexpeted')
  }
}
