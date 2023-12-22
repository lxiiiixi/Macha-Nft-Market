import { useConnect, useAccount, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector, switchNetwork } from "@wagmi/core";
import { shortAddress } from "@/configs/utils";
import useBalance from "@/hooks/useBalance";
import { CHAIN_IDS } from "@/configs/configs";

function WalletConnectButton() {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const currentChainId = chain?.id;
    const balance = useBalance();

    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    const { disconnect } = useDisconnect();

    if (currentChainId && currentChainId !== CHAIN_IDS.BASE_GOERLI) {
        return (
            <>
                <div
                    className="daisy-tooltip daisy-tooltip-top"
                    data-tip="We only support base-goerli now"
                >
                    <button
                        className="daisy-btn daisy-btn-ghost"
                        onClick={async () =>
                            await switchNetwork({
                                chainId: CHAIN_IDS.BASE_GOERLI,
                            })
                        }
                    >
                        Switch Network
                    </button>
                </div>
                <button className="daisy-btn daisy-btn-ghost ml-2" onClick={() => disconnect()}>
                    Disconnect
                </button>
            </>
        );
    }

    if (isConnected && address) {
        return (
            <>
                <div
                    className="daisy-tooltip daisy-tooltip-bottom"
                    data-tip={
                        balance
                            ? `Balance: ${`${balance.formatted.slice(0, 6)} ${balance.symbol}`}`
                            : ""
                    }
                >
                    <button className="daisy-btn daisy-btn-ghost">{`${shortAddress(
                        address
                    )}`}</button>
                </div>
                <button className="daisy-btn daisy-btn-ghost ml-2" onClick={() => disconnect()}>
                    Disconnect
                </button>
            </>
        );
    }

    return (
        <button className="daisy-btn" onClick={() => connect()}>
            Connect Wallet
        </button>
    );
}

export default WalletConnectButton;
