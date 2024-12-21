import React from "react";
import Sidebar from "@/components/Sidebar";
import TableNotButton from "@/components/TableNotButton";
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
  const [proses] = await Promise.all([getData(token, `${backendUrl}/proses`)]);
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
  data: any[] | undefined;
  profile: any[] | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [id, setId] = React.useState(null);
  const [isClient, setIsClient] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0); // Halaman aktif
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);

  React.useEffect(() => {
    if (data) {
      let filtered = data;

      if (startDate && endDate) {
        filtered = filtered.filter((callback) => {
          const transactionDate = new Date(callback.createdAt);
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
      setFilteredData(filtered.length > 0 ? filtered : undefined);
    }
  }, [startDate, endDate, searchTerm, data]);

  const itemsPerPage = 8;
  const currentData =
    filteredData?.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ) || [];

  React.useEffect(() => {
    setIsClient(true);
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // Return nothing or a loading spinner
  }

  if (!isClient) {
    return null; // or a loading spinner
  }

  async function handlerDeleteModal(e: any) {
    e.preventDefault();
    setOpen(true);

    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${id}`,
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
        // toast.success(response.status.message);
        // setTimeout(() => {
        // router.push("/admin/motor");
        window.location.replace("/admin/diproses");
        // }, 500);
      } else {
        toast.error(response.status.message);
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  console.log(id);
  return (
    <>
      <Sidebar profile={profile}>
        <TableNotButton
          title="Proses"
          description="Management data Proses pada Yamaha Sabang Raya Motor Handil."
          link="/admin/diproses/add"
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
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(transaksi.price_total || 0)}{" "}
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
                            : transaksi.isPaid === "sudah-datang"
                            ? "Sudah Sampai"
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
                            : "Lunas"}
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
                        <a
                          className="text-rose-600 hover:text-rose-900 cursor-pointer"
                          onClick={() => {
                            setOpen(true);
                            setId(transaksi.id);
                          }}
                        >
                          Hapus
                        </a>
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
          {/* Modal for Image */}
          <Dialog
            className="relative z-50"
            open={openImage}
            onClose={() => {
              setOpenImage(false);
            }}
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
          <Dialog
            className="relative z-50"
            open={open}
            onClose={() => setOpen(false)}
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
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Yakin ingin menghapus data{" "}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Menghapus data membuat data yang sudah tersimpan
                          sebelumnya menghilang <br /> dan tidak bisa
                          dikembalian seperti sebelumnya!
                        </p>
                      </div>

                      <div className="mt-3 space-x-3">
                        <button
                          className="bg-rose-600 py-2 px-3 text-white rounded-md hover:bg-rose-900 hover:duration-100"
                          onClick={(e) => {
                            handlerDeleteModal(e);
                            setOpen(false);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-cyan-600 py-2 px-3 text-white rounded-md hover:bg-cyan-900 hover:duration-100"
                          onClick={() => setOpen(false)}
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
