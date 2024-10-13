export async function GetRole(token: any) {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/getrolewhenlogin`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const response = await request.json();
  const getRole = response.data.role;
  return getRole;
}
