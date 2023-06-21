import Image from "next/image";
import { quote_interface, user_interface } from "../page";

interface QuoteProps {
  quote: quote_interface;
  user: user_interface;
  deleteQuote: (id: string) => void;
}

export default function Quote({ quote, user, deleteQuote }: QuoteProps) {
  return (
    <div className="card bg-base-100 shadow-xl max-w-md w-full h-min m-2 p-2 ">
      <div className="flex flex-row w-full h-min py-2">
        <div className="flex items-center">
          <Image
            src={quote.pfp}
            alt="profile"
            width={50}
            height={50}
            className="rounded"
          />
        </div>
        <div className="flex flex-col ml-6 w-full">
          <div className="flex flex-row justify-between w-full mb-6">
            <p>{quote.name}</p>
            <div className="flex flex-row">
              {user.uid === quote.uid ? (
                <button className="mr-2" onClick={() => deleteQuote(quote.id)}>
                  <Image src="/trash.svg" alt="trash" width={22} height={22} />
                </button>
              ) : null}
              <p>{quote.date}</p>
            </div>
          </div>
          <p>"{quote.quote}"</p>
        </div>
      </div>
    </div>
  );
}
