"use client";

import React, { useEffect, useState } from "react";
import { keccak256, toHex } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function Product() {
  const [product, setProduct] = useState<{
    name: string;
    prodcutionDate: string;
    expiryDate: string;
    productHash: string;
    notes: string;
  }>({ expiryDate: "", name: "", notes: "", prodcutionDate: "", productHash: "" });

  const {
    data: registerData,
    error: registerError,
    isError: isRegisterError,
    isPending: isPendingRegister,
    writeContractAsync,
  } = useScaffoldWriteContract("OpenState");
  const { isLoading: isLoadingRegisterTxn, isSuccess: isRegisterTxnSuccess } = useWaitForTransactionReceipt({
    hash: registerData,
  });
  const isLoadingTxn = isPendingRegister || isLoadingRegisterTxn;

  const handleRegisterProduct = async () => {
    try {
      await writeContractAsync({
        functionName: "registerProduct",
        args: [
          product.name,
          BigInt(Date.parse(product.prodcutionDate) / 1000),
          BigInt(Date.parse(product.expiryDate) / 1000),
          keccak256(toHex(product.productHash)),
          product.notes,
        ],
      });
    } catch (error) {
      console.error("Error registering product: ");
      console.error(error);
    }
  };

  useEffect(() => {
    if (isRegisterTxnSuccess) {
      notification.success("Registered Product.");
      return;
    }
  }, [isRegisterTxnSuccess]);

  useEffect(() => {
    if (isRegisterError && registerError) {
      notification.error(registerError.message || "Something went wrong.");
      return;
    }
  }, [isRegisterError, registerError]);

  return (
    <>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-lg rounded-3xl">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              placeholder="Enter the name of your product"
              className="input input-bordered w-full max-w-xs"
              value={product.name}
              onChange={e => setProduct({ ...product, name: e.target.value })}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Production Date</span>
            </div>
            <input
              type="date"
              className="input input-bordered w-full max-w-xs"
              value={product.prodcutionDate}
              onChange={e => setProduct({ ...product, prodcutionDate: e.target.value })}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Expiry Date</span>
            </div>
            <input
              type="date"
              className="input input-bordered w-full max-w-xs"
              value={product.expiryDate}
              onChange={e => setProduct({ ...product, expiryDate: e.target.value })}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Expiry Date</span>
            </div>
            <input
              type="date"
              className="input input-bordered w-full max-w-xs"
              value={product.productHash}
              onChange={e => setProduct({ ...product, productHash: e.target.value })}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Notes</span>
            </div>
            <textarea
              className="textarea"
              value={product.notes}
              onChange={e => setProduct({ ...product, notes: e.target.value })}
            ></textarea>
          </label>
          <button className="btn btn-primary" onClick={handleRegisterProduct} disabled={isLoadingTxn}>
            {isLoadingTxn ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </>
  );
}
