import { shortAddress, timestampToDate } from "@/configs/utils";
import type { TransactionStructType } from "@/App";
import { formatEther } from "viem";

function TansactionTable({ allTransactions }: { allTransactions: TransactionStructType[] }) {
    console.log(allTransactions);

    return (
        <div className="overflow-x-auto">
            <table className="daisy-table daisy-table-zebra">
                {/* head */}
                <thead>
                    <tr>
                        <th>Trasaction Id</th>
                        <th>Time</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {allTransactions.map(transaction => (
                        <tr key={transaction.id.toString()}>
                            <td>{transaction.id.toString()}</td>
                            <td>{timestampToDate(transaction.timestamp)}</td>
                            <td>{shortAddress(transaction.from)}</td>
                            <td>{shortAddress(transaction.to)}</td>
                            <td>{formatEther(transaction.cost)} ETH</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TansactionTable;
