import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import type { FetchBalanceResult } from "@wagmi/core";

function useBalance(): FetchBalanceResult | undefined {
    const [balance, setBalance] = useState<FetchBalanceResult>();
    const { address } = useAccount();

    useEffect(() => {
        const getBalance = async () => {
            try {
                const balanceResponse = await fetchBalance({
                    address: address as `0x${string}`,
                });
                setBalance(balanceResponse);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        getBalance();
    }, [address]);

    return balance;
}

export default useBalance;
