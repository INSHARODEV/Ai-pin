 
// import toast from "react-hot-toast";
// export enum Methods {
//   POST,
//   GET,
//   PUT,
//   PATCH,
//   DELETE,
// }
// export interface Params {
//   url: string;
//   method: Methods;
//   body: any;
// }
// export async function MakeApiCall({ url, method, body }: Params) {
//     console.log(body)
//   try {
//     const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
//       method: Methods[method],
//       body: body  ? body  : null,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     if (!res.ok) {
//       throw new Error(`${await res.json()}`);
//     }

//     return await res.json();
//   } catch (err: any) {
//     console.log(err)
//     alert(err.message)
//     toast.error(err.meesage);
//   throw new Error('unexpeted')
//   }
// }



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
  queryString?:string
  headers?:any
}

export async function MakeApiCall({ url, method, body,queryString ,headers }: Params) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}?${queryString}`, {
      method,
      body: body ?  body  : undefined,
      headers: {
        'content-type':'application/json',
        "Authorization": `Bearer ${localStorage?.getItem("accessToken")}`,
        
      },
      credentials: "include",
    });

    if (!res.ok) {
      if(res.status===401){
        let authToken=await MakeApiCall({method:Methods.GET,url:'/auth/refresh'})
console.log(authToken)
        localStorage.setItem('accessToken',authToken)
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

