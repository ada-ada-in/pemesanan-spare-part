import React, { useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import { useRouter } from "next/router";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { getData } from "@/libs/handlerData";
import { GetRole } from "@/libs/manageRole";
import FileUploader from "../../../components/FileUploader";

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
  const [dataCartItem] = await Promise.all([
    getData(token, `${backendUrl}/userorder/${id}`),
  ]);
  const role = await GetRole(token);

  if (role !== "user") {
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
      backendUrl,
    },
  };
}

export default function DetaiMotor({
  token,
  id,
  cartItem,
}: {
  token: string;
  id: number;
  cartItem: any;
}) {
  const totalHarga = cartItem.reduce(
    (total: number, item: any) => total + item.harga,
    0
  );

  return (
    <UserSidebar>
      <h1 className="font-semibold text-2xl">Item Transaksi</h1>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
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
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(cart.harga || 0)}
                  </td>
                </tr>
              ))}

            <tr>
              <th colSpan={4}>Total Harga</th>
              <th className="text-start" colSpan={1}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalHarga || 0)}
              </th>
            </tr>
            <tr>
              <th colSpan={4}>Minimum Pembayaran</th>
              <th className="text-start" colSpan={1}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalHarga / 2 || 0)}
              </th>
            </tr>
          </tbody>
        </table>
        <FileUploader
          token={token}
          id={id}
          uploadUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`}
        />
      </div>
    </UserSidebar>
  );
}
