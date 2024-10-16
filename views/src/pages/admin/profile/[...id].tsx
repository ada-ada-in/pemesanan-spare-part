import React from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { getData, updateData } from "@/libs/handlerData";
import { GetRole } from "@/libs/manageRole";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin)
    return {
      redirect: {
        destination: "/",
      },
    };

  const id = context.params?.id;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUser] = await Promise.all([
    getData(token, `${backendUrl}/user/${id}`),
  ]);

  const role = await GetRole(token);

  if (role !== "admin") {
    return {
      redirect: {
        destination: "/wrong-role",
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
      id,
      data: dataUser.data,
    },
  };
}

export default function DetailUser({
  token,
  id,
  data,
}: {
  token: string;
  id: number;
  data: any;
}) {
  const router = useRouter();

  const [user, setUser] = React.useState({
    name: data.name || "",
    email: data.email || "",
    alamat: data.alamat || "",
    no_hp: data.no_hp || "",
    role: data.role || "",
    password: "",
    confPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await updateData(
      token,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
      user
    );
    if (response.status.code == 200) {
      setTimeout(() => {
        router.push("/admin/user");
      }, 1000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Sidebar>
      <h1 className="font-semibold text-2xl">Edit User Data</h1>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
        <form onSubmit={handleSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="name"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Name
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                value={user.name}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="email"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Email
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                value={user.email}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="alamat"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Address
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="alamat"
                id="alamat"
                onChange={handleChange}
                value={user.alamat}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="no_hp"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Phone Number
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="number"
                name="no_hp"
                id="no_hp"
                onChange={handleChange}
                value={user.no_hp}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="password"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Password
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                value={user.password}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="password"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Confirm Password
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="password"
                name="confPassword"
                id="confPassword"
                onChange={handleChange}
                value={user.confPassword}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="role"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Role
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <select
                name="role"
                id="role"
                onChange={handleChange}
                value={user.role}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <button
                type="submit"
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
