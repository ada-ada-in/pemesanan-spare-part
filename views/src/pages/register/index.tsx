import { Inter } from "next/font/google";
import Register from "../register";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={inter.className}>
      <Register />
    </main>
  );
}
