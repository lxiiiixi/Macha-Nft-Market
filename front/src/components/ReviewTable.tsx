import React from "react";
import type { NFTDataType } from "@/App";
import { shortAddress, timestampToDate } from "@/configs/utils";
import { formatEther } from "viem";

type DisplayedReviewListType = NFTDataType & { checked: boolean };

function ReviewTable({
    isOwner,
    reviewLists,
    handleSingleMint,
    handleMultiMint,
    removeReviewedListByIndex,
    removeMultipleReviewedListByindices,
}: {
    isOwner: boolean;
    reviewLists: NFTDataType[];
    handleSingleMint: (id: bigint, metadataURI: string) => void;
    handleMultiMint: (id: bigint[], metadataURI: string[]) => void;
    removeReviewedListByIndex: (id: bigint, metadataURI: string) => void;
    removeMultipleReviewedListByindices: (id: bigint[], metadataURI: string[]) => void;
}) {
    const defaultCheckedLists = reviewLists.map(item => ({ ...item, checked: true }));
    const defaultNoCheckedLists = reviewLists.map(item => ({ ...item, checked: false }));
    const [displayedReviewLists, setDisplayedReviewLists] =
        React.useState<DisplayedReviewListType[]>(defaultNoCheckedLists);

    const ifAllChecked = displayedReviewLists.every(item => item.checked);
    const ifOneChecked = displayedReviewLists.some(item => item.checked);

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

    const filterCheckedIdAndMetadataURI = () => {
        const idList = displayedReviewLists.filter(item => item.checked).map(item => item.id);
        const metadataURIList = displayedReviewLists
            .filter(item => item.checked)
            .map(item => item.metadataURI);
        return { idList, metadataURIList };
    };

    const handleCheckedMultiMint = () => {
        const { idList, metadataURIList } = filterCheckedIdAndMetadataURI();
        handleMultiMint(idList, metadataURIList);
    };

    const handleCheckedMultiCancel = () => {
        const { idList, metadataURIList } = filterCheckedIdAndMetadataURI();
        removeMultipleReviewedListByindices(idList, metadataURIList);
    };

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
                                    <div
                                        className={
                                            isOwner ? "" : "daisy-tooltip daisy-tooltip-left"
                                        }
                                        data-tip={isOwner ? "" : "Only owner can operate"}
                                    >
                                        <button
                                            className="daisy-btn daisy-btn-ghost daisy-btn-xs mr-1"
                                            disabled={!isOwner}
                                            onClick={() =>
                                                removeReviewedListByIndex(id, metadataURI)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="daisy-btn daisy-btn-ghost daisy-btn-xs"
                                            disabled={!isOwner}
                                            onClick={() => handleSingleMint(id, metadataURI)}
                                        >
                                            Mint
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        );
                    })}
                </tbody>
                {/* foot */}
                <tfoot>
                    <tr>
                        <th>
                            <div
                                className={isOwner ? "" : "daisy-tooltip daisy-tooltip-right"}
                                data-tip={isOwner ? "" : "Only owner can operate"}
                            >
                                <button
                                    className="daisy-btn daisy-btn-sm mr-2"
                                    disabled={!isOwner || !ifOneChecked}
                                    onClick={handleCheckedMultiMint}
                                >
                                    Mint
                                </button>
                                <button
                                    className="daisy-btn daisy-btn-sm"
                                    disabled={!isOwner || !ifOneChecked}
                                    onClick={handleCheckedMultiCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default ReviewTable;
