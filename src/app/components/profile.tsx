import { useState } from "react";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config";
import { user_interface } from "../page";

interface ProfileProps {
  user: user_interface;
  setUser: any;
}

export default function Profile({ user, setUser }: ProfileProps) {
  const [name, setName] = useState("");

  const updateUser = async () => {
    if (name !== "") {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        name: name,
      });
      setUser({ name: name, uid: user.uid });
    }
  };

  return (
    <>
      <button
        onClick={() => {
          (window as any).profile.showModal();
          setName(user.name);
        }}
      >
        <Image src="/profile.svg" alt="profile" width={22} height={22} />
      </button>
      <dialog id="profile" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <p className="pt-6 pb-2">Name</p>
          <input
            id="name"
            type="text"
            placeholder="name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateUser();
              }
            }}
          />
          <button
            className="btn btn-full w-full my-2 capitalize"
            onClick={() => {
              updateUser();
            }}
          >
            SAVE CHANGES
          </button>
        </form>
      </dialog>
    </>
  );
}
