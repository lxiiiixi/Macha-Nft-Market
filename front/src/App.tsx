import { useState } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_CONFIG } from "@/configs/configs";
import Navbar from "@/components/Navbar.tsx";
import HomePage from "@/components/pages/HomePage";
import MintPage from "@/components/pages/MintPage";
import ListedPage from "@/components/pages/ListedPage";
import ReviewPage from "@/components/pages/ReviewPage";
import Alert from "@/components/common/Alert";
import useAlert from "./hooks/useAlert";
import { useContractReads } from "wagmi";

export type AddressType = `0x${string}`;
export type RouteType = "HOME" | "MINT" | "REVIEW" | "LISTED";
export type NFTDataType = {
    cost: bigint;
    description: string;
    id: bigint;
    metadataURI: string;
    owner: AddressType;
    timestamp: bigint;
    title: string;
};
export type TransactionStructType = {
    id: bigint;
    transactionType: 0 | 1; // 0: buy, 1: mint
    from: AddressType;
    to: AddressType;
    cost: bigint;
    timestamp: bigint;
};

function App() {
    const { address } = useAccount();
    const [route, setRouter] = useState<RouteType>("HOME");
    const [alertContent, setAlertContent] = useAlert();
    // const [allNfts, setAllNfts] = useState<NFTDataType[]>([]);
    // const [allTransactions, setAllTransactions] = useState<TransactionStructType[]>([]);
    // const [allReviewLists, setAllReviewLists] = useState<NFTDataType[]>([]);
    const { data } = useContractReads({
        contracts: [
            {
                ...CONTRACT_CONFIG,
                functionName: "getAllNFTs",
            },
            {
                ...CONTRACT_CONFIG,
                functionName: "getAllTransactions",
            },
            {
                ...CONTRACT_CONFIG,
                functionName: "getAllToBeReviewLists",
            },
        ],
    });
    const allNfts =
        data && data[0] && data[0]?.result && data[0]?.status === "success"
            ? (data[0]?.result as NFTDataType[])
            : [];
    const allTransactions =
        data && data[1] && data[1]?.result && data[1]?.status === "success"
            ? (data[1]?.result as TransactionStructType[])
            : [];
    const allReviewLists =
        data && data[2] && data[2]?.result && data[2]?.status === "success"
            ? (data[2]?.result as NFTDataType[])
            : [];

    console.log("allNfts:", allNfts);
    console.log("AllTransactions", allTransactions);
    console.log("allReviewLists", allReviewLists);

    const switchRoute = (route: RouteType) => {
        setRouter(route);
    };

    return (
        <>
            <div className="h-[10%]">
                <Navbar route={route} switchRoute={switchRoute} />
            </div>
            <div className="py-2 h-[90%]">
                {route === "HOME" && (
                    <HomePage
                        address={address}
                        allTransactions={allTransactions}
                        switchRoute={switchRoute}
                    />
                )}
                {route === "MINT" && <MintPage setAlertContent={setAlertContent} />}
                {route === "REVIEW" && (
                    <ReviewPage
                        reviewLists={allReviewLists}
                        address={address}
                        setAlertContent={setAlertContent}
                    />
                )}
                {route === "LISTED" && <ListedPage allNfts={allNfts} address={address} />}
            </div>
            <Alert content={alertContent} />
        </>
    );
}

export default App;
