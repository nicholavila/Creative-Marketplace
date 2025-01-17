"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSave, FaUpload } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { updateProduct } from "@/actions/product/update-product";
import { BucketType } from "@/actions/s3/upload-file";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { GradientButton } from "@/components/utils/gradient-button";
import { axiosClient, axiosConfig } from "@/lib/axios";
import { NewProductSchema } from "@/schemas/product";
import {
  FileOrCreativeFile,
  FileOrString
} from "@/shared/types/file-preview-types";
import { userAtom } from "@/store/user";

import { FormError } from "../../utils/form-error";
import { FormSuccess } from "../../utils/form-success";

import { DetailsCard } from "./details-card";
import { FilesCard } from "./files-card";
import { PreviewCard } from "./preview-card";

import type { Product, ProductState } from "@/shared/types/product.type";

type Props = {
  product: Product;
  setProduct: Dispatch<SetStateAction<Product | undefined>>;
};

export const ProductEditForm = ({ product, setProduct }: Props) => {
  const [user] = useAtom(userAtom);

  const [isPending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [previewFiles, setPreviewFiles] = useState<FileOrString[]>([]);
  const [creativeFiles, setCreativeFiles] = useState<FileOrCreativeFile[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const isResubmitted = useMemo(() => {
    return !!product.approval.history.find(
      (item) => item.state === "submitted"
    );
  }, [product]);

  const form = useForm<z.infer<typeof NewProductSchema>>({
    resolver: zodResolver(NewProductSchema),
    defaultValues: {
      productType: product.productType,
      title: product.title,
      description: product.description,
      price: product.price
    }
  });

  useEffect(() => {
    setSelectedKeywords(product.keywords);
    setCreativeFiles(product.fileList);
    setPreviewFiles(product.previewList);
  }, [product]);

  const getPathList = async (
    fileList: FileOrString[] | FileOrCreativeFile[],
    bucket: BucketType
  ) => {
    const formData = new FormData();
    formData.append("username", user?.username as string);
    formData.append("bucketType", bucket);
    fileList.forEach((file) => {
      if (file instanceof File) formData.append(uuidv4(), file);
    });

    try {
      const response = await axiosClient.post(
        "/multi-upload",
        formData,
        axiosConfig
      );
      return response.data.pathList;
    } catch (error) {
      return [];
    }
  };

  const submitProduct = async (action: ProductState) => {
    const [_pathList, _previewList] = await Promise.all([
      getPathList(creativeFiles, "DOWNLOAD"),
      getPathList(previewFiles, "LISTING")
    ]);

    const _creativeFiles = creativeFiles.filter((item) => item instanceof File);
    const _fileList = _pathList.map((path: string, index: number) => ({
      name: _creativeFiles[index].name,
      path
    }));

    const fileList = [
      ...creativeFiles.filter((item) => !(item instanceof File)),
      ..._fileList
    ];
    const previewList = [
      ...previewFiles.filter((item) => !(item instanceof File)),
      ..._previewList
    ];

    if (previewList.length === 0 || fileList.length === 0) {
      throw new Error("Failed to upload images.");
    }

    const updatedProduct = {
      productType: form.getValues("productType"),
      productId: product.productId,
      ownerId: user?.userId as string,
      title: form.getValues("title"),
      description: form.getValues("description"),
      price: form.getValues("price"),
      fileList,
      previewList,
      keywords: selectedKeywords,
      approval: {
        state: action,
        history: [
          ...product.approval.history,
          {
            state: action,
            comment: form.getValues("submitComment"),
            userId: user?.userId as string,
            time: new Date().toISOString()
          }
        ]
      }
    } as Product;
    updateProduct(updatedProduct).then((res) => {
      const successMessage = `Product ${action} successfully`;
      setSuccess(res.success ? successMessage : "");
      setError(res.error || "");

      if (res.success) {
        setProduct(updatedProduct);
      }
      setPending(false);
    });
  };

  const onSubmit = (action: ProductState) => {
    if (creativeFiles.length === 0 || previewFiles.length === 0) {
      setSuccess("");
      setError("creative files and one preview images can't be empty!");
      return;
    }
    setSuccess("");
    setError("");
    setPending(true);

    submitProduct(action);
  };

  return (
    <Card className="w-full p-6 flex flex-col items-end gap-y-4 rounded-3xl">
      <div className="flex gap-x-6 items-end">
        <GradientButton
          disabled={isPending}
          variant={"outline"}
          className="w-64 gap-x-4"
          onClick={form.handleSubmit(() => onSubmit("updated"))}
        >
          <FaSave />
          Update Product
        </GradientButton>

        <GradientButton
          disabled={isPending}
          className="w-64 gap-x-4"
          onClick={form.handleSubmit(() =>
            onSubmit(isResubmitted ? "resubmitted" : "submitted")
          )}
        >
          <FaUpload />
          {isResubmitted ? "Resubmit" : "Submit"}
        </GradientButton>
      </div>

      {success || error ? (
        <div className="w-full">
          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
      ) : null}

      <Separator orientation="horizontal" />

      <div className="w-full h-full flex gap-x-8">
        <div className="w-1/2 flex flex-col gap-y-8">
          <FilesCard
            isPending={isPending}
            creativeFiles={creativeFiles}
            setCreativeFiles={setCreativeFiles}
          />
          <PreviewCard
            isPending={isPending}
            previewFiles={previewFiles}
            setPreviewFiles={setPreviewFiles}
          />
        </div>
        <div className="w-1/2 flex">
          <DetailsCard
            isPending={isPending}
            isUpdating={true}
            form={form}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
          />
        </div>
      </div>
    </Card>
  );
};
