// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { readContracts } from "@wagmi/core";
import { CONTRACT_CONFIG } from "@/configs/configs";
import Navbar from "@/components/Navbar.tsx";
import HomePage from "@/components/pages/HomePage";
import MintPage from "@/components/pages/MintPage";
import ListedPage from "@/components/pages/ListedPage";
import ReviewPage from "@/components/pages/ReviewPage";
import Alert from "@/components/common/Alert";
import useAlert from "./hooks/useAlert";

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
    transactionType: "Buy" | "Mint";
    from: AddressType;
    to: AddressType;
    cost: bigint;
    timestamp: bigint;
};

function App() {
    const { address } = useAccount();
    const [count, setCount] = useState(0);
    const [route, setRouter] = useState<RouteType>("HOME");
    const [alertContent, setAlertContent] = useAlert();
    const [allNfts, setAllNfts] = useState<NFTDataType[]>([]);
    const [allTransactions, setAllTransactions] = useState<TransactionStructType[]>([]);
    const [allReviewLists, setAllReviewLists] = useState<NFTDataType[]>([]);

    console.log("allNfts:", allNfts);
    console.log("AllTransactions", allTransactions);
    console.log("allReviewLists", allReviewLists);

    const switchRoute = (route: RouteType) => {
        setRouter(route);
    };

    const getContractData = async () => {
        const data = await readContracts({
            contracts: [
                {
                    ...CONTRACT_CONFIG,
                    functionName: "artist",
                },
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

        setAllNfts(data[1].result as NFTDataType[]);
        setAllTransactions(data[2].result as TransactionStructType[]);
        setAllReviewLists(data[3].result as NFTDataType[]);
    };

    useEffect(() => {
        getContractData();
    }, [count]);

    const reloadData = () => {
        setCount(count => count + 1);
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
                {route === "MINT" && (
                    <MintPage reloadData={reloadData} setAlertContent={setAlertContent} />
                )}
                {route === "REVIEW" && (
                    <ReviewPage
                        reviewLists={allReviewLists}
                        address={address}
                        setAlertContent={setAlertContent}
                    />
                )}
                {route === "LISTED" && (
                    <ListedPage allNfts={allNfts} address={address} reloadData={reloadData} />
                )}
            </div>
            <Alert content={alertContent} />
        </>
    );
}

export default App;
