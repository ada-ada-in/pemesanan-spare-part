import React from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

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
            Router.push("/admin");
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
          <h2 className="mb-8 text-3xl font-bold md:mb-12 md:text-3xl">
            Sistem informasi pemesanan sparepart yamaha sabang raya motor handil
          </h2>
          <form className="mx-auto mb-4 max-w-sm pb-4" onSubmit={handlerLogin}>
            <input
              type="email"
              className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
              maxLength={256}
              name="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
              placeholder="Password (min 8 characters)"
              required
              name="password"
              onChange={handleChange}
            />
            <label className="mb-6 flex items-center pb-12 font-medium lg:mb-1">
              <input type="checkbox" name="checkbox" />
              <span className="ml-4 inline-block cursor-pointer text-sm">
                I agree with the{" "}
                <a href="#" className="font-bold text-[#0b0b1f]">
                  Terms & Conditions
                </a>
              </span>
            </label>
            <button
              type="submit"
              className="group relative h-12 w-72 overflow-hidden rounded-2xl bg-cyan-600 text-lg font-bold text-white"
            >
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
          <p className="mb-8 text-[#647084] md:mb-12 lg:mb-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
            purus sit amet luctus venenatis, lectus magna fringilla urna,
            porttitor rhoncus dolor purus non enim.
          </p>
          <p className="font-bold">John Robert</p>
          <p className="text-sm">Senior Webflow Developer</p>
        </div>
      </div>
    </div>
  );
}
