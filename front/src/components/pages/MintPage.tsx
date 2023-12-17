import { useState, ChangeEvent } from "react";
import { parseEther } from "viem";
import { writeContract } from "@wagmi/core";
import { CONTRACT_CONFIG, COST } from "@/configs/configs";
import { useAccount } from "wagmi";

// import { create } from "ipfs-http-client";
// const auth = "Basic " + btoa(INFURIA_PID + ":" + INFURIA_API);
// const client = create({
//     host: "ipfs.infura.io",
//     port: 5001,
//     protocol: "https",
//     headers: {
//         authorization: auth,
//     },
// });

// 81ae8013770233d
// d85674cbcd7415319f9b540e4ab958249999d5f4

function MintPage({
    reloadData,
    setAlertContent,
}: {
    reloadData: () => void;
    setAlertContent: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [metadataURI, setMetadataURI] = useState(""); // 最终上传的这个地址
    const [fileUrl, setFileUrl] = useState<File>(); // 要上传到服务器的图片
    const [imgBase64, setImgBase64] = useState<null | string>(null); // base64(display)
    const { address } = useAccount();

    const mintNFT = async (
        title: string,
        description: string,
        metadataURI: string,
        salesPrice: bigint
    ) => {
        if (address) {
            const { hash } = await writeContract({
                ...CONTRACT_CONFIG,
                functionName: "payToMint",
                args: [title, description, metadataURI, salesPrice],
                value: parseEther(COST), // mint 最少需要 0.001 eth
                account: address,
            });
            reloadData();
            setAlertContent("Success! Transaction hash: " + hash);
        } else {
            setAlertContent("Please connect your wallet");
        }
    };

    const submitMint = () => {
        if (!title || !price || !description || !metadataURI) {
            setAlertContent("Please fill in the complete information");
            return;
        } else {
            mintNFT(title, description, metadataURI, parseEther(price));
        }
    };

    const changeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const targetFile = e.target.files![0];
        console.log(targetFile);

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
            // formData.append("key", "0f45e2d1368079f611fc10905c208c7b"); // Replace with your Imgbb API key
            // formData.append("image", imgBase64.replace("data:", "").replace(/^.+,/, ""));
            formData.append("image", fileUrl);

            try {
                const response = await fetch(
                    "https://api.imgbb.com/1/upload?key=" + "0f45e2d1368079f611fc10905c208c7b",
                    {
                        method: "POST",
                        body: formData,
                    }
                );
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
            <div className="w-[40%] h-full daisy-skeleton flex justify-center items-center">
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
                    <label className="form-control w-full max-w-xs flex items-end justify-between">
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
                    <label className="form-control w-full max-w-xs">
                        <div className="daisy-label">
                            <span className="daisy-label-text">MetadataURI</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="daisy-input daisy-input-bordered w-full max-w-xs"
                            onChange={e => setMetadataURI(e.target.value)}
                            value={metadataURI}
                            required
                        />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="daisy-label">
                            <span className="daisy-label-text">Title</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="daisy-input daisy-input-bordered w-full max-w-xs"
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                            required
                        />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="daisy-label">
                            <span className="daisy-label-text">Price (ETH)</span>
                        </div>
                        <input
                            type="number"
                            step={0.001}
                            min={0.001}
                            placeholder="Type here"
                            className="daisy-input daisy-input-bordered w-full max-w-xs"
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
                            placeholder="Bio"
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            required
                        ></textarea>
                    </label>
                    <p className="text-sm text-gray-600 text-left">
                        Mint A nft will cost you 0.001 ETH
                    </p>
                    <button className="daisy-btn daisy-btn-outline " onClick={submitMint}>
                        Mint
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MintPage;
