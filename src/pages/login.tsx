import {
  Flex,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  useToast,
  Image
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Login = () => {
  function validateEmail(value: string) {
    let error;
    if (!value) {
      error = "Email is required";
    }
    if(!value.includes("@")){
      error=" Email is invalid"
    }    
    return error;
  }
  function validatePassword(value: string) {
    let error;
    if (!value) {
      error = "Password is required";
    } 
    return error;
  }
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    if(window.location.href.includes('#')){
      window.location.replace('/login')
    }
  })
  console.log(window.location.href)
  return (
    <Flex w="full" h="100vh" mb={-6} justify="space-between">
       <Head>
        <title>Login to your Account | Chipay</title>
        <meta name="description" content="Fintech Dashboard by Chimoney" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icons/chilinear.svg" />
      </Head>
        
      <Flex bgImg="/login.png" bgPos="center" bgSize="cover" bgRepeat={"no-repeat"} w="44vw" h="full" display={{ base: "none", lg: "flex" }} ></Flex>
      <Flex bg="white" align="center" justify="center" w="full">
      <Flex direction="column" align="center" justify={"center"} pt={{ base: 0, lg: 10}}>
          <Image src="/icons/chitext.svg" alt="chipay logo" w="40%" mb={5} />
          <Text fontWeight={600} fontSize="xl" mb={5}>
            Login to your Chipay Account
          </Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={ async (values, actions) => {
              const response = await fetch("https://api.greynote.app/chipay/login", {
                method: "POST",
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ email: values.email, password: values.password })
            })
            const data = await response.json()
            console.log("Data Name", data.user.user_metadata.name)
            if(response.status === 200  ){
              toast({
                title: "Login Successful",
                description: `Welcome Back, ${data.user.user_metadata.name}`,
                status: "success",
                variant: "left-accent",
                position: "top-right",
                duration: 5000,
                isClosable: true,
              });
              setTimeout(() => {
                router.replace('/dash')
              }, 600)
            }else if(response.status === 400){
              toast({
                title: "Login Error",
                description: `Email or Password is incorrect`,
                status: "error",
                variant: "left-accent",
                position: "top-right",
                duration: 5000,
                isClosable: true,
              });
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
                <Flex direction="column" gap={3} w={{ lg: "24vw"}}>
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
                <Field name="password" validate={validatePassword}>
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                    >
                      <FormLabel>Password</FormLabel>
                      <Input {...field} placeholder="Password" type="password" />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
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
                <Text mt={3}>Don&apos;t have an account? <Link href="/register">Register Now</Link></Text>

              </Form>
            )}
          </Formik>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login
