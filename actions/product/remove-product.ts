"use server";

import { CreativeFile, Product } from "@/shared/types/product.type";
import { removeFileFromS3 } from "../s3/remove-file";
import { deleteProduct } from "@/data/product";
import { deleteProductFromCreator } from "../user/delete-product";
import { AWS_S3_BUCKETS } from "@/shared/constants/server.constant";

export const removeProduct = async (product: Product, userId: string) => {
  const { fileList, previewList } = product;

  fileList.map(async (file: CreativeFile) => {
    await removeFileFromS3(file.path, AWS_S3_BUCKETS.DOWNLOAD as string);
  });

  previewList.map(async (keyName: string) => {
    await removeFileFromS3(keyName, AWS_S3_BUCKETS.LISTING as string);
  });

  const res_del_from_creator = await deleteProductFromCreator(
    userId,
    product.productId
  );
  if (res_del_from_creator.error) {
    return { error: res_del_from_creator.error };
  }

  const res_del_from_table = await deleteProduct(product);
  if (res_del_from_table.error) {
    return { error: "Failed to remove from table" };
  }

  return {
    success: true
  };
};
