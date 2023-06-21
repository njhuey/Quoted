import { useState } from "react";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../config";
import { ref, uploadBytes } from "firebase/storage";
import { user_interface } from "../page";

interface ProfileProps {
  user: user_interface;
  setUser: (user: user_interface) => void;
}

export default function Profile({ user, setUser }: ProfileProps) {
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<null | File>(null);

  const updateUser = async () => {
    if (name !== "") {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        name: name,
      });
      setUser({ name: name, uid: user.uid });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    const pfpRef = ref(storage, user.uid);
    if (selectedFile !== null) {
      uploadBytes(pfpRef, selectedFile)
        .then((snapshot) => {
          console.log("Uploaded pfp");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setSelectedFile(null);
    updateUser();
  };

  return (
    <>
      <button
        onClick={() => {
          (window as any).profile.showModal();
          setName(user.name);
          setSelectedFile(null);
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
            UPDATE DISPLAY NAME
          </button>
          <p className="pt-6 pb-2">Profile Picture</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex w-full mb-2"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="btn btn-full w-full"
          >
            Upload
          </button>
        </form>
      </dialog>
    </>
  );
}
