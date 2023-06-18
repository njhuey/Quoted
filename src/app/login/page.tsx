"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Home() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email Required"),
      password: Yup.string()
        .max(20, "Must be 20 characters or less")
        .min(8, "Must be 8 characters or more")
        .required("Password Required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="flex flex-grow w-full justify-center items-center py-8">
      <div className="card bg-base-100 shadow-xl max-w-md w-full h-min p-4">
        <div className="flex w-full justify-center mb-4 h-full">
          <h2 className="text-2xl font-bold">Log In</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
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
            LOGIN
          </button>
        </form>
        <div>
          or
          <Link href="/signup" className="ml-1 link link-hover font-bold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
