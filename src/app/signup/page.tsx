"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config";
import { setDoc, doc } from "firebase/firestore";

export default function Signup() {
  const router = useRouter();

  const [userError, setUserError] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("First Name Required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email Required"),
      password: Yup.string()
        .max(20, "Must be 20 characters or less")
        .min(6, "Must be 6 characters or more")
        .required("Password Required"),
    }),
    onSubmit: ({ name, email, password }) => {
      // create user
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const docRef = doc(db, "users", user.uid);
          // add some user data to firestore
          setDoc(docRef, {
            name: name,
          })
            .then((docRef) => {
              router.push("/");
            })
            .catch((error) => {
              console.log("error adding user to firestore");
            });
        })
        .catch((error) => {
          setUserError(true);
          console.log(error);
        });
    },
  });

  return (
    <div className="flex flex-grow w-full justify-center items-center py-8">
      <div className="card bg-base-100 shadow-xl max-w-md w-full h-min p-4">
        <div className="flex w-full justify-center mb-4 h-full">
          <h2 className="text-2xl font-bold">Sign Up</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <h1 className="my-1">Name</h1>
          <input
            id="name"
            type="text"
            placeholder="name"
            className={`input input-bordered ${
              formik.touched.name && formik.errors.name ? "input-error" : ""
            } w-full mb-1`}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-600">{formik.errors.name}</div>
          ) : null}
          <div className="mb-4" />
          <h1 className="my-1">Email</h1>
          <input
            id="email"
            type="text"
            placeholder="email"
            className={`input input-bordered ${
              formik.touched.email && formik.errors.email ? "input-error" : ""
            } w-full mb-1`}
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-600">{formik.errors.email}</div>
          ) : null}
          <div className="mb-4" />
          <h1 className="my-1">Password</h1>
          <input
            id="password"
            type="password"
            placeholder="password"
            className={`input input-bordered ${
              formik.touched.password && formik.errors.password
                ? "input-error"
                : ""
            } w-full mb-1`}
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-600">{formik.errors.password}</div>
          ) : null}
          <div className="mb-2" />
          <button className="btn btn-full w-full my-2 capitalize" type="submit">
            SIGN UP
          </button>
        </form>
        {userError ? (
          <div className="text-red-600">Invalid email or password</div>
        ) : null}
        <div className="mb-2" />
        <div>
          or
          <Link href="/login" className="ml-1 link link-hover font-bold">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
