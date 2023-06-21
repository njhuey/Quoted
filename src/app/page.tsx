"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../config";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import Quote from "./components/quote";
import AddQuote from "./components/addQuote";
import Profile from "./components/profile";

export interface quote_interface {
  id: string;
  uid: string;
  name: string;
  date: string;
  quote: string;
  pfp: string;
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

    // fetch quotes from firestore
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
    const blankReference = ref(storage, "profile.png");
    const blankProfile = await getDownloadURL(blankReference);

    // get data needed to display quotes
    for (const data of quoteSnapshot.docs) {
      try {
        const docRef = doc(db, "users", data.get("uid"));
        const userSnap = await getDoc(docRef);
        const pfpReference = ref(storage, data.get("uid"));

        // get the correct profile picture
        let pfp: string;
        try {
          pfp = await getDownloadURL(pfpReference);
        } catch (error) {
          pfp = blankProfile;
        }

        quotes.push({
          id: data.id,
          uid: data.get("uid"),
          name: userSnap.get("name"),
          date: data.get("date").toDate().toLocaleDateString(),
          quote: data.get("quote"),
          pfp: pfp,
        });
      } catch (error) {
        console.log("Error getting user:", error);
      }
    }

    setQuotesList(quotes);
  };

  const deleteQuote = async (id: string) => {
    // delete quote from firestore
    await deleteDoc(doc(db, "quotes", id));

    // delete quote from quotesList
    const newQuotesList = quotesList.filter((quote) => quote.id !== id);
    setQuotesList(newQuotesList);
  };

  // if quotesList is empty, display loading spinner
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
        <Quote quote={quote} user={user} deleteQuote={deleteQuote} />
      ))}
    </>
  );
}
