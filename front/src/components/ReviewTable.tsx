import React from "react";
import type { NFTDataType } from "@/App";
import { shortAddress, timestampToDate } from "@/configs/utils";
import { formatEther } from "viem";

function ReviewTable({
    isOwner,
    reviewLists,
    handleSingleMint,
}: {
    isOwner: boolean;
    reviewLists: NFTDataType[];
    handleSingleMint: (id: bigint, metadataURI: string) => void;
}) {
    return (
        <div className="w-full">
            <table className="daisy-table">
                {/* head */}
                <thead>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="daisy-checkbox" />
                            </label>
                        </th>
                        <th>Meta</th>
                        <th>Owner</th>
                        <th>Cost</th>
                        <th>Time</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {reviewLists.map(item => {
                        const { id, metadataURI, title, description, owner, timestamp, cost } =
                            item;
                        return (
                            <tr key={id}>
                                <th>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="daisy-checkbox"
                                            onChange={e => {
                                                console.log(e.target.checked);
                                            }}
                                        />
                                    </label>
                                </th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="daisy-avatar">
                                            <div className="daisy-mask daisy-mask-squircle w-12 h-12">
                                                <img src={metadataURI} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{title}</div>
                                            <div className="text-sm opacity-50">{description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{shortAddress(owner)}</td>
                                <td>{formatEther(cost)} ETH</td>
                                <td>{timestampToDate(timestamp)}</td>
                                <th>
                                    <button
                                        className="daisy-btn daisy-btn-ghost daisy-btn-xs"
                                        disabled={!isOwner}
                                        onClick={() => handleSingleMint(id, metadataURI)}
                                    >
                                        Mint
                                    </button>
                                </th>
                            </tr>
                        );
                    })}
                </tbody>
                {/* foot */}
                <tfoot>
                    <tr>
                        <th>
                            <button className="daisy-btn daisy-btn-sm" disabled={!isOwner}>
                                Mint
                            </button>
                        </th>
                        <th>
                            <button className="daisy-btn daisy-btn-sm" disabled={!isOwner}>
                                Cancel
                            </button>
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default ReviewTable;
