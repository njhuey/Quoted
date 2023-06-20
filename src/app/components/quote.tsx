import Image from "next/image";
import { quote_interface } from "../page";

export default function Quote({ quote, name, date, pfp }: quote_interface) {
  return (
    <div className="flex flex-row card bg-base-100 shadow-xl max-w-md w-full h-min p-4 m-2">
      <div className="flex items-center">
        <Image
          src={pfp}
          alt="profile"
          width={50}
          height={50}
          className="rounded"
        />
      </div>
      <div className="flex flex-col ml-6 w-full">
        <div className="flex flex-row justify-between w-full mb-4">
          <p>{name}</p>
          <p>{date}</p>
        </div>
        <p>"{quote}"</p>
      </div>
    </div>
  );
}
