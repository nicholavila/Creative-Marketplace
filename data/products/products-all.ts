"use server";

import { ScanCommand } from "@aws-sdk/lib-dynamodb";

import db from "@/lib/db";
import type { Product } from "@/shared/types/product.type";

const TableName = process.env.AWS_DYNAMODB_PRODUCTS_TABLE_NAME;

export const getAllProducts = async () => {
  const command = new ScanCommand({
    TableName
    // ProjectionExpression: "username" // attr names to get
    // ProjectionExpression: "email, emailVerified, #name",
    // ExpressionAttributeNames: { "#name": "name" }, // for reserved attr names
    // FilterExpression: "email = :email",
    // ExpressionAttributeValues: {
    // ":email": email
    // }
    // Limit: 1 // just number of scanned items, not result
  });

  try {
    const response = await db.send(command);
    return {
      items: response.Items as Product[]
    };
  } catch (error) {
    return {
      items: []
    };
  }
};
