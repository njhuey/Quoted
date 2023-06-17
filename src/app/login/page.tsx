"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-grow w-full justify-center align-middle pb-8 pt-16">
      <div className="card bg-base-100 shadow-xl max-w-md w-full h-min p-4">
        <div className="flex w-full justify-center mb-4 h-full">
          <h2 className="text-2xl font-bold">Log In</h2>
        </div>
        <h1 className="my-2">Email</h1>
        <input
          type="text"
          placeholder="email"
          className="input input-bordered w-full mb-6"
        />
        <h1 className="my-2">Password</h1>
        <input
          type="password"
          placeholder="password"
          className="input input-bordered w-full mb-2"
        />
        <button
          className="btn btn-full my-2"
          onClick={() => console.log("hello world")}
        >
          login
        </button>
        <div>
          or
          <Link href="/signup" className="ml-1 link link-hover font-bold ">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
