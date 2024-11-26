import React from "react";
import UserSidebar from "@/components/UserSidebar";
import { guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { Guard } from "@/libs/middleware";
import { getData } from "@/libs/handlerData";
import { GetRole } from "@/libs/manageRole";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin)
    return {
      redirect: {
        destination: "/",
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
  const [
    dataPembayaran,
    dataPembayaranLunas,
    dataPembayaranSebagian,
    dataBelumBayar,
  ] = await Promise.all([
    getData(token, `${backendUrl}/userpembayaran`),
    getData(token, `${backendUrl}/userpembayaran/lunas`),
    getData(token, `${backendUrl}/userpembayaran/bayarsebagian`),
    getData(token, `${backendUrl}/userpembayaran/belumbayar`),
  ]);
  return {
    props: {
      token,
      dataPembayaran: dataPembayaran?.data,
      dataPembayaranLunas: dataPembayaranLunas?.data || [],
      dataPembayaranSebagian: dataPembayaranSebagian?.data || [],
      dataBelumBayar: dataBelumBayar?.data || [],
    },
  };
}

export default function Index({
  dataPembayaran,
  dataPembayaranLunas,
  dataPembayaranSebagian,
  dataBelumBayar,
  profile,
}: {
  dataPembayaran: any[] | null;
  dataPembayaranLunas: any[] | null;
  dataPembayaranSebagian: any[] | null;
  dataBelumBayar: any[] | null;
  profile: any | null;
}) {
  return (
    <UserSidebar profile={profile}>
      <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
        <div className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500">
          <div className="w-full flex flex-col gap-2">
            <p className="block text-2xl font-normal text-gray-900 my-auto">
              Total Pembayaran
            </p>
            <p className="font-medium text-5xl text-center w-full text-gray-900">
              {dataPembayaran || 0}
            </p>
          </div>
        </div>
        <div className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500">
          <div className="w-full flex flex-col gap-2">
            <p className="block text-2xl font-normal text-gray-900 my-auto">
              Lunas
            </p>
            <p className="font-medium text-5xl text-center w-full text-gray-900">
              {dataPembayaranLunas || 0}
            </p>
          </div>
        </div>
        <div className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500">
          <div className="w-full flex flex-col gap-2">
            <p className="block text-2xl font-normal text-gray-900 my-auto">
              Bayar Sebagian
            </p>
            <p className="font-medium text-5xl text-center w-full text-gray-900">
              {dataPembayaranSebagian || 0}
            </p>
          </div>
        </div>
        <div className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500">
          <div className="w-full flex flex-col gap-2">
            <p className="block text-2xl font-normal text-gray-900 my-auto">
              Belum Bayar
            </p>
            <p className="font-medium text-5xl text-center w-full text-gray-900">
              {dataBelumBayar || 0}
            </p>
          </div>
        </div>
      </div>
      <div className="my-12 font-bold">
        <p className="text-center my-6 text-2xl">
          Yamaha Sabang Raya Motor Handil
        </p>
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://www.openstreetmap.org/export/embed.html?bbox=103.586321%2C-1.629490%2C103.606321%2C-1.609490&layer=mapnik&marker=-1.619490%2C103.596321"
        ></iframe>
        <br />
        <a
          href="https://www.openstreetmap.org/way/982369064#map=18/-1.619490/103.596321"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Pergi Ke Lokasi
        </a>
      </div>
    </UserSidebar>
  );
}
