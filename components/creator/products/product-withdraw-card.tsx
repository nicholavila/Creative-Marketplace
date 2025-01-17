import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

import { ProductInfo } from "@/components/product/product-info";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QuestionAlert } from "@/components/utils/question-alert";

import type { Product } from "@/shared/types/product.type";

type Props = {
  product: Product;
  onWithdrawFromPublished: () => void;
};

export const ProductWithdrawCard = ({
  product,
  onWithdrawFromPublished
}: Props) => {
  const history = useRouter();
  const [isPreview, setPreview] = useState<boolean>(false);

  const onGoBack = () => {
    history.back();
  };

  return (
    <div className="flex flex-col gap-y-6">
      <div className="text-base">
        <p>Congratulations!</p>
        <p>Your product is published.</p>
      </div>

      <div className="w-full flex justify-between">
        <div className="flex gap-x-4">
          <Button className="w-64 flex gap-x-4" onClick={onGoBack}>
            <FaArrowLeft />
            Go back
          </Button>
          <QuestionAlert
            title="Withdraw"
            message="Are you sure want to withdraw product from applied queue?"
            onContinue={onWithdrawFromPublished}
          >
            <Button variant={"outline"} className="w-64 flex gap-x-4">
              Remove from Sale
            </Button>
          </QuestionAlert>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-details"
            checked={isPreview}
            onCheckedChange={(checked) => setPreview(checked)}
          />
          <Label htmlFor="show-details">Product Preview</Label>
        </div>
      </div>

      {isPreview ? (
        <Card className="p-6">
          <ProductInfo product={product} isPending={true} />
        </Card>
      ) : null}
    </div>
  );
};
