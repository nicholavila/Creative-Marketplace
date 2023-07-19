import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { ProductItem } from "@/components/product/product-item";
import { Navbar } from "./_components/navbar";

export default function Products() {
  const products = [
    {
      imgPath: '/images/1.jpg',
      title: 'Product 1',
      description: 'Product Description 1',
      price: 100
    },
    {
      imgPath: '/images/2.jpg',
      title: 'Product 2',
      description: 'Product Description 2',
      price: 100
    },
    {
      imgPath: '/images/3.jpg',
      title: 'Product 3',
      description: 'Product Description 3',
      price: 100
    },
    {
      imgPath: '/images/1.jpg',
      title: 'Product 1',
      description: 'Product Description 1',
      price: 100
    },
    {
      imgPath: '/images/2.jpg',
      title: 'Product 2',
      description: 'Product Description 2',
      price: 100
    },
    {
      imgPath: '/images/3.jpg',
      title: 'Product 3',
      description: 'Product Description 3',
      price: 100
    },
    {
      imgPath: '/images/1.jpg',
      title: 'Product 1',
      description: 'Product Description 1',
      price: 100
    },
    {
      imgPath: '/images/2.jpg',
      title: 'Product 2',
      description: 'Product Description 2',
      price: 100
    },
    {
      imgPath: '/images/3.jpg',
      title: 'Product 3',
      description: 'Product Description 3',
      price: 100
    },
    {
      imgPath: '/images/1.jpg',
      title: 'Product 1',
      description: 'Product Description 1',
      price: 100
    },
    {
      imgPath: '/images/2.jpg',
      title: 'Product 2',
      description: 'Product Description 2',
      price: 100
    },
    {
      imgPath: '/images/3.jpg',
      title: 'Product 3',
      description: 'Product Description 3',
      price: 100
    },
    {
      imgPath: '/images/1.jpg',
      title: 'Product 1',
      description: 'Product Description 1',
      price: 100
    },
    {
      imgPath: '/images/2.jpg',
      title: 'Product 2',
      description: 'Product Description 2',
      price: 100
    },
    {
      imgPath: '/images/3.jpg',
      title: 'Product 3',
      description: 'Product Description 3',
      price: 100
    },
    {
      imgPath: '/images/1.jpg',
      title: 'Product 1',
      description: 'Product Description 1',
      price: 100
    },
    {
      imgPath: '/images/2.jpg',
      title: 'Product 2',
      description: 'Product Description 2',
      price: 100
    },
    {
      imgPath: '/images/3.jpg',
      title: 'Product 3',
      description: 'Product Description 3',
      price: 100
    },
    {
      imgPath: '/images/3.jpg',
      title: 'Product 3',
      description: 'Product Description 3',
      price: 100
    }
  ]

  return (
    <main className="w-full flex flex-col pt-6">
      <Navbar title="Products" content="You can see all products here" />
      <div className="w-full flex flex-wrap py-6">
        {products.map((product, index) => (
          <div className="w-1/4 p-2">
            <ProductItem
              key={index}
              imgPath={product.imgPath}
              title={product.title}
              description={product.description}
              price={product.price} />
          </div>
        ))}
      </div>
    </main>
  );
}
