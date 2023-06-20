"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import Quote from "./components/quote";
import AddQuote from "./components/addQuote";
import Profile from "./components/profile";

export interface quote_interface {
  name: string;
  date: string;
  quote: string;
}

export interface user_interface {
  name: string;
  uid: string;
}

export default function Quotes() {
  const [quotesList, setQuotesList] = useState<quote_interface[]>([]);
  const [user, setUser] = useState<user_interface>({ name: "", uid: "" });

  const router = useRouter();

  useEffect(() => {
    // check if user is logged in
    if (!auth.currentUser) {
      router.push("/login");
    }

    // fetch user data from firebase
    const fetchUser = async () => {
      const uid = auth.currentUser?.uid || "";
      const docRef = doc(db, "users", uid);
      const userSnap = await getDoc(docRef);

      setUser({ name: userSnap.get("name") || "", uid: uid || "" });
    };
    fetchUser();

    // fetch quotes from firebase
    fetchQuotes();
  }, []);

  useEffect(() => {
    setQuotesList([]);
    fetchQuotes();
  }, [user]);

  const fetchQuotes = async () => {
    //fetch quotes from firebase and loads into quotesList
    const quoteQuery = await query(
      collection(db, "quotes"),
      orderBy("date", "desc")
    );
    const quoteSnapshot = await getDocs(quoteQuery);
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
        <Profile user={user} setUser={setUser} />
        <AddQuote
          user={user}
          quotesList={quotesList}
          setQuotesList={setQuotesList}
        />
      </div>
      {quotesList.map((quote) => (
        <Quote quote={quote.quote} name={quote.name} date={quote.date} />
      ))}
    </>
  );
}
