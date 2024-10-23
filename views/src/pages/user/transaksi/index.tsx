import React from "react";
import UserSidebar from "@/components/UserSidebar";
import Table from "@/components/Table";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { getData } from "@/libs/handlerData";
import { GetRole } from "@/libs/manageRole";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin)
    return {
      redirect: {
        destination: "/login",
      },
    };

  GetRole(token);
  const role = await GetRole(token);

  if (role !== "user") {
    return {
      redirect: {
        destination: "/wrong-role",
        permanent: false,
      },
    };
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataTransaksi] = await Promise.all([
    getData(token, `${backendUrl}/userorder `),
  ]);
  return {
    props: {
      token,
      data: dataTransaksi.data,
    },
  };
}

export default function Index({
  data,
  token,
  profile,
}: {
  token: string;
  data: any[] | null;
  profile: any[] | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [id, setId] = React.useState();
  const [motorName, setMotorName] = React.useState();
  const [tahun, setTahun] = React.useState();
  async function handlerDeleteModal(e: any, id: any) {
    e.preventDefault();
    setOpen(true);
    setOpenImage(true);
    setId(id);
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/motor/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = await request.json();
      if (response.status.code == 200) {
        toast.success(response.status.message);
        setTimeout(() => {
          router.push("/admin/motor");
        }, 500);
      } else {
        toast.error(response.status.message);
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <>
      <UserSidebar profile={profile}>
        <Table
          title="Transaksi"
          description="Management data transaksi pada Yamaha Sabang Raya
        Motor Handil."
          link="/user/transaksi/add"
          data={data}
        >
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  hidden
                >
                  ID Kota
                </th>
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
                  Nomor Transaksi
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total Harga
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data &&
                data.map((transaksi: any, number) => (
                  <tr key={transaksi.id}>
                    <td
                      className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500"
                      hidden
                    >
                      {transaksi.id}
                    </td>
                    <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                      {number + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.transaksi_number}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.price_total}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {transaksi.status === "belum-bayar" ? (
                        <span className="bg-red-500 text-white p-3">
                          Belum Bayar
                        </span>
                      ) : transaksi.status === "inden" ? (
                        <span className="bg-orange-500 text-white p-3">
                          Inden
                        </span>
                      ) : transaksi.status === "sudah-datang" ? (
                        <span className="bg-blue-500 text-white p-3">
                          Sudah Sampai
                        </span>
                      ) : transaksi.status === "lunas" ? (
                        <span className="bg-green-500 text-white p-3">
                          Lunas
                        </span>
                      ) : (
                        <span className="bg-gray-500 text-white p-3">
                          Unknown Status
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.image ? (
                        <button
                          onClick={() => setOpenImage(true)}
                          className="text-blue-500 underline"
                        >
                          buktipembayaran.jpg
                        </button>
                      ) : (
                        "Belum ada bukti pembayaran"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.createdAt}
                    </td>
                    <td className="min-w-max relative whitespace-nowrap py-4 text-sm font-medium sm:pr-6 flex gap-4">
                      <Link
                        href={`/user/transaksi/${transaksi.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Detail
                      </Link>
                    </td>
                    <Dialog
                      className="relative z-50"
                      open={openImage}
                      onClose={setOpenImage}
                    >
                      <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                      />
                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                          >
                            <div className="sm:flex sm:items-start">
                              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle
                                  as="h1"
                                  className="text-base font-semibold leading-6 text-gray-900"
                                >
                                  Bukti Pembayaran
                                </DialogTitle>
                                <div className="imageContainer">
                                  <Image
                                    className="customImage"
                                    src="/images/author.png"
                                    width={3000}
                                    height={3000}
                                    alt="Picture of the author"
                                  />
                                </div>
                                <div className="mt-3 space-x-3">
                                  <button
                                    className="bg-cyan-600 py-2 px-3 text-white rounded-md"
                                    onClick={() => setOpenImage(false)}
                                  >
                                    Kembali
                                  </button>
                                </div>
                              </div>
                            </div>
                          </DialogPanel>
                        </div>
                      </div>
                    </Dialog>
                  </tr>
                ))}
            </tbody>
          </table>
        </Table>
      </UserSidebar>
    </>
  );
}
