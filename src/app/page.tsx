"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, db } from "../config";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import Quote from "./components/quote";

interface quote_interface {
  name: string;
  date: string;
  quote: string;
}

export default function Quotes() {
  const [quotesList, setQuotesList] = useState<quote_interface[]>([]);

  const router = useRouter();

  useEffect(() => {
    // check if user is logged in
    if (!auth.currentUser) {
      router.push("/login");
    }

    const fetchQuotes = async () => {
      const quoteSnapshot = await getDocs(collection(db, "quotes"));
      const quotes: quote_interface[] = [];

      for (const data of quoteSnapshot.docs) {
        try {
          const docRef = doc(db, "users", data.get("uid"));
          const userSnap = await getDoc(docRef);

          quotes.push({
            name: userSnap.get("name"),
            date: data.get("date").toDate().toLocaleDateString(),
            quote: data.get("quote"),
          });
        } catch (error) {
          console.log("Error getting user:", error);
        }
      }

      setQuotesList(quotes);
    };

    fetchQuotes();
  }, []);

  if (quotesList.length === 0) {
    return (
      <div className="flex justify-center items-center h-80">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full max-w-md justify-end px-1">
        <button onClick={() => window.profile.showModal()}>
          <Image src="/profile.svg" alt="profile" width={22} height={22} />
        </button>
        <dialog id="profile" className="modal">
          <form method="dialog" className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click on ✕ button to close</p>
          </form>
        </dialog>

        <button onClick={() => window.add_quote.showModal()}>
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
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click on ✕ button to close</p>
          </form>
        </dialog>
      </div>
      {quotesList.map((quote) => (
        <Quote quote={quote.quote} name={quote.name} date={quote.date} />
      ))}
    </>
  );
}
