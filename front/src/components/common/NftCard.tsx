import React from "react";
import type { NFTDataType } from "@/App";
import { formatEther } from "viem";
import { shortAddress, timestampToDate } from "@/configs/utils";
import { CopyIcon, YesIcon } from "@/assets";
import type { AddressType } from "@/App";
import { CONTRACT_CONFIG } from "@/configs/configs";
import { useContractWrite } from "wagmi";
import useBalance from "@/hooks/useBalance";

function NftCard({
    isHome,
    data,
    address,
    setChangePriceNftInfo,
}: {
    isHome: boolean; // apart the home page
    data: NFTDataType;
    address: AddressType | undefined;
    setChangePriceNftInfo?: React.Dispatch<React.SetStateAction<NFTDataType | undefined | null>>;
}) {
    const [copyIcon, setCopyIcon] = React.useState(CopyIcon);
    const balance = useBalance();
    const { isLoading, write } = useContractWrite({
        ...CONTRACT_CONFIG,
        functionName: "payToBuy",
        account: address,
    });

    React.useEffect(() => {
        if (copyIcon === CopyIcon) return;
        const timer = setTimeout(() => {
            setCopyIcon(CopyIcon);
        }, 2000);
        return () => clearTimeout(timer);
    }, [copyIcon]);

    const { cost, id, description, metadataURI, owner, timestamp, title } = data;
    const ifOwner = address && address === owner;

    const handlePayToBuy = () => {
        if (!ifOwner) {
            write({
                args: [id],
                value: cost,
            });

            // const { hash } = await writeContract({
            //     ...CONTRACT_CONFIG,
            //     functionName: "payToBuy",
            //     args: [id],
            //     value: cost,
            //     account: address,
            // });
            // console.log(hash);
            // reloadData && reloadData();
        }
    };

    const checkBuyButton = () => {
        if (address?.length === 0) {
            return "Connect Wallet First";
        }
        if (ifOwner) {
            return "You're already the owner";
        }
        if (!balance) {
            return "Connect Wallet First";
        }
        if (balance.value < cost) {
            return "Insufficient balance";
        }
        return true;
    };

    return (
        <div className="daisy-card w-full h-full bg-base-100 shadow-xl">
            <figure
                className={`daisy-skeleton flex justify-center items-center overflow-hidden ${
                    isHome ? "" : "h-[70%] w-full"
                }`}
            >
                <img src={metadataURI} />
            </figure>
            <div className="daisy-card-body p-4">
                <h2 className="daisy-card-title flex justify-between">
                    <div className="flex justify-start items-center">
                        <span className="text-md text-left"> {title} </span>
                        <div className="daisy-badge bg-[#7A9B57] text-white ml-1">{`#${id}`}</div>
                    </div>
                    {!isHome && (
                        <div
                            className="daisy-tooltip daisy-tooltip-left"
                            data-tip={checkBuyButton() === true ? "Pay to buy" : checkBuyButton()}
                        >
                            <button
                                className={`daisy-btn daisy-btn-sm ${
                                    ifOwner ? "cursor-not-allowed" : ""
                                }`}
                                onClick={handlePayToBuy}
                                disabled={checkBuyButton() !== true || isLoading}
                            >
                                {isLoading ? "Pay..." : "Buy Now"}
                            </button>
                        </div>
                    )}
                </h2>
                <p className="text-left">{description}</p>
                <div className="text-left text-sm text-gray-500/90">
                    Owned By {shortAddress(owner)}
                    <img
                        className="ml-2 inline cursor-pointer"
                        src={copyIcon}
                        onClick={() => {
                            navigator.clipboard.writeText(owner);
                            setCopyIcon(YesIcon);
                        }}
                    />
                </div>
                <div className="daisy-card-actions justify-between">
                    <div className="">Creation time: {timestampToDate(timestamp)}</div>
                    <div
                        className="daisy-tooltip daisy-tooltip-left"
                        data-tip={`Change price (Only owner of the NFT)`}
                    >
                        <div
                            className={`daisy-badge daisy-badge-outline daisy-badge-lg ${
                                ifOwner ? "cursor-pointer" : "cursor-not-allowed"
                            }`}
                            onClick={() => {
                                (
                                    document.getElementById("my_modal_1") as HTMLDialogElement
                                ).showModal();
                                setChangePriceNftInfo && setChangePriceNftInfo(data);
                            }}
                        >
                            {`${formatEther(cost)} ETH`}
                            <img
                                width="13px"
                                className="ml-1"
                                src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NftCard;
