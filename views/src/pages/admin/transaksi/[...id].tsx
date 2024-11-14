import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { getData, updateData } from "@/libs/handlerData";
import { GetRole } from "@/libs/manageRole";
import Image from "next/image";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const id = context.params?.id;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataCartItem, dataCart] = await Promise.all([
    getData(token, `${backendUrl}/proses/${id}`),
    getData(token, `${backendUrl}/prosesorderid/${id}`),
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
      cartItem: dataCartItem?.data || {},
      dataCart: dataCart?.data || {},
      backendUrl,
    },
  };
}

export default function DetaiMotor({
  token,
  id,
  cartItem,
  dataCart,
}: {
  token: string;
  id: number;
  cartItem: any;
  dataCart: any;
}) {
  const router = useRouter();
  const [data, setData] = useState({
    isStatus: dataCart?.isStatus || "inden",
    isPaid: dataCart?.isPaid || "diproses",
  });

  const totalHarga = cartItem.reduce(
    (total: number, item: any) => total + item.harga,
    0
  );

  function handleChange(e: any) {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  const handlerSubmit = async (e: any) => {
    e.preventDefault();
    const response = await updateData(
      token,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/updatetransaksi/${id}`,
      data
    );
    if (response) {
      setTimeout(() => {
        router.push("/admin/transaksi");
      });
    }
  };

  return (
    <Sidebar>
      <h1 className="font-semibold text-2xl">Item Diproses</h1>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
        <form className="my-12" onSubmit={handlerSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama_kota"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama Pemesan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="sparepart_name"
                id="sparepart_name"
                autoComplete="given-name"
                disabled
                value={dataCart.user?.name}
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
                type="text"
                name="email"
                id="email"
                autoComplete="given-name"
                disabled
                value={dataCart.user?.email}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="alamat"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Alamat
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="alamat"
                id="alamat"
                autoComplete="given-name"
                disabled
                value={dataCart.user?.alamat}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="no_hp"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Handphone
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="no_hp"
                id="no_hp"
                autoComplete="given-name"
                disabled
                value={dataCart.user?.no_hp}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="isPaid"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Status Pembayaran
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <select
                required
                name="isPaid"
                id="isPaid"
                defaultValue={"diproses"}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="diproses">Diproses</option>
                <option value="bayar-sebagian">Bayar Sebagian</option>
                <option value="lunas">Lunas</option>
              </select>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="isStatus"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Status Barang
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <select
                required
                name="isStatus"
                id="isStatus"
                defaultValue={"inden"}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="inden">Inden</option>
                <option value="sudah-datang">Sudah Datang</option>
              </select>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <button
                type="submit"
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>

        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                No
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Nama Spare Part
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Harga
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Qty
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Jumlah Harga
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {cartItem &&
              cartItem.map((cart: any, number: number) => (
                <tr key={cart.id}>
                  <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                    {number + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {cart.sparepart.sparepart_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {cart.sparepart.price}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {cart.qty}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {cart.harga}
                  </td>
                </tr>
              ))}
            <tr>
              <th colSpan={4}>Total Harga</th>
              <th className="text-start" colSpan={1}>
                {`Rp. ${totalHarga}`}
              </th>
            </tr>
            <tr>
              <th colSpan={4}>Minimum Pembayaran</th>
              <th className="text-start" colSpan={1}>
                {`Rp. ${totalHarga / 2}`}
              </th>
            </tr>
          </tbody>
        </table>
        <br />
        <h1 className="font-semibold my-12 text-2xl">Bukti Pembayaran</h1>
        <br />
        <br />
        <div className="mt-4 mx-auto" style={{ maxWidth: "700px" }}>
          <Image
            src={`/images/${dataCart.image}`}
            alt="Image Preview"
            layout="responsive"
            width={700}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </Sidebar>
  );
}
