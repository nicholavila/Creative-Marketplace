"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FaFaucet } from "react-icons/fa";

interface PropsParams {
	imgPath: string;
	title: string;
	description: string;
	price: number
}

export const ProductItem = ({ imgPath, title, description, price }: PropsParams) => {
	return (
		<Link href={`/products/details/${title}`}>
			<Card className="shadow-md cursor-pointer hover:drop-shadow-lg hover:bg-gray-100 hover:translate-x-[-1px] hover:translate-y-[-1px]">
				<CardHeader>
					<p>{title}</p>
				</CardHeader>
				<CardContent>
					<Avatar className="w-48 h-48 rounded-xl">
						<AvatarImage src={imgPath} />
						<AvatarFallback className="bg-sky-500">
							<FaFaucet className="text-white" />
						</AvatarFallback>
					</Avatar>
				</CardContent>
				<CardFooter className="flex flex-col">
					<p className="text-lg text-black drop-shadow-md">{description}</p>
					<p className="text-md text-gray-600">Price: ${price}</p>
				</CardFooter>
			</Card>
		</Link>
	);
};
