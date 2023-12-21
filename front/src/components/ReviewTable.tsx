import React from "react";
import type { NFTDataType } from "@/App";
import { shortAddress, timestampToDate } from "@/configs/utils";
import { formatEther } from "viem";

type DisplayedReviewListType = NFTDataType & { checked: boolean };

function ReviewTable({
    isOwner,
    reviewLists,
    handleSingleMint,
}: {
    isOwner: boolean;
    reviewLists: NFTDataType[];
    handleSingleMint: (id: bigint, metadataURI: string) => void;
}) {
    const defaultCheckedLists = reviewLists.map(item => ({ ...item, checked: true }));
    const defaultNoCheckedLists = reviewLists.map(item => ({ ...item, checked: false }));
    const [displayedReviewLists, setDisplayedReviewLists] =
        React.useState<DisplayedReviewListType[]>(defaultCheckedLists);

    const ifAllChecked = displayedReviewLists.every(item => item.checked);

    const setSingleChecked = (id: bigint, metadataURI: string, checked: boolean) => {
        setDisplayedReviewLists(
            displayedReviewLists.map(item => {
                if (id === item.id && item.metadataURI === metadataURI) {
                    return { ...item, checked };
                }
                return item;
            })
        );
    };
    console.log(displayedReviewLists);

    return (
        <div className="w-full">
            <table className="daisy-table">
                {/* head */}
                <thead>
                    <tr>
                        <th>
                            <label>
                                <input
                                    type="checkbox"
                                    className="daisy-checkbox"
                                    checked={ifAllChecked}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setDisplayedReviewLists(defaultCheckedLists);
                                        } else {
                                            setDisplayedReviewLists(defaultNoCheckedLists);
                                        }
                                    }}
                                />
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
                    {displayedReviewLists.map(item => {
                        const {
                            id,
                            metadataURI,
                            title,
                            description,
                            owner,
                            timestamp,
                            cost,
                            checked,
                        } = item;
                        return (
                            <tr key={id}>
                                <th>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="daisy-checkbox"
                                            checked={checked}
                                            onChange={e => {
                                                setSingleChecked(id, metadataURI, e.target.checked);
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
