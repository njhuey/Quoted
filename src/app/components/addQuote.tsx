import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config";
import { user_interface, quote_interface } from "../page";

interface ProfileProps {
  user: user_interface;
  quotesList: quote_interface[];
  setQuotesList: any;
}

export default function AddQuote({
  user,
  quotesList,
  setQuotesList,
}: ProfileProps) {
  const [quote, setQuote] = useState("");

  const router = useRouter();

  const addQuote = async (quote: string) => {
    if (quote !== "") {
      addDoc(collection(db, "quotes"), {
        uid: user.uid,
        date: new Date(),
        quote: quote,
      });
      quotesList.push({
        name: user.name,
        date: new Date().toLocaleDateString(),
        quote: quote,
      });
      setQuotesList(quotesList);
      router.refresh();
    }
  };

  return (
    <>
      <button onClick={() => (window as any).add_quote.showModal()}>
        <Image
          className="mx-2"
          src="/plus.svg"
          alt="plus"
          width={30}
          height={30}
        />
      </button>
      <dialog id="add_quote" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg mb-4">Submit a Quote!</h3>
          <input
            id="name"
            type="text"
            className="input input-bordered w-full"
            value={quote}
            onChange={(e) => {
              setQuote(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addQuote(quote);
                setQuote("");
              }
            }}
          />
          <button
            className="btn btn-full w-full my-2 capitalize"
            onClick={(e) => {
              addQuote(quote);
              setQuote("");
            }}
          >
            SUBMIT
          </button>
        </form>
      </dialog>
    </>
  );
}
