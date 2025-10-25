import Image from "next/image";
import MainPage from "../components/mainPage";
import { Main } from "next/document";

export default function Home() {

  return (
    <>  
      <div className="flex min-h-screen items-center justify-center font-sans bg-black">
        <MainPage />
      </div>
    </>
  );
}
