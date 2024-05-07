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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import router from "next/router";
import React, { useEffect } from "react";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoSendOutline } from "react-icons/io5";
import { useUserAPI } from "./ChiProvider";

interface SendMoneyProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankProps{
        id: number;
        code: string;
        name: string;
}
export const SendMoney: React.FC<SendMoneyProps> = ({ isOpen, onClose }) => {
  const [value, setValue] = React.useState("1");
  const { profileData } = useUserAPI();
  const toast = useToast();
  function validatePhone(value: string) {
    let error;
    if (value && !value.startsWith("+")) {
      error = "Phone number must contain the country code.";
    }
    return error;
  }


  const [bankData, setBankData] = React.useState<BankProps[]>([]);
  const [selectedBank, setSelectedBank] = React.useState("");
  const [bankName, setBankName] = React.useState("Select Bank");
  const [bankSearch, setBankSearch] = React.useState("");
  const [name, setName] = React.useState("");
  const [acctNum, setAcctNum] = React.useState("");

  const [isVerified, setIsVerified] = React.useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(
          "https://api-v2-sandbox.chimoney.io/v0.2/info/country-banks?countryCode=NG",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "X-API-KEY": process.env.NEXT_PUBLIC_API!,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setBankData(data.data);
        } else {
          console.error("Failed to fetch bank data");
        }
      } catch (error) {
        console.error("Error fetching bank data:", error);
      }
    };
    fetchBanks();
  }, []);
  

  const handleVerifyAccount = async (bankCode: string, accountNum: string) => {
    try {
      const response = await fetch(
        "https://api-v2-sandbox.chimoney.io/v0.2/info/verify-bank-account-number",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API!,
          },
          body: JSON.stringify({
            verifyAccountNumbers: [
              {
                countryCode: "NG",
                account_bank: bankCode,
                account_number: accountNum,
              },
            ],
          }),
        }
      );
      const data = await response.json();
      console.log(data)
      if (data?.status === "success") {
        setName(data?.data[0]?.account_name);
        setIsVerified(true);
      }else{
        setName(data.error)
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
    }
  };

  useEffect(() => {
    if(acctNum.length === 10 && selectedBank.length > 1){
        handleVerifyAccount(selectedBank, acctNum)
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={2} fontSize={13} fontWeight={500}>
            <Icon as={IoSendOutline} color="#670B78" />
            <Text>Send Money with Chipay</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs colorScheme="purple" variant="soft-rounded">
            <TabList>
              <Tab fontSize={14}>Send to ChiWallet</Tab>
              <Tab fontSize={14}>Send to Bank</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex direction="column">
                  <RadioGroup
                    onChange={setValue}
                    value={value}
                    size="sm"
                    colorScheme="purple"
                  >
                    <Stack direction="row">
                      <Radio value="1">Send to email address</Radio>
                      <Radio value="2">Send to phone number</Radio>
                    </Stack>
                  </RadioGroup>
                  <Formik
                    initialValues={{
                      email: "",
                      phone: "",
                      valueInUSD: 0,
                    }}
                    onSubmit={async (values, actions) => {
                      if (value === "1" && !values.email) {
                        toast({
                          title: "Transfer Error",
                          description: `Email Address is required`,
                          status: "error",
                          variant: "left-accent",
                          position: "top-right",
                          duration: 5000,
                          isClosable: true,
                        });
                      } else if (value === "2" && !values.phone) {
                        toast({
                          title: "Transfer Error",
                          description: `Phone Number is required`,
                          status: "error",
                          variant: "left-accent",
                          position: "top-right",
                          duration: 5000,
                          isClosable: true,
                        });
                      } else if (values.valueInUSD <= 0) {
                        toast({
                          title: "Transfer Error",
                          description: `Amount in USD is required`,
                          status: "error",
                          variant: "left-accent",
                          position: "top-right",
                          duration: 5000,
                          isClosable: true,
                        });
                      } else {
                        const response = await fetch(
                          "https://api-v2-sandbox.chimoney.io/v0.2/payouts/chimoney",
                          {
                            method: "POST",
                            headers: {
                              accept: "application/json",
                              "content-type": "application/json",
                              "X-API-KEY": process.env.NEXT_PUBLIC_API!,
                            },
                            body: JSON.stringify({
                              chimoneys: [
                                {
                                  email: values.email,
                                  phone: values.phone,
                                  valueInUSD: values.valueInUSD,
                                },
                              ],
                              subAccount: profileData.userBio.suid,
                            }),
                          }
                        );

                        const data = await response.json();
                        if (
                          response.status === 200 &&
                          data.data.error === "None"
                        ) {
                          toast({
                            title: "Transfer Successful",
                            description: `Your transfer of $${values.valueInUSD.toLocaleString()} to ${
                              values.email
                            } was successful 💸💸`,
                            status: "success",
                            variant: "left-accent",
                            position: "top-right",
                            duration: 5000,
                            isClosable: true,
                          });
                          setTimeout(() => {
                            onClose()
                          }, 600);
                        } else if (response.status === 400) {
                          toast({
                            title: "Transfer Error",
                            description: `Unable to complete the request`,
                            status: "error",
                            variant: "left-accent",
                            position: "top-right",
                            duration: 5000,
                            isClosable: true,
                          });
                        } else {
                          toast({
                            title: "Server Error",
                            description: `Unable to complete the request, please try again later`,
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
                        <Flex direction="column" gap={3} w="full" mt={4}>
                          <Flex display={value === "1" ? "flex" : "none"}>
                            <Field name="email">
                              {({ field, form }: any) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.email && form.touched.email
                                  }
                                >
                                  <FormLabel>Email Address</FormLabel>
                                  <Input
                                    {...field}
                                    placeholder="Email"
                                    type="email"
                                  />
                                  <FormErrorMessage>
                                    {form.errors.email}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </Flex>
                          <Flex display={value === "2" ? "flex" : "none"}>
                            <Field name="phone" validate={validatePhone}>
                              {({ field, form }: any) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.phone && form.touched.phone
                                  }
                                >
                                  <FormLabel>Phone Number</FormLabel>
                                  <Input
                                    {...field}
                                    placeholder="Phone Number"
                                    type="tel"
                                  />
                                  <FormErrorMessage>
                                    {form.errors.phone}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </Flex>
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
                            Send Money
                          </Button>
                        </Flex>
                      </Form>
                    )}
                  </Formik>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction="column">
                  <Formik
                    initialValues={{
                      accountNumber: "",
                      bankCode: selectedBank,
                      valueInUSD: 0,
                    }}
                    onSubmit={async (values, actions) => {
                      const response = await fetch(
                        "https://api-v2-sandbox.chimoney.io/v0.2/payouts/bank",
                        {
                          method: "POST",
                          headers: {
                            accept: "application/json",
                            "content-type": "application/json",
                            "X-API-KEY": process.env.NEXT_PUBLIC_API!,
                          },
                          body: JSON.stringify({
                            banks: [
                              {
                                countryToSend: "Nigeria",
                                account_bank: selectedBank,
                                account_number: acctNum,
                                valueInUSD: values.valueInUSD,
                                fullname: name,
                              },
                            ],
                            debitCurrency: "USD",
                            subAccount: profileData.userBio.suid,
                          }),
                        }
                      );

                      const data = await response.json();
                      if (
                        response.status === 200 &&
                        data.error === "None"
                      ) {
                        toast({
                          title: "Transfer Successful",
                          description: `Your transfer of $${values.valueInUSD.toLocaleString()} to ${name} was successful 💸💸`,
                          status: "success",
                          variant: "left-accent",
                          position: "top-right",
                          duration: 5000,
                          isClosable: true,
                        });
                        setTimeout(() => {
                            onClose()
                          }, 600);
                      } else if (response.status === 400) {
                        toast({
                          title: "Transfer Error",
                          description: `Unable to complete the request`,
                          status: "error",
                          variant: "left-accent",
                          position: "top-right",
                          duration: 5000,
                          isClosable: true,
                        });
                      } else {
                        toast({
                          title: "Server Error",
                          description: `Unable to complete the request, please try again later`,
                          status: "error",
                          variant: "left-accent",
                          position: "top-right",
                          duration: 5000,
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    {(props) => (
                      <Form>
                        <Flex direction="column" gap={3} w="full" mt={4}>
                          <Popover>
                          <FormLabel mb={-1}>Select Bank</FormLabel>
                            <PopoverTrigger>
                              <Button w="full" justifyContent="start" fontWeight={400} color="gray.500" bg="transparent" border="1px solid #e2e2e2">{bankName}</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverBody>
                                <Input value={bankSearch} onChange={(e) => setBankSearch(e.target.value)} />
                                <Flex direction="column" gap={1} mt={3} overflow="auto" h="40vh">
                                    {bankData.filter(item => item?.name.toLowerCase().includes(bankSearch)).map((item, index) => (
                                        <Flex align="center" key={item.id} cursor="pointer" _hover={{ bg: "#e2e2e2"}} p={2} borderRadius={"md"} onClick={() => {
                                            setSelectedBank(item.code);
                                            setBankName(item.name)
                                        }}>
                                            <Text>{item?.name}</Text>
                                        </Flex>
                                    )) }
                                </Flex>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                          <Field name="accNumber">
                            {({ field, form }: any) => (
                              <FormControl
                                isInvalid={
                                  form.errors.accNumber &&
                                  form.touched.accNumber
                                }
                              >
                                <FormLabel>Account Number</FormLabel>
                                <Input
                                  {...field}
                                  placeholder="Account Number"
                                  type="text"
                                  value={acctNum}
                                  maxLength={10}
                                  onChange={(e) => setAcctNum(e.target.value)}
                                  onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        handleVerifyAccount(selectedBank, acctNum)
                                    }
                                  }}
                                />
                                <FormErrorMessage>
                                  {form.errors.accNumber}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Flex align="center" gap={2} mt={-1} display={name?.length < 1 ? 'none' : 'flex'}>
                            <Text fontSize="14">{name}</Text>
                          <Icon as={name?.includes('invalid') ? IoCloseCircleOutline : IoCheckmarkCircleOutline} color={name?.includes('invalid') ? 'red' : 'green'} /></Flex>
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
                          isDisabled={!props.dirty || !props.isValid || name?.includes('invalid')}
                          type="submit"
                        >
                          Send Money
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
