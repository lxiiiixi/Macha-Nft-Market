import React, { ReactNode } from "react";
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
    setAlertContent: React.Dispatch<React.SetStateAction<ReactNode>>;
    reloadData: () => void;
}) {
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

    const removeReviewedListByIndex = async (id: bigint, metadataURI: string) => {
        if (address) {
            const { hash } = await writeContract({
                ...CONTRACT_CONFIG,
                functionName: "removeReviewedListByIndex",
                args: [id, metadataURI],
                account: address,
            });
            reloadData();
            setAlertContent("Success! Transaction hash: " + hash);
        } else {
            setAlertContent("Please connect your wallet");
        }
    };

    const removeMultipleReviewedListByindices = async (id: bigint[], metadataURI: string[]) => {
        if (address) {
            const { hash } = await writeContract({
                ...CONTRACT_CONFIG,
                functionName: "removeMultipleReviewedListByindices",
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

    const handleMultiMint = async (id: bigint[], metadataURI: string[]) => {
        await executeMintByOwner(id, metadataURI);
    };

    return (
        <div className="hidden-scrollbar w-full h-full overflow-y-scroll">
            <ReviewTable
                isOwner={isOwner}
                reviewLists={reviewLists}
                handleSingleMint={handleSingleMint}
                handleMultiMint={handleMultiMint}
                removeReviewedListByIndex={removeReviewedListByIndex}
                removeMultipleReviewedListByindices={removeMultipleReviewedListByindices}
            />
        </div>
    );
}

export default ReviewPage;
