import { getData } from "@/libs/handlerData";
import Image from "next/image";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { GetRole } from "@/libs/manageRole";
import axios from "axios";
import React from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const id = context.params?.id;
  const [responseData] = await Promise.all([
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
      data: responseData.data || [],
      backendUrl,
    },
  };
}

export default function Print({
  token,
  data,
  backendUrl,
  id,
}: {
  token: string;
  data: any[];
  id: string;
  backendUrl: any;
}) {
  const [dataOrder, setDataOrder] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/proses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.data) {
          setDataOrder(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrderData();
  }, [backendUrl, id, token]);

  setTimeout(() => {
    window.print();
  }, 2000);

  return (
    <>
      <section className="container mx-auto py-4 grid grid-rows-3 grid-flow-col">
        <div className="flex place-content-center">
          <div>
            <Image
              src="/images/new-yamaha.png"
              width={150}
              height={80}
              alt="logo"
            />
          </div>
          <div className="mx-12">
            <p className="font-medium">Yamaha Sabang Raya Motor Handil</p>
            <p>
              Jalan D.I. Panjaitan No. 77 RT. 26 Kebun Handil
              <br />
              Kec. Jelutung Jambi 36136
            </p>
            <p className="font-medium">Phone : +62 812-7359-0007</p>
            <p className="font-medium">Email : sabang.handil2022@gmail.com</p>
          </div>
          <div>
            <p className="font-medium">Nama :</p>
            <p>----------------------------------------------------</p>
            <p className="font-medium">Alamat :</p>
            <p>----------------------------------------------------</p>
          </div>
        </div>

        <div className="w-5/6 mx-auto my-4">
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
              {Array.isArray(dataOrder) &&
                dataOrder.map((cart, number) => (
                  <tr key={cart.id || number}>
                    <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                      {number + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {cart.sparepart?.sparepart_name || "No Name"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {`Rp. ${cart.sparepart?.price || 0}`}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {cart.qty || 0}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {`Rp. ${cart?.harga || 0}`}
                    </td>
                  </tr>
                ))}
              <tr>
                <th colSpan={4} className="text-left py-4">
                  Total Harga
                </th>
                <th className="text-start py-4" colSpan={1}>
                  {`Rp. ${dataOrder.reduce(
                    (total, cart) => total + (cart?.harga || 0),
                    0
                  )}`}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
