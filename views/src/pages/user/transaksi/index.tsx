import React from "react";
import UserSidebar from "@/components/UserSidebar";
import Table from "@/components/Table";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { getData } from "@/libs/handlerData";
import { GetRole } from "@/libs/manageRole";
import ReactPaginate from "react-paginate";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin)
    return {
      redirect: {
        destination: "/login",
      },
    };
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
    getData(token, `${backendUrl}/userorder`),
  ]);
  return {
    props: {
      token,
      data: dataTransaksi.data || [],
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
  const [id, setId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(0); // Halaman aktif
  const [isClient, setIsClient] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  if (!isClient) {
    return null;
  }

  const itemsPerPage = 8;

  const pageCount = data ? Math.ceil(data.length / itemsPerPage) : 0;
  const currentData = data
    ? data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : [];
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  async function handleDeleteTransaction(
    e: React.MouseEvent,
    transactionId: any
  ) {
    e.preventDefault();
    setOpen(true);
    setId(transactionId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.status.code === 200) {
        toast.success(result.status.message);
        // setTimeout(() => {
        window.location.replace("/user/transaksi");
        // router.push('/user/transaksi')
        // }, 0);
      } else {
        toast.error(result.status.message);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  return (
    <>
      <UserSidebar profile={profile}>
        <Table
          title="Transaksi"
          description="Management data transaksi pada Yamaha Sabang Raya Motor Handil."
          link="/user/transaksi/add"
          data={data}
        >
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  No
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
              {Array.isArray(currentData) && currentData.length > 0 ? (
                currentData.map((transaksi: any, index: number) => (
                  <tr key={transaksi.id}>
                    <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.transaksi_number || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(transaksi.price_total || 0)}
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
                            : transaksi.isPaid === "lunas"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        } text-white p-3`}
                      >
                        {transaksi.isPaid === "belum-bayar"
                          ? "Belum Bayar"
                          : transaksi.isPaid === "diproses"
                          ? "Diproses"
                          : transaksi.isPaid === "bayar-sebagian"
                          ? "Bayar Sebagian"
                          : transaksi.isPaid === "lunas"
                          ? "Lunas"
                          : "Status Tidak Tersedia"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`${
                          transaksi.isStatus === "bayar-telebih-dahulu"
                            ? "bg-red-700"
                            : transaksi.isStatus === "inden"
                            ? "bg-orange-500"
                            : transaksi.isStatus === "sudah-datang"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        } text-white p-3`}
                      >
                        {transaksi.isStatus === "bayar-telebih-dahulu"
                          ? "Bayar Terlebih Dahulu"
                          : transaksi.isStatus === "inden"
                          ? "Inden"
                          : transaksi.isStatus === "sudah-datang"
                          ? "Sudah Datang"
                          : "Status Tidak Tersedia"}
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
                      {transaksi.createdAt || "Tanggal Tidak Tersedia"}
                    </td>
                    <td className="min-w-max relative whitespace-nowrap py-4 text-sm font-medium sm:pr-6 flex gap-4">
                      <Link
                        href={`/user/transaksi/${transaksi.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Detail
                      </Link>
                      <a
                        className="text-rose-600 hover:text-rose-900 cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        Hapus
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>

            <ReactPaginate
              className="flex items-center justify-center gap-2 fonts-semibold text-white py-2 bg-blue-700	"
              breakLabel={"..."}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
            />
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
          {/* Modal for delete data */}
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
                        <Button
                          className="bg-rose-600 py-2 px-3 text-white rounded-md hover:bg-rose-900 hover:duration-100"
                          onClick={(e) => {
                            handleDeleteTransaction(e, id);
                            setOpen(false);
                          }}
                        >
                          Delete
                        </Button>
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
        </Table>
      </UserSidebar>
    </>
  );
}
