import { FunctionComponent, useRef, useState } from "react"
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri"
import { BsCheck } from "react-icons/bs"
import { useHistory } from "react-router-dom"

import ClickableText from "../button/ClickableText"
import { useBlankState } from "../../context/background/backgroundHooks"
import classnames from "classnames"
import { useOnClickOutside } from "../../util/useOnClickOutside"
import { changeNetwork, setShowTestNetworks } from "../../context/commActions"
import TransparentOverlay from "../loading/TransparentOverlay"
import { Network } from "@block-wallet/background/utils/constants/networks"
import classNames from "classnames"
import { sortNetworksByOrder } from "../../util/networkUtils"

const NetworkOption: FunctionComponent<{
    option: Network
    selectedNetwork: string
    handleNetworkChange: (network: string) => void
    disabled?: boolean
}> = ({ option, selectedNetwork, handleNetworkChange, disabled = false }) => (
    <li
        title={option.desc}
        className={classnames(
            "cursor-pointer flex flex-row justify-between pl-2 pr-2 pt-1 pb-1 items-center hover:bg-gray-100",
            !option.enable && "bg-gray-200 pointer-events-none",
            disabled && "opacity-50 pointer-events-none",
            option.name === selectedNetwork && "pointer-events-none"
        )}
        onClick={async () => await handleNetworkChange(option.name)}
    >
        <span
            className={classnames(
                "leading-loose text-ellipsis overflow-hidden whitespace-nowrap",
                selectedNetwork === option.name && "font-bold"
            )}
        >
            {option.desc}
        </span>
        {selectedNetwork === option.name && <BsCheck size={16} />}
    </li>
)

const NetworkSelect: FunctionComponent<{
    className?: string
    optionsContainerClassName?: string
}> = ({ className, optionsContainerClassName }) => {
    const history = useHistory()!
    const [networkList, setNetworkList] = useState(false)
    const {
        selectedNetwork,
        availableNetworks,
        showTestNetworks,
        isNetworkChanging,
        isRatesChangingAfterNetworkChange,
        isImportingDeposits,
        isUserNetworkOnline,
    } = useBlankState()!
    const ref = useRef(null)
    useOnClickOutside(ref, () => setNetworkList(false))

    const handleNetworkChange = (network: string) => {
        setNetworkList(false)
        changeNetwork(network)
    }

    const getNetworkDesc = (): string => {
        const networkName = selectedNetwork.toUpperCase()
        return availableNetworks[networkName].desc
    }

    return (
        <div
            className={`relative ${className}`}
            ref={ref}
            role="menu"
            data-testid="network-selector"
        >
            {(isNetworkChanging || isRatesChangingAfterNetworkChange) && (
                <TransparentOverlay />
            )}
            <div
                onClick={() => {
                    if (!isImportingDeposits) {
                        setNetworkList(!networkList)
                    }
                }}
                className={classNames(
                    "relative flex flex-row justify-between items-center p-1 px-2 pr-1 text-gray-600 border rounded-md group border-primary-200 w-40 text-xs hover:border-primary-300",
                    !isImportingDeposits
                        ? "cursor-pointer select-none"
                        : "disabled:pointer-events-none opacity-50",
                    networkList && "border-primary-300"
                )}
            >
                <span
                    data-testid="selected-network"
                    className="select-none w-36 text-ellipsis overflow-hidden whitespace-nowrap"
                >
                    {getNetworkDesc()}
                </span>
                {networkList ? (
                    <RiArrowUpSLine size={16} />
                ) : (
                    <RiArrowDownSLine size={16} />
                )}
            </div>

            <div
                hidden={!networkList}
                className={`absolute shadow-md rounded-md w-48 max-h-96 overflow-y-auto mt-2 bg-white z-50 select-none ${optionsContainerClassName}`}
            >
                <ul className="text-xs">
                    {Object.values(availableNetworks)
                        .filter((n) => n.enable && !n.test)
                        .sort(sortNetworksByOrder)
                        .map((option) => (
                            <NetworkOption
                                key={option.chainId}
                                option={option}
                                selectedNetwork={selectedNetwork}
                                handleNetworkChange={handleNetworkChange}
                                disabled={!isUserNetworkOnline}
                            />
                        ))}
                    <li
                        key="test"
                        className="cursor-pointer flex flex-row justify-between pl-2 pr-2 pt-1 pb-1 items-center border-t border-t-gray-200 border-b border-b-gray-200 hover:bg-gray-100"
                        onClick={() => setShowTestNetworks(!showTestNetworks)}
                    >
                        <label
                            className="leading-loose text-gray-500 cursor-pointer"
                            htmlFor="showTestNetworks"
                        >
                            Show Test Networks
                        </label>
                        <input
                            id="showTestNetworks"
                            type="checkbox"
                            className="border-2 border-gray-200 rounded-md focus:ring-0 cursor-pointer"
                            checked={showTestNetworks}
                            onChange={() => {}}
                        />
                    </li>
                    {showTestNetworks &&
                        Object.values(availableNetworks)
                            .filter((n) => n.enable && n.test)
                            .sort(sortNetworksByOrder)
                            .map((option) => (
                                <NetworkOption
                                    key={option.chainId}
                                    option={option}
                                    selectedNetwork={selectedNetwork}
                                    handleNetworkChange={handleNetworkChange}
                                    disabled={
                                        !isUserNetworkOnline &&
                                        !option.name
                                            .toLowerCase()
                                            .includes("localhost")
                                    }
                                />
                            ))}
                    <li
                        className={`${
                            showTestNetworks
                                ? "border-t border-t-gray-200 border-b border-b-gray-200"
                                : ""
                        } hover:bg-gray-100`}
                    >
                        <ClickableText
                            className={`cursor-pointer flex flex-row justify-between pl-2 pr-2 pt-1 pb-1 leading-loose items-center w-full rounded-none`}
                            onClick={() =>
                                history.push({
                                    pathname: "/settings/networks",
                                    state: { isFromHomePage: true },
                                })
                            }
                        >
                            Edit Networks
                        </ClickableText>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NetworkSelect
