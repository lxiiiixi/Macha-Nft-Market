import NftCard from "../common/NftCard";
import TansactionTable from "../TansactionTable";
import type { AddressType, RouteType, NFTDataType, TransactionStructType } from "@/App";
import { WeiboIcon, DiscordIcon, GithubIcon, XIcon } from "@/assets";
import { Cover } from "@/assets";

const displayNft: NFTDataType = {
    cost: 10000000000000000n,
    description: "",
    id: 0n,
    metadataURI: Cover,
    owner: "0x037B83c8C7E8169565B8E14C03aeCF1855428de1",
    timestamp: 1702788527n,
    title: "MCDD Crocodile Macha",
} as const;

function HomePage({
    address,
    allTransactions,
    switchRoute,
}: {
    address: AddressType | undefined;
    allTransactions: TransactionStructType[];
    switchRoute: (route: RouteType) => void;
}) {
    return (
        <div className="h-full flex gap-4 flex-col-reverse md:flex-row overflow-scroll hidden-scrollbar p-4">
            <div className="md:h-full md:w-3/5 flex flex-col gap-4">
                <div className="relative h-[220px] md:h-[40%] bg-[#fef3c7] text-left p-6 rounded-2xl">
                    <h1 className="text-xl sm:text-3xl xl:text-5xl font-bold !leading-tight">
                        Buy and Sell Digital Arts,
                        <br /> NFTs Collections
                    </h1>
                    <p className="text-lg lg:text-xl sm:!leading-10">
                        Mint and collect the hottest NFTs around.
                    </p>
                    <div className="absolute bottom-6 left-6 flex gap-4">
                        <div className="w-6 h-6 bg-gray-200/80 flex justify-center items-center rounded-lg hover:bg-gray-300/70 cursor-pointer">
                            <img src={WeiboIcon} className="w-4" />
                        </div>
                        <div className="w-6 h-6 bg-gray-200/80 flex justify-center items-center rounded-lg hover:bg-gray-300/70 cursor-pointer">
                            <img src={GithubIcon} className="w-4" />
                        </div>
                        <div className="w-6 h-6 bg-gray-200/80 flex justify-center items-center rounded-lg hover:bg-gray-300/70 cursor-pointer">
                            <img src={XIcon} className="w-4" />
                        </div>
                        <div className="w-6 h-6 bg-gray-200/80 flex justify-center items-center rounded-lg hover:bg-gray-300/70 cursor-pointer">
                            <img src={DiscordIcon} className="w-4" />
                        </div>
                    </div>
                    <div className="flex gap-4 absolute right-6 bottom-6">
                        <button className="daisy-btn" onClick={() => switchRoute("MINT")}>
                            Mint
                        </button>
                        <button className="daisy-btn" onClick={() => switchRoute("LISTED")}>
                            See All
                        </button>
                    </div>
                </div>
                <div className="h-[60%] bg-pink-100/60 rounded-2xl shadow-xl">
                    <TansactionTable allTransactions={allTransactions} />
                </div>
            </div>
            <div className="md:h-full md:w-2/5 h-[650px]">
                <NftCard isHome data={displayNft} address={address} />
            </div>
        </div>
    );
}

export default HomePage;
