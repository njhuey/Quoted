"use client";
import { auth, db } from "../config";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const print_user = () => {
    console.log(auth.currentUser);
  };
  return (
    <>
      <button onClick={print_user}>Click me</button>
    </>
  );
}
