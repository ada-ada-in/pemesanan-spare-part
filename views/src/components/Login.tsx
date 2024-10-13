import React from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function Login() {
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  async function handlerLogin(e: any) {
    e.preventDefault();
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const response = await request.json();
      if (request.status !== 201 || !response.data) {
        return toast.error("Email atau password salah");
      }
      const getDataRole = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getrolewhenlogin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.data}`,
          },
        }
      );

      const getRole = await getDataRole.json();
      const role = getRole.data.role;
      role === "admin"
        ? (toast.success("Admin login success"),
          setTimeout(() => {
            Router.push("/admin");
          }, 1000))
        : (toast.success("User login success"),
          setTimeout(() => {
            Router.push("/user");
          }, 1000));

      Cookies.set("token", response.data);
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <div className="grid md:h-screen md:grid-cols-2">
      <div className="flex flex-col items-center justify-center bg-white">
        <div className="max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
          <h1 className="text-blue-900 font-bold text-4xl font-sans mb-12">
            Sistem Informasi Pemesanan Sparepart
          </h1>
          <form
            className="mx-auto w-96 mb-4 max-w-sm pb-4"
            onSubmit={handlerLogin}
          >
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                type="email"
                name="email"
                id=""
                placeholder="Email"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                type="password"
                name="password"
                id=""
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="group relative h-12 w-96 overflow-hidden rounded-2xl bg-cyan-600 text-lg font-bold text-white"
            >
              Login
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
          </form>
          <p className="text-sm text-[#636262]">
            Dont have an account?{" "}
            <Link href="/register" className="text-sm font-bold text-black">
              Register
            </Link>
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden md:flex bg-gradient-to-tr from-cyan-600  to-cyan-700 i justify-around items-center hidden ">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Yamaha Sabang Raya
            <br />
            Motor Handil
          </h1>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
    </div>
  );
}
