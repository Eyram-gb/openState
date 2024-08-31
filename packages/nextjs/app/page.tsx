"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const [productId, setProductId] = useState("");
  const [checkAuthenticity, setCheckAuthenticity] = useState(false);
  const { address: connectedAddress } = useAccount();

  const {
    data: checkAuthenticityData,
    error: checkAuthenticityError,
    isError: isCheckAuthenticityError,
    isLoading: isCheckingAuthenticity,
    refetch: refetchCheckAuthenticity,
  } = useScaffoldReadContract({
    contractName: "OpenState",
    functionName: "checkAuthenticity",
    args: [checkAuthenticity ? productId : undefined],
  });

  console.log(checkAuthenticityData);

  useEffect(() => {
    if (isCheckAuthenticityError) {
      notification.error(checkAuthenticityError?.message || "Something went wrong");
    }
  }, [checkAuthenticityError?.message, isCheckAuthenticityError]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Open State</span>
          </h1>
          {/* <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div> */}
          <p className="text-center text-lg">Enter your product ID to get started.</p>
          <div className="flex flex-col gap-5 w-full">
            <input
              type="text"
              className="input input-bordered w-full max-w-md"
              value={productId}
              onChange={e => setProductId(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                if (checkAuthenticity) {
                  refetchCheckAuthenticity();
                } else {
                  setCheckAuthenticity(true);
                }
              }}
              disabled={isCheckingAuthenticity}
            >
              {isCheckingAuthenticity ? "Loading..." : "Check"}
            </button>
          </div>
          {checkAuthenticityData?.name && (
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-lg rounded-3x overflow-auto my-5l">
              <p>Name: {checkAuthenticityData.name}</p>
              <p>Production Date: {epochToDateString(Number(checkAuthenticityData.productionDate.toString()))}</p>
              <p>Expiry Date: {epochToDateString(Number(checkAuthenticityData.expiryDate.toString()))}</p>
              <p>Product Hash: {checkAuthenticityData.productHash}</p>
              <p>Notes: {checkAuthenticityData.notes}</p>
            </div>
          )}
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

function epochToDateString(epochTime: number) {
  const date = new Date(epochTime * 1000); // Multiply by 1000 to get milliseconds

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Pad month to 2 digits
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}