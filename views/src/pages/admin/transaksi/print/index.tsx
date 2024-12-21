import Image from "next/image";
export default function Print() {
  return (
    <>
      <section className="container mx-auto py-4">
        <div className="flex  place-content-center">
          <div>
            <Image
              src="/images/new-yamaha.png"
              width={150}
              height={80}
              alt="logo"
            />
          </div>
          <div className=" mx-12">
            <p className="font-medium">Yamaha Sabang Raya Motor Handil</p>
            <p>
              Jalan D.I. Panjaitan No. 77 RT. 26 Kebun Handil
              <br />
              Kec. Jelutung Jambi 36136
            </p>
            <p className="font-medium">Phone : +62 812-7359-0007</p>
            <p className="font-medium">Email : sabang.handil2022@gmail.com</p>
          </div>
          <div>
            <p className="font-medium">Nama : </p>
            <p>----------------------------------------------------</p>
            <p className="font-medium">Alamat : </p>
            <p>----------------------------------------------------</p>
          </div>
        </div>
      </section>
    </>
  );
}
