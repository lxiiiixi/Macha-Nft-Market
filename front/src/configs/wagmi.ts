import { createConfig, configureChains } from "wagmi";
import { baseGoerli } from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { ALCHEMY_BASE_GOERLI_API_KEY } from "./envs";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [baseGoerli],
    [alchemyProvider({ apiKey: ALCHEMY_BASE_GOERLI_API_KEY }), publicProvider()]
);
const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
});

export { config, chains };
