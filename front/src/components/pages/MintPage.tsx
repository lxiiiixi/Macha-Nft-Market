import { useState, ChangeEvent, ReactNode, useEffect } from "react";
import { parseEther } from "viem";
import { useContractWrite } from "wagmi";
import { CONTRACT_CONFIG, MINT_FEE, TRANSACTION_FEE, OWNER_ADDRESS } from "@/configs/configs";
import { useAccount } from "wagmi";
import { IMGBB_API } from "@/configs/envs";

function MintPage({
    setAlertContent,
}: {
    setAlertContent: React.Dispatch<React.SetStateAction<ReactNode>>;
}) {
    const title = "MCDD Crocodile Macha";
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [metadataURI, setMetadataURI] = useState(""); // 最终上传的这个地址
    const [fileUrl, setFileUrl] = useState<File>(); // 要上传到服务器的图片
    const [imgBase64, setImgBase64] = useState<null | string>(null); // base64(display)
    const { address } = useAccount();
    const isOwner = !!address && address === OWNER_ADDRESS;
    const {
        data: data1,
        isLoading: isLoading1,
        isSuccess: isSuccess1,
        write: writeSubmitTobeReviewedList,
    } = useContractWrite({
        ...CONTRACT_CONFIG,
        functionName: "submitTobeReviewedList",
        account: address,
    });

    const {
        data: data2,
        isLoading: isLoading2,
        isSuccess: isSuccess2,
        write: writeMintByOwner,
    } = useContractWrite({
        ...CONTRACT_CONFIG,
        functionName: "mintByOwner",
        account: address,
    });

    useEffect(() => {
        if (isSuccess1 && data1) {
            setAlertContent("Success!" + data1);
        }
        if (isSuccess2 && data2) {
            setAlertContent("Success!" + data2);
        }
    }, [isSuccess1, data1, isSuccess2, data2, setAlertContent]);

    const submitMintNFT = async (
        title: string,
        description: string,
        metadataURI: string,
        salesPrice: bigint
    ) => {
        writeSubmitTobeReviewedList({
            args: [title, description, metadataURI, salesPrice],
            value: parseEther(MINT_FEE) + parseEther(TRANSACTION_FEE), // mint 最少需要 0.001 eth
        });
    };

    const mintByOwner = async (
        title: string,
        description: string,
        metadataURI: string,
        salesPrice: bigint
    ) => {
        writeMintByOwner({
            args: [title, description, metadataURI, salesPrice],
            value: parseEther(MINT_FEE),
        });
        setAlertContent("Success!" + data2);
        // setAlertContent("Success! Transaction hash: " + hash);
    };

    const submitMint = () => {
        if (address) {
            if (!title || !price || !description || !metadataURI) {
                setAlertContent("Please fill in the complete information");
                return;
            } else {
                if (isOwner) {
                    mintByOwner(title, description, metadataURI, parseEther(price));
                } else {
                    submitMintNFT(title, description, metadataURI, parseEther(price));
                }
            }
        } else {
            setAlertContent("Please connect your wallet");
        }
    };

    const changeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const targetFile = e.target.files![0];

        if (targetFile) reader.readAsDataURL(targetFile);

        reader.onload = readerEvent => {
            const file = readerEvent.target!.result;
            setImgBase64(file as string);
            setFileUrl(targetFile);
        };
    };

    const uploadToIpfs = async () => {
        const formData = new FormData();
        if (fileUrl) {
            formData.append("image", fileUrl);
            try {
                const response = await fetch("https://api.imgbb.com/1/upload?key=" + IMGBB_API, {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    const displayUrl = data.data.display_url;
                    setMetadataURI(displayUrl);
                    console.log("data", data);
                    console.log("Uploaded Image URL:", data.data.display_url);
                } else {
                    console.error("Error uploading file:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    return (
        <div className="h-full flex gap-4">
            <div className="relative group w-[40%] h-full daisy-skeleton flex justify-center items-center m-2">
                <span className="absolute top-4 left-0 px-10 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    You can only select the picture including the crocodile Macha, otherwise you may
                    fail to pass the review.
                </span>
                {imgBase64 && (
                    <img
                        alt="NFT"
                        className="w-[90%] object-cover cursor-pointer"
                        src={imgBase64}
                    />
                )}
            </div>
            <div className="w-[60%] h-full flex justify-center items-center">
                <div className="w-[70%] flex flex-col justify-start gap-2">
                    <label className="form-control w-full flex items-end justify-between">
                        <div>
                            <div className="daisy-label">
                                <span className="daisy-label-text">Pick an image</span>
                            </div>
                            <button
                                className="rounded-lg block w-[120px] h-[28px] border border-gray-300 bg-white text-gray-400"
                                onClick={() => document.getElementById("getFile")!.click()}
                            >
                                Click here
                            </button>
                            <input
                                type="file"
                                id="getFile"
                                accept="image/png, image/gif, image/jpeg, image/webp"
                                style={{ display: "none" }}
                                onChange={changeImage}
                            ></input>
                        </div>
                        <button className="daisy-btn daisy-btn-sm" onClick={uploadToIpfs}>
                            Upload To IPFS
                        </button>
                    </label>
                    <label className="form-control w-full">
                        <div className="daisy-label">
                            <span className="daisy-label-text">MetadataURI</span>
                        </div>
                        <input
                            type="text"
                            placeholder="It will be generated automatically by uploading pictures."
                            className="daisy-input daisy-input-bordered w-full"
                            onChange={e => setMetadataURI(e.target.value)}
                            value={metadataURI}
                            // disabled
                            required
                        />
                    </label>
                    <label className="form-control w-full">
                        <div className="daisy-label">
                            <span className="daisy-label-text">Title</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="daisy-input daisy-input-bordered w-full"
                            // onChange={e => setTitle(e.target.value)}
                            defaultValue={title}
                            readOnly
                            required
                        />
                    </label>
                    <label className="form-control w-full">
                        <div className="daisy-label">
                            <span className="daisy-label-text">Price (ETH)</span>
                        </div>
                        <input
                            type="number"
                            step={0.01}
                            min={0.01}
                            placeholder="Others can buy your nft at this price."
                            className="daisy-input daisy-input-bordered w-full"
                            onChange={e => setPrice(e.target.value)}
                            value={price}
                            required
                        />
                    </label>
                    <label className="form-control w-full">
                        <div className="daisy-label">
                            <span className="daisy-label-text">Description</span>
                        </div>
                        <textarea
                            className="daisy-textarea daisy-textarea-bordered w-full"
                            placeholder="A short sentence description"
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            required
                        ></textarea>
                    </label>
                    <p className="text-sm text-gray-600 text-left">
                        You will pay {MINT_FEE} ETH as mint fee and {TRANSACTION_FEE} as transaction
                        execution fee.
                    </p>
                    <div
                        className="daisy-tooltip daisy-tooltip-bottom w-full daisy-tooltip::before:w-[300px]"
                        data-tip={
                            "Please check the information you are about to upload before submission. If the review fails, the mint fee will be refunded to you, but the execution fee will not be refunded."
                        }
                    >
                        <button className="daisy-btn daisy-btn-outline w-full" onClick={submitMint}>
                            {isLoading1 || isLoading2 ? (
                                <div className="relative">
                                    Submitting
                                    <span className="daisy-loading daisy-loading-dots daisy-loading-xs absolute -bottom-1 -right-5"></span>
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MintPage;
