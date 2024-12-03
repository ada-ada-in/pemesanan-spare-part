import axios from "axios";

export async function fetchSpareParts(token: string, backendUrl: string) {
  const response = await axios.get(`${backendUrl}/sparepart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
