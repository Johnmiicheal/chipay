import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Icon,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  useToast,
  useClipboard,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import router from "next/router";
import React, { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoSendOutline,
  IoCopyOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { useUserAPI } from "./ChiProvider";
import { LuDownload } from "react-icons/lu";

interface SendMoneyProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankProps {
  id: number;
  code: string;
  name: string;
}
export const Deposit: React.FC<SendMoneyProps> = ({ isOpen, onClose }) => {
  const { profileData } = useUserAPI();
  const toast = useToast();
  
  const [paymentLink, setPaymentLink] = useState("");
  const { hasCopied, onCopy } = useClipboard(paymentLink);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={() => setPaymentLink("")}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={2} fontSize={13} fontWeight={500}>
            <Icon as={LuDownload} color="#670B78" />
            <Text>Request for Money with Chipay</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              email: "",
              valueInUSD: 0,
            }}
            onSubmit={async (values, actions) => {
              if (!values.email) {
                toast({
                  title: "Request Error",
                  description: `Email Address is required`,
                  status: "error",
                  variant: "left-accent",
                  position: "top-right",
                  duration: 5000,
                  isClosable: true,
                });
              } else if (values.valueInUSD <= 0) {
                toast({
                  title: "Request Error",
                  description: `Amount in USD is required`,
                  status: "error",
                  variant: "left-accent",
                  position: "top-right",
                  duration: 5000,
                  isClosable: true,
                });
              }else if (paymentLink.length > 1) {
                toast({
                  title: "Request Error",
                  description: `Request has already been sent`,
                  status: "error",
                  variant: "left-accent",
                  position: "top-right",
                  duration: 5000,
                  isClosable: true,
                });
              } else {
                const response = await fetch(
                  "https://api-v2-sandbox.chimoney.io/v0.2/payment/initiate",
                  {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      "content-type": "application/json",
                      "X-API-KEY": process.env.NEXT_PUBLIC_API!,
                    },
                    body: JSON.stringify({
                      payerEmail: values.email,
                      valueInUSD: values.valueInUSD,
                      subAccount: profileData.userBio.suid,
                    }),
                  }
                );

                const data = await response.json();
                if (response.status === 200 && data.status === "success") {
                  toast({
                    title: "Request Sent Successful",
                    description: `Your request for $${values.valueInUSD.toLocaleString()} to ${
                      values.email
                    } was successful 💸💸`,
                    status: "success",
                    variant: "left-accent",
                    position: "top-right",
                    duration: 5000,
                    isClosable: true,
                  });
                  setPaymentLink(data?.data?.paymentLink);
                } else if (response.status === 400) {
                  toast({
                    title: "Request Error",
                    description: `Unable to complete the request`,
                    status: "error",
                    variant: "left-accent",
                    position: "top-right",
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  toast({
                    title: "Request Error",
                    description: `${data.error}`,
                    status: "error",
                    variant: "left-accent",
                    position: "top-right",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }
            }}
          >
            {(props) => (
              <Form>
                <Flex direction="column" gap={3} w="full" mt={2} mb={2}>
                  <Field name="email">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <FormLabel>Email Address</FormLabel>
                        <Input {...field} placeholder="Email" type="email" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="valueInUSD">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>Amount in USD</FormLabel>
                        <Input
                          {...field}
                          min={0}
                          placeholder="$$$"
                          type="number"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Flex
                    align="center"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    w={"full"}
                    h={"40px"}
                    p={2}
                    cursor="text"
                    display={paymentLink.length > 1  ? "flex" : 'none'}
                  >
                    <Box p={2} mr={2} flexGrow={1} fontSize="12">
                      {paymentLink}
                    </Box>
                    <IconButton
                      aria-label="Copy"
                      size="sm"
                      icon={
                        hasCopied ? <IoCheckmarkOutline /> : <IoCopyOutline />
                      }
                      onClick={onCopy}
                      variant="ghost"
                    />
                  </Flex>
                  <Button
                    fontSize={12}
                    mt={4}
                    py={3}
                    border="1px solid #580867"
                    bg="#670B78"
                    w="full"
                    color="white"
                    _hover={{ bg: "#580867" }}
                    rounded="full"
                    isLoading={props.isSubmitting}
                    type="submit"
                    onClick={() => props.handleSubmit()}
                  >
                    {paymentLink.length < 1 ? "Send Request" : "Request Sent!"}
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
