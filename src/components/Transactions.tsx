import Layout from "@/components/Layout";
import {
  Text,
  Flex,
  Image,
  Box,
  Badge,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";
import { IoSendOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { Transaction } from "./ChiProvider";
import { format } from "date-fns";

interface TrxnProps {
  trxn: Transaction[];
}

export const Transactions: React.FC<TrxnProps> = ({ trxn }) => {
  const tableHeaders = [
    "receiver",
    "amount",
    "Currency",
    "Wallet",
    "Delivery Status",
    "Payment Status",
    "Date",
  ];
  return (
    <Box
      borderRadius={"md"}
      bg="white"
      border="1px solid #e2e2e2"
      boxShadow={"md"}
      p={3}
      w={{ base: "full", lg: "720px" }}
    >
      <Text fontSize={12} fontWeight={500}>
        Transactions
      </Text>
      {trxn.length < 1 ? (
        <Flex direction="column" gap={3} justify={"center"} align="center">
          <Image src="/credit-card.svg" alt="No Transactions" w="30%" />
          <Text>No transactions yet</Text>
        </Flex>
      ) : (
        <TableContainer>
          <Flex
            overflow={"auto"}
            h={{ base: "full", lg: "350px" }}
            sx={{
              "&::-webkit-scrollbar": {
                width: "0",
                height: "0"
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#670B78",
                borderRadius: "12px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#670B78",
              },
              "&::-webkit-scrollbar-track": {
                background: "#670B7850",
              },
              "&:hover::-webkit-scrollbar": {
                width: "5px",
                height: "5px"
              },
            }}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  {tableHeaders.map((item, index) => (
                    <Th key={index}>{item}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {trxn.map((item, index) => (
                  <Tr key={index} fontSize={12}>
                    <Td>
                      {item.receiver ||
                        item.accNumber ||
                        item.phone ||
                        item.payoutPhoneNumber || item.payerEmail}
                    </Td>
                    <Td>
                      {item.amount?.toLocaleString() ||
                        item.amountPaid?.toLocaleString()}
                    </Td>
                    <Td>{item.currency || item.amountCurrency || "USD"}</Td>
                    <Td>
                      <Badge
                        rounded="full"
                        colorScheme="purple"
                        fontSize="10"
                        py={1}
                        px={2}
                      >
                        {item.wallet || item.type} Pay
                      </Badge>
                    </Td>
                    <Td>{item.deliveryStatus || "sent"}</Td>
                    <Td>{item.status}</Td>
                    <Td>
                      {format(
                        new Date(item.date || item.payoutDate),
                        "do MMMM yyyy • hh:mm aa"
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </TableContainer>
      )}
    </Box>
  );
};
