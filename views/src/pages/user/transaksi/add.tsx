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

  const [dataMotor, setDataMotor] = React.useState<any[]>([]);
  const [dataSparePart, setDataSparePart] = React.useState<any[]>([]);
  const [idMotor, setIdMotor] = React.useState<string | undefined>();
  const [idSparepart, setIdSparePart] = React.useState<string | undefined>();
  const [harga, setHarga] = React.useState<{ price?: number }>({});

  // State to hold the cart items
  const [cart, setCart] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any>({
    spareParts: [],
  });

  const handlerSubmit = async (e: any) => {
    e.preventDefault();

    // Add the current item to the cart
    const newCartItem = {
      id_sparepart: idSparepart,
      qty: catchData.qty,
    };

    setCart((prevCart) => {
      const updatedCart = [...prevCart, newCartItem];

      // Update the data state with the new cart
      setData({
        spareParts: updatedCart.map((item) => ({
          id_sparepart: item.id_sparepart,
          qty: parseInt(item.qty),
        })),
      });

      return updatedCart;
    });
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
        router.push("/user/transaksi");
      }, 1500);
    }
  }

  // Calculate total quantity and price
  const totalQty = cart.reduce((acc, item) => acc + parseInt(item.qty || 0), 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + (harga.price || 0) * item.qty,
    0
  );

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
            href={"/user/transaksi"}
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
                  required
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
                  required
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
                  type="text"
                  name="price"
                  id="price"
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(harga?.price || 0)}
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
                Qty
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="number"
                  name="qty"
                  id="qty"
                  required
                  onChange={handleChange}
                  value={catchData.qty}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="py-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded"
              >
                Tambahkan ke Keranjang
              </button>
            </div>
          </form>
        </div>

        {/* Cart Summary */}
        <div className="w-1/3">
          <h3 className="text-lg font-medium">Keranjang</h3>
          <ul className="mt-4 space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {dataSparePart.find((s) => s.id === item.id_sparepart)
                    ?.sparepart_name || "Spare Part"}{" "}
                  - Qty: {item.qty}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p>Total Qty: {totalQty}</p>
            <p>Total Price: Rp {totalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded"
          >
            Buat Pesanan
          </button>
        </div>
      </div>
    </UserSidebar>
  );
}
