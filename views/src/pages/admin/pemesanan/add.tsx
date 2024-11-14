import React from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { GetRole } from "@/libs/manageRole";
import { postData, getData } from "@/libs/handlerData";
import Link from "next/link";

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
  return {
    props: {
      token,
    },
  };
}

export default function TambahMotor({
  token,
  profile,
}: {
  token: string;
  profile: any | null;
}) {
  const router = useRouter();

  const [data, setData] = React.useState({
    sparepart_name: "",
    price: "",
    id_motor: "",
  });

  const [dataMotor, setDataMotor] = React.useState<any[]>([]);

  const handlerSubmit = async (e: any) => {
    e.preventDefault();
    const response = await postData(
      e,
      token,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sparepart`,
      data
    );
    if (response) {
      setTimeout(() => {
        router.push("/admin/pemesanan/add");
      });
    }
  };

  React.useEffect(() => {
    const fetchMotorData = async () => {
      const response = await getData(
        token,
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/motor`
      );
      setDataMotor(response.data || []);
    };

    fetchMotorData();
  }, [token]);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  console.log(dataMotor);

  return (
    <Sidebar profile={profile}>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Tambah Spare Part
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={"/admin/pemesanan"}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Kembali
          </Link>
        </div>
      </div>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
        <form onSubmit={handlerSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama_kota"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama Spare Part
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="sparepart_name"
                id="sparepart_name"
                autoComplete="given-name"
                onChange={handleChange}
                value={data.sparepart_name}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama_kota"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Harga satuan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="number"
                name="price"
                id="price"
                autoComplete="given-name"
                onChange={handleChange}
                value={data.price}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama_kota"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Tipe Motor
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <select
                name="id_motor"
                id="id_motor"
                autoComplete="given-name"
                onChange={handleChange}
                value={data.id_motor}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="" disabled>
                  Pilih Motor
                </option>
                {dataMotor.length > 0 ? (
                  dataMotor.map((motor) => (
                    <option key={motor.id} value={motor.id}>
                      {motor.motor_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Tidak ada motor tersedia
                  </option>
                )}
              </select>
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <div className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"></div>
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
      </div>
    </Sidebar>
  );
}
