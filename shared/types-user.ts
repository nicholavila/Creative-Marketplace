export type ProductLink = {
  productType: string;
  productId: string;
};

export type Creator = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  bio: string;
  products: ProductLink[];
};

export type Customer = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
};

export type User = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  image?: string; // in case of social login
  avatar?: string;
  cover?: string;
  bio?: string;
  products?: ProductLink[];
  cart?: ProductLink[];
  purchasedProducts: ProductLink[];
};