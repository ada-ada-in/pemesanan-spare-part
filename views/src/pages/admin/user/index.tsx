import React from "react";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Link from "next/link";
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
import Pagination from "@/components/Pagination";

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

  if (role !== "admin") {
    return {
      redirect: {
        destination: "/wrong-role",
        permanent: false,
      },
    };
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUser] = await Promise.all([getData(token, `${backendUrl}/user`)]);
  return {
    props: {
      token,
      data: dataUser.data,
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
  const [id, setId] = React.useState();
  const [name, setName] = React.useState();
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
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Set end date hingga akhir hari
        end.setHours(23, 59, 59, 999);

        filtered = filtered.filter((transaksi) => {
          const transactionDate = new Date(transaksi.createdAt);
          return transactionDate >= start && transactionDate <= end;
        });
      }

      if (searchTerm) {
        filtered = filtered.filter((callback) => {
          const { email, name } = callback;
          return (
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }
      setFilteredData(filtered.length > 0 ? filtered : null);
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
    return null;
  }

  if (!isClient) {
    return null;
  }

  console.log(data);

  async function handlerDeleteModal(e: any, id: any) {
    e.preventDefault();
    setOpen(true);
    setId(id);
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
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
          router.push("/admin/user");
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
          title="Pengguna"
          description="Management data pengguna pada Yamaha Sabang Raya
        Motor Handil."
          link="/admin/user/add"
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
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    hidden
                  >
                    ID pengguna
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
                    Nama Pengguna
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Alamat
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    No. Handphone
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
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
                {currentData &&
                  currentData.map((user: any, number) => (
                    <tr key={user.id}>
                      <td
                        className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500"
                        hidden
                      >
                        {user.id}
                      </td>
                      <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                        {number + 1}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.alamat}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.no_hp}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.role}
                      </td>
                      <td className="min-w-max relative whitespace-nowrap py-4 text-sm font-medium sm:pr-6 flex gap-4">
                        <Link
                          href={`/admin/user/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, kota name</span>
                        </Link>
                        <button
                          className="text-rose-600"
                          onClick={() => {
                            setOpen(true), setId(user.id), setName(user.name);
                          }}
                        >
                          Hapus
                        </button>
                        <Dialog
                          className="relative z-50"
                          open={open}
                          onClose={setOpen}
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
                                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon
                                      className="h-6 w-6 text-red-600"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle
                                      as="h3"
                                      className="text-base font-semibold leading-6 text-gray-900"
                                    >
                                      Yakin ingin menghapus pengguna dengan nama{" "}
                                      {`${name}`}
                                    </DialogTitle>
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500">
                                        Menghapus data membuat data pengguna
                                        yang sudah tersimpan sebelumnya
                                        menghilang dan tidak bisa dikembalian
                                        seperti sebelumnya!
                                      </p>
                                    </div>
                                    <div className="mt-3 space-x-3">
                                      <button
                                        className="bg-rose-600 py-2 px-3 text-white rounded-md"
                                        onClick={(e) => {
                                          handlerDeleteModal(e, id);
                                          setOpen(false);
                                        }}
                                      >
                                        Hapus
                                      </button>
                                      <button
                                        className="bg-cyan-600 py-2 px-3 text-white rounded-md"
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
        </Table>
      </Sidebar>
    </>
  );
}
