import React from "react";
import Sidebar from "@/components/Sidebar";
import { guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { Guard } from "@/libs/middleware";
import { getData } from "@/libs/handlerData";
import { GetRole } from "@/libs/manageRole";
import { redirect } from "next/dist/server/api-utils";

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

  if (role !== "admin") {
    return {
      redirect: {
        destination: "/wrong-role",
        permanent: false,
      },
    };
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUser, dataMotor, dataSparePart] = await Promise.all([
    getData(token, `${backendUrl}/countuser`),
    getData(token, `${backendUrl}/countmotor`),
    getData(token, `${backendUrl}/countsparepart`),
  ]);

  return {
    props: {
      token,
      dataUser: dataUser?.data,
      dataMotor: dataMotor?.data,
      dataSparePart: dataSparePart?.data,
    },
  };
}

export default function Index({
  dataUser,
  dataMotor,
  dataSparePart,
}: {
  dataUser: any[] | null;
  dataMotor: any[] | null;
  dataSparePart: any[] | null;
}) {
  return (
    <Sidebar>
      <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
        <div className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500">
          <div className="w-full flex flex-col gap-2">
            <p className="block text-3xl font-normal text-gray-900 my-auto">
              Total user
            </p>
            <p className="font-medium text-5xl text-center w-full text-gray-900">
              {dataUser}
            </p>
          </div>
        </div>
        <div className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500">
          <div className="w-full flex flex-col gap-2">
            <p className="block text-3xl font-normal text-gray-900 my-auto">
              Total Motor
            </p>
            <p className="font-medium text-5xl text-center w-full text-gray-900">
              {dataMotor}
            </p>
          </div>
        </div>
        <div className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500">
          <div className="w-full flex flex-col gap-2">
            <p className="block text-3xl font-normal text-gray-900 my-auto">
              Total Spare Part
            </p>
            <p className="font-medium text-5xl text-center w-full text-gray-900">
              {dataSparePart}
            </p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
