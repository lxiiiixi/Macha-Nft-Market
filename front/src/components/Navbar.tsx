import WalletConnectButton from "./WalletConnectButton";
import type { RouteType } from "@/App";
import { Logo } from "@/assets";

function Navbar({
    route,
    switchRoute,
}: {
    route: RouteType;
    switchRoute: (item: RouteType) => void;
}) {
    const NavList = () => {
        return (
            <>
                {["Home", "Mint", "Review", "Listed"].map(item => (
                    <li
                        key={item}
                        className={`${route === item.toLocaleUpperCase() ? "font-bold" : ""}`}
                        onClick={() => switchRoute(item.toLocaleUpperCase() as RouteType)}
                    >
                        <a>{item}</a>
                    </li>
                ))}
            </>
        );
    };

    return (
        <div className="daisy-navbar bg-[#83951c]/50 rounded-2xl">
            <div className="daisy-navbar-start">
                <div className="daisy-dropdown">
                    <div tabIndex={0} role="button" className="daisy-btn daisy-btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="daisy-menu daisy-menu-sm daisy-dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <NavList />
                    </ul>
                </div>
                <div className="w-[160px] h-[50px] ml-1 bg-white rounded-lg overflow-hidden flex justify-center items-center cursor-pointer">
                    <img
                        src={Logo}
                        className="w-full hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>
            <div className="daisy-navbar-center hidden lg:flex">
                <ul className="daisy-menu daisy-menu-horizontal px-1">
                    <NavList />
                </ul>
            </div>
            <div className="daisy-navbar-end">
                <WalletConnectButton />
            </div>
        </div>
    );
}

export default Navbar;
