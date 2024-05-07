import {
  Avatar,
  Button,
  Text,
  Image,
  Flex,
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { useUserAPI } from "./ChiProvider";

export const WebHeader = () => {
  const router = useRouter();
  const toast = useToast();
  const { profileData } = useUserAPI();
  const navs = [
    {
      path: "/dash",
      label: "Home",
    },
    {
      path: "/transactions",
      label: "Transactions",
    },
    {
      path: "/#budget",
      label: "Budget",
    },
    {
      path: "/#card",
      label: "Card",
    },
  ];
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://api.greynote.app/chipay/logout",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data)
      if (response.status === 200) {
        toast({
          title: "Logout Completed",
          description: `You have successfully logged out`,
          status: "info",
          variant: "left-accent",
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.replace('/login')
        }, 600)
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
    }
  };
  return (
    <Flex justify="space-between" p={2} align="center" w="full">
      <Image
        src="/icons/chitext.svg"
        w={{ base: "100px", lg: "8%" }}
        alt="Chipay Logo"
      />
      <Flex gap={2} align="center">
        {navs.map((item) => (
          <Button
            key={item.label}
            rounded="full"
            display={{ base: "none", lg: "flex" }}
            fontWeight={item.path === router.pathname ? "600" : 400}
            variant={item.path === router.pathname ? "solid" : "ghost"}
            color={item.path === router.pathname ? "#670B78" : "#CD99D7"}
            bg={item.path === router.pathname ? "white" : "transparent"}
            _hover={
              item.path !== router.pathname
                ? { fontWeight: 600, color: "white" }
                : {}
            }
          >
            {item.label}
          </Button>
        ))}
      </Flex>
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          rounded="full"
          color="white"
          _hover={{ bg: "#CD99D7" }}
        >
          <Flex gap={3} align="center">
            <Avatar
              src="https://loremflickr.com/320/240"
              name={profileData.userBio.fullName}
              size="sm"
            />
            <Text>My Account</Text>
          </Flex>
        </MenuButton>
        <MenuList px={2}>
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
