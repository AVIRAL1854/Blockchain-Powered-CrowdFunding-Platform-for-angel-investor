"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TableDemo() {
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const registrationNumber = process.env.registrationNumber; // Correct env variable
        const response = await axios.post(
          "http://localhost:3000/apis/getMyTokens",
          {
            data: {
              registrationNumber: registrationNumber,
            },
          }
        );

        if (response.data.response) {
          setResponseData(response.data.response); // Set response data to state
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array ensures this runs once after component mounts

  // Calculate the total amount (optional, since you're not getting a 'totalAmount' in the response)
  const totalQuantity = responseData.reduce(
    (acc, token) => acc + token.tokenQuantity,
    0
  );
  const totalEquity = responseData.reduce(
    (acc, token) => acc + token.equity,
    0
  );

  return (
    <Table>
      <TableCaption>A list of your recent tokens.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Token Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Token Address</TableHead>
          <TableHead className="text-right">Equity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : (
          responseData.map((token) => (
            <TableRow key={token.id}>
              <TableCell className="font-medium">{token.tokenName}</TableCell>
              <TableCell>{token.tokenQuantity}</TableCell>
              <TableCell>{token.walletAddress}</TableCell>
              <TableCell className="text-right">{token.equity}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{totalEquity}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
