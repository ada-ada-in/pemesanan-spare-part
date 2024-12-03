import React from "react";
import Sidebar from "@/components/Sidebar";
import TableNotButton from "@/components/TableNotButton";
import Link from "next/link";
import Image from "next/image";
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
import Pagination from "@/components/Pagination";
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
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const itemsPerPage = 8;
  const currentData =
    filteredData?.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ) || [];

  React.useEffect(() => {
    if (data) {
      let filtered = data;

      if (startDate && endDate) {
        filtered = filtered.filter((transaksi) => {
          const transactionDate = new Date(transaksi.createdAt);
          return (
            transactionDate >= new Date(startDate) &&
            transactionDate <= new Date(endDate)
          );
        });
      }

      if (searchTerm) {
        filtered = filtered.filter((transaksi) => {
          const { user, transaksi_number, isPaid, isStatus } = transaksi;
          return (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaksi_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            isPaid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            isStatus.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }

      setFilteredData(filtered.length > 0 ? filtered : null);
    }
  }, [startDate, endDate, searchTerm, data]);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Sidebar profile={profile}>
        <TableNotButton
          title="Transaksi"
          description="Management data transaksi pada Yamaha Sabang Raya Motor Handil."
          link="/admin/transaksi/add"
          data={currentData}
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded p-2"
              placeholder="Search by Name, Transaction Number, or Status"
            />
          </div>
          {filteredData && filteredData.length > 0 ? (
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
                {currentData &&
                  currentData.map((transaksi: any, index) => (
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
              <Pagination
                totalItems={filteredData?.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </table>
          ) : (
            <div className="text-center text-gray-500 mt-4">
              {filteredData === undefined
                ? "Loading..."
                : "No matching data found. Please adjust your filters or search criteria."}
            </div>
          )}
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
        </TableNotButton>
      </Sidebar>
    </>
  );
}
