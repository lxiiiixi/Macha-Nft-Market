import React, { ReactNode, useEffect } from "react";
import ReviewTable from "../ReviewTable";
import type { NFTDataType, AddressType } from "@/App";
import { useContractWrite } from "wagmi";
import { OWNER_ADDRESS } from "@/configs/configs";
import { CONTRACT_CONFIG } from "@/configs/configs";

function ReviewPage({
    reviewLists,
    address,
    setAlertContent,
}: {
    reviewLists: NFTDataType[];
    address: AddressType | undefined;
    setAlertContent: React.Dispatch<React.SetStateAction<ReactNode>>;
}) {
    const isOwner = !!address && address === OWNER_ADDRESS;
    const { data: data1, write: writeExecuteMintByOwner } = useContractWrite({
        ...CONTRACT_CONFIG,
        functionName: "executeMintByOwner",
        account: address,
    });
    const { data: data2, write: writeRemoveReviewedListByIndex } = useContractWrite({
        ...CONTRACT_CONFIG,
        functionName: "removeReviewedListByIndex",
        account: address,
    });
    const { data: data3, write: writeRemoveMultipleReviewedListByindices } = useContractWrite({
        ...CONTRACT_CONFIG,
        functionName: "removeMultipleReviewedListByindices",
        account: address,
    });

    useEffect(() => {
        if (data1) {
            setAlertContent("Success! " + data1);
        }
        if (data2) {
            setAlertContent("Success! " + data2);
        }
        if (data3) {
            setAlertContent("Success! " + data3);
        }
    }, [data1, data2, data3, setAlertContent]);

    const executeMintByOwner = async (id: bigint[], metadataURI: string[]) => {
        if (address) {
            // const { hash } = await writeContract({
            //     ...CONTRACT_CONFIG,
            //     functionName: "executeMintByOwner",
            //     args: [id, metadataURI],
            //     account: address,
            // });
            // reloadData();
            writeExecuteMintByOwner({
                args: [id, metadataURI],
            });
        } else {
            setAlertContent("Please connect your wallet");
        }
    };

    const removeReviewedListByIndex = async (id: bigint, metadataURI: string) => {
        if (address) {
            writeRemoveReviewedListByIndex({
                args: [id, metadataURI],
            });
            // const { hash } = await writeContract({
            //     ...CONTRACT_CONFIG,
            //     functionName: "removeReviewedListByIndex",
            //     args: [id, metadataURI],
            //     account: address,
            // });
            // reloadData();
        } else {
            setAlertContent("Please connect your wallet");
        }
    };

    const removeMultipleReviewedListByindices = async (id: bigint[], metadataURI: string[]) => {
        if (address) {
            // const { hash } = await writeContract({
            //     ...CONTRACT_CONFIG,
            //     functionName: "removeMultipleReviewedListByindices",
            //     args: [id, metadataURI],
            //     account: address,
            // });
            writeRemoveMultipleReviewedListByindices({
                args: [id, metadataURI],
            });
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
