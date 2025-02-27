import { Network } from "@block-wallet/background/utils/constants/networks"
import { classnames } from "../../styles"
import GenericTooltip from "../label/GenericTooltip"

const NetworkDisplayBadge = ({
    network,
    iconColor = "bg-green-500",
    className,
    fill = false,
    truncate = false,
}: {
    network: Network | string
    iconColor?: string
    fill?: boolean
    truncate?: boolean
    className?: string
}) => {
    const networkName = typeof network === "string" ? network : network.desc

    // We limit the string chars here regardless of the truncate flag
    // and the truncate class to prevent issues with the animated bullet size
    // and to have a limit on huge network descriptions.
    const formattedNetworkName = truncate
        ? networkName.length > 42
            ? `${networkName.slice(0, 42)}...`
            : networkName
        : networkName
    return (
        <div
            className={classnames(
                "flex flex-row items-center justify-center space-x-1 py-1.5 px-1.5 text-gray-600 rounded-md group border border-primary-200 text-xs",
                fill && "bg-green-100",
                "w-auto",
                className
            )}
        >
            <span
                className={`rounded-full h-2 w-2  animate-pulse ${iconColor} pointer-events-none`}
            />
            <span
                className={classnames(
                    truncate
                        ? "truncate ..."
                        : "whitespace-normal break-all flex-1"
                )}
                style={truncate ? { maxWidth: 110 } : {}}
            >
                {formattedNetworkName}
            </span>
            <GenericTooltip
                left
                className="translate-y-5 translate-x-3 shadow-md min-w-max"
                content={<p className=" p-1 text-left">{networkName}</p>}
            />
        </div>
    )
}

export default NetworkDisplayBadge
