"use server";

import db from "@/lib/db";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const TableName = process.env.AWS_DYNAMODB_USERS_TABLE_NAME;

interface UserSetToken {
  userId: string;
  verificationToken: string;
  expires: Date;
}

export const updateUserToken = async (data: UserSetToken) => {
  const command = new UpdateCommand({
    TableName,
    Key: {
      userId: data.userId
    },
    UpdateExpression:
      "SET verificationToken = :verificationToken, expires = :expires",
    ExpressionAttributeValues: {
      ":verificationToken": data.verificationToken,
      ":expires": data.expires.toISOString()
    },
    ReturnValues: "ALL_NEW"
  });

  try {
    const response = await db.send(command);
    return response.Attributes;
  } catch (error) {
    return null;
  }
};
