import {
    Flex,
    Text,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Link,
  } from "@chakra-ui/react";
  import { Formik, Form, Field } from "formik";
import Head from "next/head";
  
  const Register = () => {
    function validateName(value: string) {
      let error;
      if (!value) {
        error = "Name is required";
      }
      if(value.length < 5){
        error = "Length of name is invalid"
      }
      const regex = /[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|~-]/;
      if(regex.test(value) === true){
        error="Name contains invalid characters"
      }
      return error;
    }
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
    function validateNumber(value: string) {
      let error;
      if (!value) {
        error = "Phone Number is required";
      }
      if(value.length < 11){
        error="Phone Number is invalid"
      }    
      return error;
    }
    function validatePassword(value: string) {
      let error;
      if (!value) {
        error = "Password is required";
      }
      if(value.length < 8){
        error="Password should at least 8 characters"
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
        <Flex bgImg="/register.png" bgPos="center" bgSize="cover" bgRepeat={"no-repeat"} w="35vw" h="full"></Flex>
        <Flex bg="white" align="center" justify="center" w="full">
          <Flex align="center" justify={"center"} pt={10}>
            <Formik
              initialValues={{ name: "", email: "", phoneNumber: "", password: "" }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  actions.setSubmitting(false);
                }, 1000);
              }}
            >
              {(props) => (
                <Form>
                  <Text fontWeight={600} fontSize="xl" mb={5}>Create your Chipay Account</Text>
                  <Flex direction="column" gap={3} w="20vw">
  
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
                        isInvalid={form.errors.phoneNumber && form.touched.phoneNumber}
                      >
                        <FormLabel>Phone Number</FormLabel>
                        <Input {...field} placeholder="Phone Number" type="text" />
                        <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
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
                  <Text mt={3}>Already have an account? <Link href="/login">Login</Link></Text>
                </Form>
              )}
            </Formik>
          </Flex>
        </Flex>
      </Flex>
    );
  };
  
  export default Register
  