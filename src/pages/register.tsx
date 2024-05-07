import {
  Flex,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Image,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import Head from "next/head";

const Register = () => {
  const toast = useToast();
  function validateName(value: string) {
    let error;
    if (!value) {
      error = "Name is required";
    }
    if (value.length < 5) {
      error = "Length of name is invalid";
    }
    const regex = /[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|~-]/;
    if (regex.test(value) === true) {
      error = "Name contains invalid characters";
    }
    return error;
  }
  function validateEmail(value: string) {
    let error;
    if (!value) {
      error = "Email is required";
    }
    if (!value.includes("@")) {
      error = " Email is invalid";
    }
    return error;
  }
  function validateNumber(value: string) {
    let error;
    if (!value) {
      error = "Phone Number is required";
    }
    if (value.length < 11) {
      error = "Phone Number is invalid";
    }
    return error;
  }
  function validatePassword(value: string) {
    let error;
    if (!value) {
      error = "Password is required";
    }
    if (value.length < 8) {
      error = "Password should at least 8 characters";
    }
    return error;
  }
  return (
    <Flex w="full" h="100vh" mb={-6} justify="space-between">
      <Head>
        <title>Create your Account | Chipay</title>
        <meta name="description" content="Fintech Dashboard by Chimoney" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icons/chilinear.svg" />
      </Head>
      <Flex
        bgImg="/register.png"
        bgPos="center"
        bgSize="cover"
        bgRepeat={"no-repeat"}
        w="44vw"
        h="full"
        display={{ base: "none", lg: "flex" }}
      ></Flex>
      <Flex bg="white" align="center" justify="center" w="full">
        <Flex direction="column" align="center" justify={"center"} pt={{ base: 0, lg: 10}}>
          <Image src="/icons/chitext.svg" alt="chipay logo" w="40%" mb={5} />
          <Text fontWeight={600} fontSize="xl" mb={5}>
            Create your Chipay Account
          </Text>
          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNumber: "",
              password: "",
            }}
            onSubmit={ async (values, actions) => {
              if(!values.phoneNumber.startsWith('+')){
                toast({
                  title: "Form Error",
                  description: `Phone Number must include your country code`,
                  status: "error",
                  variant: "left-accent",
                  position: "top-right",
                  duration: 5000,
                  isClosable: true,
                });
              }
              const response = await fetch("https://api.greynote.app/chipay/register", {
                method: "POST",
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({name: values.name, email: values.email, phoneNumber: values.phoneNumber, password: values.password })
            })
            const data = await response.json()
            console.log("Data Name", data.user.user_metadata.name)
            if(data.doc){
              toast({
                title: "Registration Successful",
                description: `Welcome to Chipay, ${data.user.user_metadata.name}. Check your email for the verification link.`,
                status: "success",
                variant: "left-accent",
                position: "top-right",
                duration: 5000,
                isClosable: true,
              });
              setTimeout(() => {
                window.location.replace('/login')
              }, 2000)
            }else{
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
                <Flex direction="column" gap={3} w={{ base: "full", lg: "24vw"}}>
                  <Field name="name" validate={validateName}>
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Full name</FormLabel>
                        <Input {...field} placeholder="Full Name" type="text" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email" validate={validateEmail}>
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
                  <Field name="phoneNumber" validate={validateNumber}>
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.phoneNumber && form.touched.phoneNumber
                        }
                      >
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          {...field}
                          placeholder="Phone Number"
                          type="text"
                        />
                        <FormErrorMessage>
                          {form.errors.phoneNumber}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password" validate={validatePassword}>
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel>Password</FormLabel>
                        <Input
                          {...field}
                          placeholder="Password"
                          type="password"
                        />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
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
                  type="submit"
                >
                  Submit
                </Button>
                <Text mt={3}>
                  Already have an account? <Link href="/login">Login</Link>
                </Text>
              </Form>
            )}
          </Formik>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Register;
