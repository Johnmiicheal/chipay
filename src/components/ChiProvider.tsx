import { FC, useState, createContext, useContext, useEffect } from "react";
import { format } from "date-fns";

interface ChiUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  suid: string;
}

interface ChiTrnx {
  amount: number;
  balanceBefore: number;
  date: number;
  newBalance: number;
  description: string;
}

export interface Transaction {
  id: string;
  receiver: string;
  amount: number;
  date: number;
  wallet: string;
  comment: string;
  currency: string;
  deliveryStatus: string;
  phone: string;
  status: string;
  accNumber: string;
  amountPaid: number;
  amountCurrency: string;
  type: string;
  payoutDate: string;
  payoutPhoneNumber: string;
  country: string;
  payerEmail: string;
}

interface ChiWallet {
  type: string;
  balance: number;
  transactions: ChiTrnx[];
}

interface UserContextProps {
  profileData: {
    userBio: ChiUser;
    userWallet: ChiWallet[];
    userTransactions: Transaction[];
  };
  setProfileData: React.Dispatch<
    React.SetStateAction<{
      userBio: ChiUser;
      userWallet: ChiWallet[];
      userTransactions: Transaction[];
    }>
  >;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserApiProviderProps {
  children: React.ReactNode;
}
export const UserApiProvider: FC<UserApiProviderProps> = ({ children }) => {
  const [profileData, setProfileData] = useState({
    userBio: {
      fullName: "",
      email: "",
      phoneNumber: "",
      suid: "",
    },
    userWallet: [] as ChiWallet[],
    userTransactions: [] as Transaction[],
  });

  const updateUserBio = (newBio: any) => {
    setProfileData((previousData) => {
      return {
        ...previousData,
        userBio: newBio,
      };
    });
  };
  const apiKey = process.env.NEXT_PUBLIC_API;
  const chiUrl = process.env.NEXT_PUBLIC_URI;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const response = await fetch("https://api.greynote.app/chipay/user", {
          method: "GET",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
        });
        const userData = await response.json();

        // Process user data
        const newUserData = {
          email: userData.email,
          fullName: userData.user_metadata.name,
          phoneNumber: userData.user_metadata.phoneNumber,
          suid: userData.user_metadata.subId,
        };
        updateUserBio(newUserData);

        // Fetch wallet data
        const walletResponse = await fetch(
          "https://api-v2-sandbox.chimoney.io/v0.2/wallets/list",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "X-API-KEY": apiKey!,
            },
            body: JSON.stringify({
              subAccount: userData.user_metadata.subId,
            }),
          }
        );
        const walletData = await walletResponse.json();
        // Ensure walletData is an array before processing

        // Process wallet data
        const processedWalletData = walletData.data.map((item: ChiWallet) => ({
          type: item.type,
          balance: item.balance,
          transactions: item.transactions.map((transaction: any) => ({
            amount: transaction?.amount,
            balanceBefore: transaction?.balanceBefore,
            date: transaction?.meta.date?._seconds,
            newBalance: transaction?.newBalance,
            description: transaction?.description,
          })),
        }));

        const trxnResponse = await fetch(
          "https://api-v2-sandbox.chimoney.io/v0.2/accounts/transactions",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "X-API-KEY": apiKey!,
            },
            body: JSON.stringify({
              subAccount: userData.user_metadata.subId,
            }),
          }
        );
        const trxnData = await trxnResponse.json();
        const processTrxn = trxnData.data.map((transaction: any) => ({
          id: transaction?.id,
          receiver: transaction?.email,
          amount: transaction?.valueInUSD,
          date: transaction?.paymentDate,
          wallet: transaction?.meta?.type,
          comment: transaction?.personalizedMessage,
          currency: transaction?.meta?.currency,
          deliveryStatus: transaction?.deliveryStatus,
          status: transaction?.status,
          accNumber: transaction?.account_number,
          amountPaid: transaction?.amount,
          amountCurrency: transaction?.currency,
          type: transaction?.type,
          phone: transaction?.phone,
          payoutPhoneNumber: transaction?.phoneNumber,
          payoutDate: transaction?.issueDate,
          country: transaction?.countryToSend,
          payerEmail: transaction?.payerEmail
        }));

        // Merge the transactions based on issueDate and paymentDate
        const mergedTransactions = [...processTrxn, ...processTrxn];
        // Sort the mergedTransactions array based on the date property
        mergedTransactions.sort((a, b) => {
          const dateA = new Date(a.payoutDate || a.date).getTime();
          const dateB = new Date(b.payoutDate || b.date).getTime();
          return dateB - dateA; // Sort in descending order (most recent to oldest)
        });

        // Remove duplicate elements from the sorted array
        const uniqueTransactions = mergedTransactions.reduce(
          (unique, current) => {
            // Check if the current transaction already exists in the unique array
            if (
              !unique.some(
                (transaction: { id: string; }) => transaction.id === current.id
              )
            ) {
              // If not, add it to the unique array
              unique.push(current);
            }
            return unique;
          },
          []
        );

        // Update profile data state
        setProfileData((previousData) => ({
          ...previousData,
          userWallet: processedWalletData,
          userTransactions: uniqueTransactions,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [profileData]); // Empty dependency array to run the effect only once

  return (
    <UserContext.Provider
      value={{
        profileData,
        setProfileData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserAPI = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserAPI must be used within a UserApiProvider");
  }

  return context;
};

export default UserApiProvider;
