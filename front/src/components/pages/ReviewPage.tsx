import React from "react";
import ReviewTable from "../ReviewTable";
import type { NFTDataType, AddressType } from "@/App";
import { writeContract } from "@wagmi/core";
import { OWNER_ADDRESS } from "@/configs/configs";
import { CONTRACT_CONFIG } from "@/configs/configs";

function ReviewPage({
    reviewLists,
    address,
    setAlertContent,
    reloadData,
}: {
    reviewLists: NFTDataType[];
    address: AddressType | undefined;
    setAlertContent: React.Dispatch<React.SetStateAction<string>>;
    reloadData: () => void;
}) {
    console.log(reviewLists);
    const isOwner = !!address && address === OWNER_ADDRESS;

    const executeMintByOwner = async (id: bigint[], metadataURI: string[]) => {
        if (address) {
            const { hash } = await writeContract({
                ...CONTRACT_CONFIG,
                functionName: "executeMintByOwner",
                args: [id, metadataURI],
                account: address,
            });
            reloadData();
            setAlertContent("Success! Transaction hash: " + hash);
        } else {
            setAlertContent("Please connect your wallet");
        }
    };

    const handleSingleMint = async (id: bigint, metadataURI: string) => {
        await executeMintByOwner([id], [metadataURI]);
    };

    return (
        <div className="hidden-scrollbar w-full h-full overflow-y-scroll">
            <ReviewTable
                isOwner={isOwner}
                reviewLists={reviewLists}
                handleSingleMint={handleSingleMint}
            />
        </div>
    );
}

export default ReviewPage;
