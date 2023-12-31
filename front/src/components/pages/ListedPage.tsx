import React from "react";
import NftCard from "@/components/common/NftCard";
import type { NFTDataType, AddressType } from "@/App";
import { useContractWrite } from "wagmi";
import { CONTRACT_CONFIG } from "@/configs/configs";
import { parseEther } from "viem";

function ListedPage({
    allNfts,
    address,
}: {
    allNfts: NFTDataType[];
    address: AddressType | undefined;
}) {
    const [newPrice, setNewPrice] = React.useState("");
    const [changePriceNftInfo, setChangePriceNftInfo] = React.useState<NFTDataType | null>();
    const { data, isLoading, write } = useContractWrite({
        ...CONTRACT_CONFIG,
        functionName: "changePrice",
        account: address,
    });

    const ifOwner = address && changePriceNftInfo?.owner && address === changePriceNftInfo.owner;
    const handleChangePrice = async () => {
        if (ifOwner) {
            write({
                args: [changePriceNftInfo.id, parseEther(newPrice)],
            });
            console.log(data);
            setNewPrice("");
        }
    };

    return (
        <div className="hidden-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full h-full overflow-y-scroll overflow-x-hidden">
            {allNfts.length > 0 &&
                allNfts.map(nft => (
                    <div className="h-[500px]" key={nft.id}>
                        <NftCard
                            isHome={false}
                            data={nft}
                            address={address}
                            setChangePriceNftInfo={setChangePriceNftInfo}
                        />
                    </div>
                ))}
            <dialog id="my_modal_1" className="daisy-modal">
                <div className="daisy-modal-box">
                    <h3 className="font-bold text-lg">Change Price</h3>
                    <input
                        type="number"
                        step={0.001}
                        min={0.001}
                        placeholder="New Price (ETH)"
                        className="daisy-input daisy-input-bordered w-full max-w-xs my-4"
                        onChange={e => setNewPrice(e.target.value)}
                        value={newPrice}
                        required
                    />
                    <div className="modal-action">
                        <form method="dialog">
                            <button
                                className="daisy-btn mr-4"
                                onClick={() => {
                                    setChangePriceNftInfo(null);
                                    setNewPrice("");
                                }}
                            >
                                Close
                            </button>
                            <button className="daisy-btn w-[180px]" onClick={handleChangePrice}>
                                {isLoading ? "Confirming..." : "Confirm"}
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default ListedPage;
