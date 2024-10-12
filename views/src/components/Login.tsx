import React from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { GetServerSidePropsContext } from "next";
import { guard, Guard } from "@/libs/middleware";
import Image from "next/image";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (isLogin)
    return {
      redirect: {
        destination: "/admin",
      },
    };
  return { props: {} };
}

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
      const getMyProfile = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.token}`,
          },
        }
      );
      const myProfile = await getMyProfile.json();
      if (myProfile.data.role !== "admin")
        return toast.error("Email dan password salah");
      if (response.token) {
        Cookies.set("token", response.token);
        toast.success("Login berhasil");
        setTimeout(() => {
          Router.push("/admin");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <>
      {/* <div className="flex min-h-screen flex-1 bg-gray-200 lg:h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <h2 className="my-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Login
            </h2>
            <form className="space-y-6" onSubmit={handlerLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="masukan email"
                    autoComplete="email"
                    required
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    placeholder="********"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> */}

      <div className="grid md:h-screen md:grid-cols-2">
        <div className="flex flex-col items-center justify-center bg-white">
          <div className="max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
            <h2 className="mb-8 text-3xl font-bold md:mb-12 md:text-3xl">
              Sistem informasi pemesanan sparepart yamaha sabang
              raya motor handil
            </h2>
            <form
              className="mx-auto mb-4 max-w-sm pb-4"
              onSubmit={handlerLogin}
            >
              <div className="relative">
                {/* <Image
                  alt=""
                  src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg"
                  className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                /> */}
                <input
                  type="email"
                  className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                  maxLength={256}
                  name="email"
                  placeholder="Email Address"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="relative mb-4">
                {/* <Image
                  alt=""
                  src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg"
                  className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                /> */}
                <input
                  type="password"
                  className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                  placeholder="Password (min 8 characters)"
                  required
                  onChange={handleChange}
                />
              </div>
              <label className="mb-6 flex items-center pb-12 font-medium lg:mb-1">
                <input type="checkbox" name="checkbox" />
                <span className="ml-4 inline-block cursor-pointer text-sm">
                  I agree with the{" "}
                  <a href="#" className="font-bold text-[#0b0b1f]">
                    Terms & Conditions
                  </a>
                </span>
              </label>
              <button className="group relative h-12 w-72 overflow-hidden rounded-2xl bg-cyan-600 text-lg font-bold text-white">
                Login
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>
            </form>
            <p className="text-sm text-[#636262]">
              Dont have an account?{" "}
              <a href="/register" className="text-sm font-bold text-black">
                Register
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#f2f2f7]">
          <div className="max-w-lg px-5 py-16 md:px-10 md:py-24 lg:py-32">
            <div className="mb-6 ml-2 flex h-14 w-14 items-center justify-center bg-[#276ef1] [box-shadow:rgb(171,_196,_245)_-8px_8px]">
              {/* <Image
                src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358f5ec37c8c32b17d1c725_Vector-9.svg"
                alt=""
                className="inline-block"
              /> */}
            </div>
            <p className="mb-8 text-[#647084] md:mb-12 lg:mb-16">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
              aliquam, purus sit amet luctus venenatis, lectus magna fringilla
              urna, porttitor rhoncus dolor purus non enim.
            </p>
            <p className="font-bold">John Robert</p>
            <p className="text-sm">Senior Webflow Developer</p>
          </div>
        </div>
      </div>
    </>
  );
}
