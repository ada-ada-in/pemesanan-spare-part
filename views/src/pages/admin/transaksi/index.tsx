import React from "react";
import Sidebar from "@/components/Sidebar";
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
  const role = await GetRole(token);
  if (role !== "admin") {
    return {
      redirect: {
        destination: "/wrong-role",
        permanent: false,
      },
    };
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [proses] = await Promise.all([
    getData(token, `${backendUrl}/transaksi`),
  ]);
  return {
    props: {
      token,
      data: proses.data,
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
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);

  React.useEffect(() => {
    // Filtering logic based on date input
    if (startDate && endDate && data) {
      const filtered = data.filter((transaksi) => {
        const transactionDate = new Date(transaksi.createdAt);
        return (
          transactionDate >= new Date(startDate) &&
          transactionDate <= new Date(endDate)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset if no dates are selected
    }
  }, [startDate, endDate, data]);

  async function handlerDeleteModal(e: any, id: any) {
    e.preventDefault();
    setOpen(true);
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
      <Sidebar profile={profile}>
        <Table
          title="Transaksi"
          description="Management data transaksi pada Yamaha Sabang Raya Motor Handil."
          link="/user/transaksi/add"
          data={filteredData}
        >
          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
              placeholder="End Date"
            />
          </div>
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  hidden
                >
                  ID Kota
                </th>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  No
                </th>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Nama
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Nomor Transaksi
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Total Harga
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status Barang
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Image
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Tanggal
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredData &&
                filteredData.map((transaksi: any, index) => (
                  <tr key={transaksi.id}>
                    <td
                      className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500"
                      hidden
                    >
                      {transaksi.id}
                    </td>
                    <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.user.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.transaksi_number}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      Rp. {transaksi.price_total}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`${
                          transaksi.isPaid === "belum-bayar"
                            ? "bg-red-700"
                            : transaksi.isPaid === "diproses"
                            ? "bg-orange-500"
                            : transaksi.isPaid === "bayar-sebagian"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        } text-white p-3`}
                      >
                        {transaksi.isPaid === "belum-bayar"
                          ? "Belum Bayar"
                          : transaksi.isPaid === "diproses"
                          ? "Diproses"
                          : transaksi.isPaid === "bayar-sebagian"
                          ? "bayar-sebagian"
                          : "Lunas"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`${
                          transaksi.isStatus === "bayar-telebih-dahulu"
                            ? "bg-red-700"
                            : transaksi.isStatus === "inden"
                            ? "bg-orange-500"
                            : "bg-green-500"
                        } text-white p-3`}
                      >
                        {transaksi.isStatus === "bayar-telebih-dahulu"
                          ? "Bayar Terlebih Dahulu"
                          : transaksi.isStatus === "inden"
                          ? "Inden"
                          : "Sudah Sampai"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.image ? (
                        <button
                          onClick={() => {
                            setOpenImage(true);
                            setSelectedImage(transaksi.image);
                          }}
                          className="text-blue-500 underline"
                        >
                          Lihat Gambar
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
                        href={`/admin/diproses/${transaksi.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Modal for Image */}
          <Dialog
            className="relative z-50"
            open={openImage}
            onClose={() => setOpenImage(false)}
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                  transition
                  className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl"
                >
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h1"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Bukti Pembayaran
                      </DialogTitle>
                      {selectedImage && (
                        <div className="imageContainer">
                          <Image
                            className="customImage"
                            src={`/images/${selectedImage}`}
                            width={1200}
                            height={1200}
                            alt="Bukti Pembayaran"
                          />
                        </div>
                      )}
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
        </Table>
      </Sidebar>
    </>
  );
}
