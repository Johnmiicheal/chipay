import Head from "next/head";
import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter()
  return (
    <Flex
      direction="column"
      w="full"
      align="center"
      px={"100px"}
      bgImg="/window-pane.png"
      bgSize="cover"
      className={`${inter.className}`}
    >
      <Flex
        w="full"
        px="100px"
        mt={5}
        mb={14}
        align="center"
        justify="space-between"
      >
        <Flex align={"center"} gap={2}>
          <Image src="/icons/chitext.svg" alt="Chipay" w="20%" />
          <Link
            _hover={{ textDecor: "none" }}
            href="https://chimoney.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Flex align="center" ml={-2} gap={2}>
              by{" "}
              <Image
                src="/icons/chimoney.svg"
                display="inline"
                alt="Chimoney Logo"
                width="60%"
              />
            </Flex>
          </Link>
        </Flex>
        <Button
          fontSize={12}
          py={3}
          border="1px solid #580867"
          bg="#670B78"
          color="white"
          _hover={{ bg: "#580867" }}
          rounded="full"
          onClick={() => router.push('/login')}
        >
          Get Started with Chipay
        </Button>
      </Flex>

      <Text fontSize="5xl" fontWeight={600} mb={10} textAlign={"center"}>
        Built to enable{" "}
        <Text
          bgGradient="linear(to-l, #7928CA, #580867)"
          bgClip="text"
          px={1}
          display={"inline"}
          fontSize="5xl"
          fontWeight="extrabold"
          fontStyle={"italic"}
        >
          Seamless, <br />
          Secure, & Scalable
        </Text>{" "}
        Payments
      </Text>
      <Image src="/mockup.png" alt="Chipay Mockup" width={"80%"} />
    </Flex>
  );
}
