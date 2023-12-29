import timeless from "@/abis/timeless.json";
import type { Abi } from "viem";

export const MINT_FEE = "0.01";
export const TRANSACTION_FEE = "0.001";
export const CONTRACT_CONFIG = {
    address: "0x342A91f61cE87aFC47413d8FB96aF85C8B959d22" as `0x${string}`,
    abi: timeless as Abi,
};

export const OWNER_ADDRESS = "0x037B83c8C7E8169565B8E14C03aeCF1855428de1";

export const CHAIN_IDS = {
    BASE_GOERLI: 84531,
};
