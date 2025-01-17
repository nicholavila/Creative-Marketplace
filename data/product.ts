"use server";

import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  type QueryCommandInput,
  ScanCommand,
  type ScanCommandInput,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

import db from "@/lib/db";
import { AWS_DYNAMO_TABLES } from "@/shared/constants/server.constant";

import type {
  Product,
  ProductEvent,
  ProductLink,
  ProductState
} from "@/shared/types/product.type";

type ProductUpdateState = {
  productType: string;
  productId: string;
  approval: { state: ProductState; history: ProductEvent[] };
};

export const getAllProducts = async (
  limit?: number,
  exclusiveStartKey?: ProductLink
) => {
  const scanCommandInput: ScanCommandInput = {
    TableName: AWS_DYNAMO_TABLES.PRODUCT
    // ProjectionExpression: "username" // attr names to get
    // ProjectionExpression: "email, emailVerified, #name",
    // ExpressionAttributeNames: { "#name": "name" }, // for reserved attr names
    // FilterExpression: "email = :email",
    // ExpressionAttributeValues: {
    // ":email": email
    // }
    // Limit: 1 // just number of scanned items, not result
  };

  if (exclusiveStartKey) {
    scanCommandInput.ExclusiveStartKey = {
      ...exclusiveStartKey
    };
  }

  if (limit) {
    scanCommandInput.Limit = limit;
  }

  const command = new ScanCommand(scanCommandInput);

  try {
    const response = await db.send(command);
    return {
      items: response.Items as Product[],
      lastEvaluatedKey: response.LastEvaluatedKey
    };
  } catch (error) {
    return {
      items: []
    };
  }
};

export const getSubmittedProducts = async (
  limit?: number,
  exclusiveStartKey?: ProductLink
) => {
  const scanCommandInput: ScanCommandInput = {
    TableName: AWS_DYNAMO_TABLES.PRODUCT,
    FilterExpression:
      "approval.#state = :submitted or approval.#state = :resubmitted",
    ExpressionAttributeNames: {
      "#state": "state"
    },
    ExpressionAttributeValues: {
      ":submitted": "submitted",
      ":resubmitted": "resubmitted"
    }
  };

  if (exclusiveStartKey) {
    scanCommandInput.ExclusiveStartKey = {
      ...exclusiveStartKey
    };
  }

  if (limit) {
    scanCommandInput.Limit = limit;
  }

  const command = new ScanCommand(scanCommandInput);

  try {
    const response = await db.send(command);
    return {
      items: response.Items as Product[],
      lastEvaluatedKey: response.LastEvaluatedKey
    };
  } catch (error) {
    return {
      items: []
    };
  }
};

export const getProductsByState = async (
  state: ProductState,
  limit?: number,
  exclusiveStartKey?: ProductLink
) => {
  const scanCommandInput: ScanCommandInput = {
    TableName: AWS_DYNAMO_TABLES.PRODUCT,
    FilterExpression: "approval.#state = :state",
    ExpressionAttributeNames: {
      "#state": "state"
    },
    ExpressionAttributeValues: {
      ":state": state
    }
  };

  if (exclusiveStartKey) {
    scanCommandInput.ExclusiveStartKey = {
      ...exclusiveStartKey
    };
  }

  if (limit) {
    scanCommandInput.Limit = limit;
  }

  const command = new ScanCommand(scanCommandInput);

  try {
    const response = await db.send(command);
    return {
      items: response.Items as Product[],
      lastEvaluatedKey: response.LastEvaluatedKey
    };
  } catch (error) {
    return {
      items: []
    };
  }
};

export const getProductsByType = async (
  productType: string,
  limit: number,
  exclusiveStartKey?: ProductLink
) => {
  const queryCommand: QueryCommandInput = {
    TableName: AWS_DYNAMO_TABLES.PRODUCT,
    KeyConditionExpression: "productType = :productType",
    ExpressionAttributeValues: {
      ":productType": productType
    },
    Limit: limit
  };

  if (exclusiveStartKey) {
    queryCommand.ExclusiveStartKey = exclusiveStartKey;
  }

  const command = new QueryCommand(queryCommand);

  try {
    const response = await db.send(command);
    return {
      items: response.Items,
      lastEvaluatedKey: response.LastEvaluatedKey
    };
  } catch (error) {
    return {
      items: []
    };
  }
};

export const getProductsCountByType = async (productType: string) => {
  const queryCommand: QueryCommandInput = {
    TableName: AWS_DYNAMO_TABLES.PRODUCT,
    KeyConditionExpression: "productType = :productType",
    ExpressionAttributeValues: {
      ":productType": productType
    },
    Select: "COUNT"
  };

  const command = new QueryCommand(queryCommand);

  try {
    const response = await db.send(command);
    return {
      success: true,
      cnt: response.Count
    };
  } catch (error) {
    return {
      error
    };
  }
};

export const getProductById = async (
  productType: string,
  productId: string
) => {
  const command = new GetCommand({
    TableName: AWS_DYNAMO_TABLES.PRODUCT,
    Key: {
      productType,
      productId
    }
  });

  try {
    const response = await db.send(command);
    return response.Item as Product;
  } catch (error) {
    return undefined;
  }
};

export const createProduct = async (data: Product) => {
  try {
    const command = new PutCommand({
      TableName: AWS_DYNAMO_TABLES.PRODUCT,
      Item: {
        ...data
      }
    });

    await db.send(command);
    return {
      success: true
    };
  } catch (error) {
    return {
      error: true
    };
  }
};

export const updateProductState = async ({
  productType,
  productId,
  approval
}: ProductUpdateState) => {
  const command = new UpdateCommand({
    TableName: AWS_DYNAMO_TABLES.PRODUCT,
    Key: { productType, productId },
    UpdateExpression: "SET approval = :approval",
    ExpressionAttributeValues: {
      ":approval": approval
    },
    ReturnValues: "ALL_NEW"
  });

  try {
    await db.send(command);
    return {
      success: true
    };
  } catch (error) {
    return {
      error: true
    };
  }
};

export const deleteProduct = async (product: Product) => {
  const { productType, productId } = product;

  const command = new DeleteCommand({
    TableName: AWS_DYNAMO_TABLES.PRODUCT,
    Key: { productType, productId }
  });

  try {
    const response = await db.send(command);
    console.log(response);
    return {
      success: true
    };
  } catch (error) {
    return {
      error: true
    };
  }
};
