import React, { useState } from 'react';
import { IoMdWallet } from "react-icons/io";

function Navbar({ account, balance, onConnect }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-4 text-white">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                <h1 className="text-2xl font-bold mb-2 sm:mb-0">Ether Balance App</h1>
                <div className="flex flex-wrap gap-4 sm:gap-10 items-center">
                    {account && balance && (
                     <div
                     className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 rounded-lg text-white font-bold flex items-center text-sm sm:text-base w-full max-w-xs sm:max-w-sm lg:max-w-md"
                   >
                     Address: <p className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">{account} ETH</p>
                   </div>
                   
                        
                    )}

                    <div
                        onClick={onConnect}
                        className="bg-gradient-to-r from-teal-500 cursor-pointer to-cyan-500 px-4 py-2 rounded-lg text-white font-bold flex items-center text-sm sm:text-base"
                    >
                        {balance ? (
                            <>
                                <IoMdWallet className="mr-2" />
                                <span>{balance} ETH</span>
                            </>
                        ) : (
                            <>
                                <IoMdWallet className="mr-2" />
                                Connect Wallet
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
