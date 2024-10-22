import React from "react";
import UserSidebar from "@/components/UserSidebar";
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
  const [catchData, setCatchData] = React.useState<any>({
    qty: "",
    id_motor: "",
    id_sparepart: "",
  });
  console.log("losss" + catchData);

  const [dataMotor, setDataMotor] = React.useState<any[]>([]);
  const [dataSparePart, setDataSparePart] = React.useState<any[]>([]);
  const [idMotor, setIdMotor] = React.useState<string | undefined>();
  const [idSparepart, setIdSparePart] = React.useState<string | undefined>();
  const [harga, setHarga] = React.useState<{ price?: number }>({});

  // State to hold the cart items
  const [cart, setCart] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any>({
    spareParts: [cart],
  });
  console.log(data);

  const handlerSubmit = async (e: any) => {
    e.preventDefault();

    // Add the current item to the cart
    setCart((prevCart) => [
      ...prevCart,
      {
        motor_name: dataMotor.find((motor) => motor.id === idMotor)?.motor_name,
        sparepart_name: dataSparePart.find((spare) => spare.id === idSparepart)
          ?.sparepart_name,
        qty: catchData.qty,
        price: harga?.price || 0,
      },
    ]);
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

  React.useEffect(() => {
    if (idMotor) {
      const fetchSparePartMotor = async () => {
        const response = await getData(
          token,
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/motor/${idMotor}/sparepart`
        );
        setDataSparePart(response.data || []);
      };
      fetchSparePartMotor();
    }
  }, [token, idMotor]);

  React.useEffect(() => {
    if (idSparepart) {
      const fetchHarga = async () => {
        const response = await getData(
          token,
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/harga/${idSparepart}/sparepart`
        );
        setHarga(response.data);
      };
      fetchHarga();
    }
  }, [token, idSparepart]);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setCatchData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "id_motor") {
      setIdMotor(value);
    }
    if (name === "id_sparepart") {
      setIdSparePart(value);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const response = await postData(
      e,
      token,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
      data
    );
    if (response) {
      setTimeout(() => {
        router.push("/user/transaksi/add");
      });
    }
  }

  // Calculate total quantity and price
  const totalQty = cart.reduce((acc, item) => acc + parseInt(item.qty || 0), 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <UserSidebar profile={profile}>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Tambah Data Pemesanan
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={"/admin/motor"}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Kembali
          </Link>
        </div>
      </div>

      <div className="mt-10 flex space-x-8">
        <div className="w-2/3">
          <form onSubmit={handlerSubmit}>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
              <label
                htmlFor="id_motor"
                className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
              >
                Tipe Motor
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <select
                  name="id_motor"
                  id="id_motor"
                  value={catchData.id_motor}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>
                    Pilih Motor
                  </option>
                  {dataMotor.map((motor) => (
                    <option key={motor.id} value={motor.id}>
                      {motor.motor_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
              <label
                htmlFor="sparepart"
                className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
              >
                Spare Part
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <select
                  name="id_sparepart"
                  id="sparepart"
                  onChange={handleChange}
                  value={catchData.id_sparepart}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>
                    Pilih Spare Part
                  </option>
                  {dataSparePart.map((spare) => (
                    <option key={spare.id} value={spare.id}>
                      {spare.sparepart_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
              <label
                htmlFor="harga"
                className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
              >
                Harga
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={harga?.price || ""}
                  readOnly
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
              <label
                htmlFor="qty"
                className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
              >
                Quantity
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="number"
                  name="qty"
                  id="qty"
                  required
                  value={catchData.qty}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:flex sm:items-center">
              <button
                type="submit"
                className="mt-4 w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto"
              >
                Masukan Keranjang
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/3 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Cart</h2>
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between border-b pb-2">
                <span>{item.sparepart_name}</span>
                <span>
                  {item.qty} x Rp{item.price}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <p className="font-semibold">Total Quantity: {totalQty}</p>
            <p className="font-semibold">Total Price: Rp{totalPrice}</p>
          </div>
          <div className="sm:flex sm:items-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-4 w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto"
            >
              Pesan
            </button>
          </div>
        </div>
      </div>
    </UserSidebar>
  );
}
