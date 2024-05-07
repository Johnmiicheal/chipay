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
  IoPhonePortraitOutline,
} from "react-icons/io5";
import { useUserAPI } from "./ChiProvider";
import { LuDownload } from "react-icons/lu";

interface SendMoneyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetAirtime: React.FC<SendMoneyProps> = ({ isOpen, onClose }) => {
  function validatePhone(value: string) {
    let error;
    if (value && !value.startsWith("+")) {
      error = "Phone number must contain the country code.";
    }
    return error;
  }
  const { profileData } = useUserAPI();
  const toast = useToast();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={2} fontSize={13} fontWeight={500}>
            <Icon as={IoPhonePortraitOutline} color="#670B78" />
            <Text>Get Airtime with Chipay</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              number: "",
              valueInUSD: "",
            }}
            onSubmit={async (values, actions) => {
              if (!values.number) {
                toast({
                  title: "Request Error",
                  description: `Phone Number is required`,
                  status: "error",
                  variant: "left-accent",
                  position: "top-right",
                  duration: 5000,
                  isClosable: true,
                });
              } else if (!values.valueInUSD) {
                toast({
                  title: "Request Error",
                  description: `Amount in USD is required`,
                  status: "error",
                  variant: "left-accent",
                  position: "top-right",
                  duration: 5000,
                  isClosable: true,
                });
              } else {
                const response = await fetch(
                  "https://api-v2-sandbox.chimoney.io/v0.2/payouts/airtime",
                  {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      "content-type": "application/json",
                      "X-API-KEY": process.env.NEXT_PUBLIC_API!,
                    },
                    body: JSON.stringify({
                      airtimes: [
                        {
                          countryToSend: "Nigeria",
                          phoneNumber: values.number,
                          valueInUSD: values.valueInUSD,
                        },
                      ],
                      subAccount: profileData.userBio.suid,
                    }),
                  }
                );

                const data = await response.json();
                if (response.status === 200 && data.status === "success") {
                  toast({
                    title: "Request Sent Successful",
                    description: `Your airtime purchase of $${values.valueInUSD} to ${values.number} was successful 💸💸`,
                    status: "success",
                    variant: "left-accent",
                    position: "top-right",
                    duration: 5000,
                    isClosable: true,
                  });
                  onClose();
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
                  <Field name="number" validate={validatePhone}>
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.number && form.touched.number}
                      >
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          {...field}
                          placeholder="Phone Number"
                          type="tel"
                        />
                        <FormErrorMessage>
                          {form.errors.number}
                        </FormErrorMessage>
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
                    Send Request
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
