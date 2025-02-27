import { FC } from "react"
import classnames from "classnames"
import { useBlankState } from "../../context/background/backgroundHooks"
import BalanceLoadingSkeleton from "../skeleton/BalanceLoadingSkeleton"

interface TokenSummaryMembers {
    Balances: FC<{ children: React.ReactNode }>
    TokenBalance: FC<{
        title?: string
        children: React.ReactNode
        className?: string
    }>
    ExchangeRateBalance: FC<{ title?: string; children: React.ReactNode }>
    Actions: FC<{ children: React.ReactNode }>
}

const TokenSummary: FC<{
    minHeight?: string | number
    children: React.ReactNode
}> &
    TokenSummaryMembers = ({ children, minHeight }) => {
    return (
        <div
            className="flex flex-col items-center w-full p-4 justify-between rounded-md bg-primary-100 h-fit"
            style={{ minHeight: minHeight ?? "10rem" }}
        >
            {children}
        </div>
    )
}

const Balances = ({ children }: { children: React.ReactNode }) => {
    const state = useBlankState()!

    const isLoading =
        state.isNetworkChanging || state.isRatesChangingAfterNetworkChange

    return (
        <>
            {isLoading ? (
                <BalanceLoadingSkeleton />
            ) : (
                <div className="flex flex-col items-center space-y-1">
                    {children}
                </div>
            )}
        </>
    )
}

const TokenBalance: FC<{
    title?: string
    className?: string
    children: React.ReactNode
}> = ({ children, title, className }) => {
    return (
        <span
            className={classnames("text-2xl font-bold", className)}
            title={title}
        >
            {children}
        </span>
    )
}

const ExchangeRateBalance: FC<{
    title?: string
    children: React.ReactNode
}> = ({ children, title }) => {
    return (
        <span className="text-sm text-gray-600" title={title}>
            {children}
        </span>
    )
}

const Actions = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-row items-center justify-around w-full">
            {children}
        </div>
    )
}

TokenSummary.Balances = Balances
TokenSummary.TokenBalance = TokenBalance
TokenSummary.ExchangeRateBalance = ExchangeRateBalance
TokenSummary.Actions = Actions
export default TokenSummary
