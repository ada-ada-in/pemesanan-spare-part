import { toast } from "react-hot-toast";
export async function getData(token: string, url: string) {
  const request = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const response = await request.json();
  return response;
}

export async function postData(e: any, token: string, url: string, data: any) {
  try {
    e.preventDefault();
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.status.code == 201) {
      toast.success(response.status.message);
    } else {
      toast.error(response.status.message);
    }
    return response;
  } catch (error: any) {
    console.error(`message : ${error}`);
  }
}
