import { useConnect, useAccount, useDisconnect } from "wagmi";
import { InjectedConnector } from "@wagmi/core";
import { shortAddress } from "@/configs/utils";
import useBalance from "@/hooks/useBalance";

function WalletConnectButton() {
    const { address, isConnected } = useAccount();
    const balance = useBalance();

    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    const { disconnect } = useDisconnect();

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
