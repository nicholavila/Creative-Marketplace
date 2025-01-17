import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/utils/gradient-button";

import type { Product } from "@/shared/types/product.type";

type PropsType = {
  onProductDelete: (productId: string) => void;
};

export const getColumnsForBundleProductsTable = ({
  onProductDelete
}: PropsType) => {
  const columns: ColumnDef<Product, string | string[]>[] = [
    {
      accessorKey: "ownerId",
      header: ({ column }) => (
        <div className="flex justify-center">
          <button
            className="inline-flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Creator
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </button>
        </div>
      ),
      cell: (info) => <p className="text-center">{info.getValue()}</p>
    },
    {
      accessorKey: "productType",
      header: ({ column }) => (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Type
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </button>
      ),
      cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>
    },
    {
      accessorKey: "title",
      header: () => "Title",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Price</div>,
      cell: (info) => (
        <div className="text-right font-medium">{info.getValue()}</div>
      )
    },
    {
      accessorKey: "fileList",
      header: () => <div className="text-right">Uploaded Files</div>,
      cell: (info) => (
        <div className="text-right font-medium">{info.getValue().length}</div>
      )
    },
    {
      accessorKey: "previewList",
      header: () => <div className="text-right">Preview Images</div>,
      cell: (info) => (
        <div className="text-right font-medium">{info.getValue().length}</div>
      )
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Remove</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex justify-center">
            <GradientButton
              variant={"destructive"}
              className="h-6 text-sm"
              onClick={() => onProductDelete(product.productId)}
            >
              Remove
            </GradientButton>
          </div>
        );
      }
    }
  ];

  return columns;
};
