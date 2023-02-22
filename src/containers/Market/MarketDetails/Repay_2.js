import { Button, message, Select, Slider } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setBalanceRefresh } from "../../../actions/account";
import {
    Col,
    NoDataIcon,
    Row,
    SvgIcon,
    TooltipIcon
} from "../../../components/common";
import CustomRow from "../../../components/common/Asset/CustomRow";
import Details from "../../../components/common/Asset/Details";
import AssetStats from "../../../components/common/Asset/Stats";
import CustomInput from "../../../components/CustomInput";
import HealthFactor from "../../../components/HealthFactor";
import { ValidateInputNumber } from "../../../config/_validation";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { queryAllBorrowByOwnerAndPool, queryLendPair } from "../../../services/lend/query";
import {
    amountConversion,
    amountConversionWithComma,
    denomConversion,
    getAmount,
    getDenomBalance
} from "../../../utils/coin";
import {
    commaSeparator,
    decimalConversion,
    marketPrice
} from "../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import ActionButton from "../../Myhome/BorrowRepay/ActionButton";
// import ActionButton from "./ActionButton";
import "./index.less";

const { Option } = Select;

const RepayTab_2 = ({
    lang,
    dataInProgress,
    // borrowPosition,
    pool,
    assetMap,
    balances,
    address,
    refreshBalance,
    refreshBorrowPosition,
    setBalanceRefresh,
    markets,
    // pair,
    assetDenomMap,
}) => {
    const [amount, setAmount] = useState();
    const [validationError, setValidationError] = useState();
    const [assetList, setAssetList] = useState();
    const [borrowPosition, setBorrowPosition] = useState()
    const [selectedAssetId, setSelectedAssetId] = useState(0)
    const [availableBalance, setAvailableBalance] = useState(0)
    const [updatedAmountOut, setUpdatedAmountOut] = useState(0)
    const [selectedBorrowPosition, setSelectedBorrowPosition] = useState([])
    const [pair, setPair] = useState()


    // const selectedAssetId = pair?.assetOut?.toNumber();
    // const availableBalance =
    //   getDenomBalance(balances, assetMap[selectedAssetId]?.denom) || 0;

    // let updatedAmountOut =
    //   Number(borrowPosition?.amountOut?.amount) +
    //   Number(decimalConversion(borrowPosition?.interestAccumulated));


    const fetchAllBorrowByOwnerAndPool = (address, poolId,) => {
        queryAllBorrowByOwnerAndPool(address, poolId, (error, result) => {
            if (error) {
                message.error(error);
                return;
            }

            setBorrowPosition(result?.borrows)
        });
    };




    useEffect(() => {
        fetchAllBorrowByOwnerAndPool(address, pool?.poolId)
    }, [address, pool])


    useEffect(() => {
        if (pool?.poolId) {
            setAssetList([
                assetMap[pool?.transitAssetIds?.main?.toNumber()],
                assetMap[pool?.transitAssetIds?.first?.toNumber()],
                assetMap[pool?.transitAssetIds?.second?.toNumber()],
            ]);
        }
    }, [pool]);

    const handleInputChange = (value) => {
        value = toDecimals(
            value,
            assetDenomMap[borrowPosition?.amountOut?.denom]?.decimals
        )
            .toString()
            .trim();

        setAmount(value);
        setValidationError(
            ValidateInputNumber(
                getAmount(
                    value,
                    assetDenomMap[borrowPosition?.amountOut?.denom]?.decimals
                ),
                availableBalance,
                "repay",
                updatedAmountOut
            )
        );
    };

    const handleRefresh = () => {
        refreshBorrowPosition();
        setBalanceRefresh(refreshBalance + 1);
        setAmount();
    };

    const handleMaxRepay = () => {
        handleInputChange(
            amountConversion(
                updatedAmountOut,
                assetDenomMap[borrowPosition?.amountOut?.denom]?.decimals
            )
        );
    };

    const handleAssetChange = (value) => {
        console.log(value, "Selected asset");
        setAvailableBalance(getDenomBalance(balances, borrowPosition[value]?.amountOut?.denom) || 0)
        setUpdatedAmountOut(
            Number(borrowPosition[value]?.amountOut?.amount) +
            Number(decimalConversion(borrowPosition[value]?.interestAccumulated))
        )
        // setSelectedAssetId(borrowPosition[value]?.amountOut?.denom)
        setSelectedBorrowPosition(borrowPosition[value])

        queryLendPair(borrowPosition[value]?.pairId, (error, result) => {
            if (error) {
                message.error(error);
                return;
            }
            // setPair(result?.ExtendedPair);
            console.log(result, "lend pair result");
            setSelectedAssetId(result?.ExtendedPair?.assetOut?.toNumber())
            setPair(result?.ExtendedPair)
        });

        // setAmount(0);
        // setValidationError();
    };

    const handleSliderChange = (value) => {
        handleInputChange(String(value))
    }


    const marks = {
        0: "0%",
        // 50: '50%',
        [amountConversionWithComma(
            updatedAmountOut,
            assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
        )]: "100%",
    };

    return (
        <div className="details-wrapper market-details-wrapper">
            <div className="details-left commodo-card">
                <CustomRow assetList={assetList} poolId={pool?.poolId?.low} />
                <div className="assets-select-card mb-3">
                    <div className="assets-left">
                        <label className="left-label">Repay Asset</label>
                        <div className="assets-select-wrapper">
                            <div className="assets-select-wrapper">
                                <Select
                                    className="assets-select"
                                    popupClassName="asset-select-dropdown"
                                    // defaultValue="1"
                                    onChange={handleAssetChange}
                                    placeholder={
                                        <div className="select-placeholder">
                                            <div className="circle-icon">
                                                <div className="circle-icon-inner" />
                                            </div>
                                            Select
                                        </div>
                                    }
                                    defaultActiveFirstOption={true}
                                    showArrow={true}
                                    // disabled
                                    notFoundContent={<NoDataIcon />}
                                >
                                    {
                                        borrowPosition?.length > 0 && borrowPosition?.map((item, index) => {
                                            return (
                                                <Option key={index}>
                                                    <div className="select-inner">
                                                        <div className="svg-icon">
                                                            <div className="svg-icon-inner">
                                                                <SvgIcon
                                                                    name={iconNameFromDenom(
                                                                        // assetMap[selectedAssetId]?.denom
                                                                        item?.amountOut?.denom
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="name">
                                                            {/* {denomConversion(assetMap[selectedAssetId]?.denom)} */}
                                                            {denomConversion(item?.amountOut?.denom)}
                                                        </div>
                                                    </div>
                                                </Option>
                                            )
                                        })
                                    }

                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="assets-right">
                        <div className="label-right">
                            Available
                            <span className="ml-1">
                                {amountConversionWithComma(
                                    availableBalance,
                                    assetMap[selectedAssetId]?.decimals
                                    // assetDenomMap[selectedAssetId]?.decimals

                                )}{" "}
                                {denomConversion(assetMap[selectedAssetId]?.denom)}
                                {/* {denomConversion(selectedAssetId)} */}
                            </span>
                        </div>
                        <div>
                            <div className="input-select">
                                <CustomInput
                                    value={amount}
                                    onChange={(event) => handleInputChange(event.target.value)}
                                    validationError={validationError}
                                />{" "}
                            </div>
                            <small>
                                $
                                {commaSeparator(
                                    Number(
                                        amount *
                                        marketPrice(
                                            markets,
                                            assetMap[selectedAssetId]?.denom,
                                            selectedAssetId
                                        ) || 0
                                    ).toFixed(DOLLAR_DECIMALS)
                                )}{" "}
                            </small>{" "}
                        </div>
                    </div>
                </div>
                <Row>
                    <Col sm="12" className="mt-2 mx-auto card-bottom-details">
                        <Row>
                            <Col>
                                <label>Remaining to Repay</label>
                            </Col>
                            <Col className="text-right">
                                <div className="d-flex justify-content-end">
                                    <div className="cursor-pointer" onClick={handleMaxRepay}>
                                        {amountConversionWithComma(
                                            updatedAmountOut,
                                            // assetDenomMap[borrowPosition?.amountOut?.denom]?.decimals
                                            assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
                                            // assetDenomMap[selectedAssetId]?.decimals
                                        )}{" "}
                                        {denomConversion(selectedBorrowPosition?.amountOut?.denom)}
                                        {/* {denomConversion(selectedAssetId)} */}
                                    </div>
                                    <div className="max-half ml-1">
                                        <Button
                                            className="active"
                                            size="small"
                                            type="primary"
                                            onClick={handleMaxRepay}
                                        >
                                            Max
                                        </Button>
                                    </div>
                                </div>
                                <small className="font-weight-light">
                                    $
                                    {commaSeparator(
                                        Number(
                                            amountConversion(
                                                updatedAmountOut,
                                                assetMap[selectedAssetId]?.decimals
                                                // assetDenomMap[selectedAssetId]?.decimals
                                            ) *
                                            marketPrice(
                                                markets,
                                                assetMap[selectedAssetId]?.denom,
                                                selectedAssetId
                                            ) || 0
                                        ).toFixed(DOLLAR_DECIMALS)
                                    )}
                                </small>
                            </Col>
                        </Row>

                        <Row className="mt-1">
                            <Col sm="12">
                                <Slider
                                    marks={marks}
                                    defaultValue={amount}
                                    value={amount}
                                    tooltip={{ open: false }}
                                    onChange={handleSliderChange}
                                    max={amountConversionWithComma(
                                        updatedAmountOut,
                                        assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
                                    )}
                                    className="commodo-slider market-slider-1 repay-slider"
                                />
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col>
                                <label>Health Factor</label>
                                <TooltipIcon text="Numeric representation of your position's safety" />
                            </Col>
                            <Col className="text-right">
                                <HealthFactor
                                    // borrow={borrowPosition}
                                    borrow={selectedBorrowPosition}
                                    pair={pair}
                                    pool={pool}
                                    // inAmount={borrowPosition?.amountIn?.amount}
                                    inAmount={selectedBorrowPosition?.amountIn?.amount}
                                    outAmount={
                                        amount
                                            ? Number(updatedAmountOut)?.toFixed(0) -
                                            Number(
                                                getAmount(
                                                    amount,
                                                    assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
                                                    // assetDenomMap[selectedAssetId]?.decimals
                                                )
                                            )
                                            : Number(updatedAmountOut)?.toFixed(0)
                                    }
                                />{" "}
                            </Col>
                        </Row>
                        {/* <AssetStats pair={pair} pool={pool} /> */}
                    </Col>
                </Row>
                <div className="assets-form-btn">
                    <ActionButton
                        name="Repay"
                        lang={lang}
                        disabled={
                            !Number(amount) ||
                            dataInProgress ||
                            !selectedAssetId ||
                            validationError?.message
                        }
                        amount={amount}
                        address={address}
                        // borrowId={borrowPosition?.borrowingId}
                        borrowId={selectedBorrowPosition?.borrowingId}
                        // denom={borrowPosition?.amountOut?.denom}
                        denom={selectedBorrowPosition?.amountOut?.denom}
                        refreshData={handleRefresh}
                        assetDenomMap={assetDenomMap}
                    />
                </div>
            </div>
            <div className="details-right">
                <div className="commodo-card">
                    <Details
                        asset={assetMap[pool?.transitAssetIds?.main?.toNumber()]}
                        poolId={pool?.poolId}
                        parent="borrow"
                    />
                </div>
                <div className="commodo-card">
                    <Details
                        asset={assetMap[pool?.transitAssetIds?.first?.toNumber()]}
                        poolId={pool?.poolId}
                        parent="borrow"
                    />
                </div>
                <div className="commodo-card">
                    <Details
                        asset={assetMap[pool?.transitAssetIds?.second?.toNumber()]}
                        poolId={pool?.poolId}
                        parent="borrow"
                    />
                </div>

            </div>
        </div>
    );
};

RepayTab_2.propTypes = {
    dataInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    refreshBorrowPosition: PropTypes.func.isRequired,
    setBalanceRefresh: PropTypes.func.isRequired,
    address: PropTypes.string,
    assetDenomMap: PropTypes.object,
    assetMap: PropTypes.object,
    balances: PropTypes.arrayOf(
        PropTypes.shape({
            denom: PropTypes.string.isRequired,
            amount: PropTypes.string,
        })
    ),
    borrowPosition: PropTypes.shape({
        lendingId: PropTypes.shape({
            low: PropTypes.number,
        }),
        amountIn: PropTypes.shape({
            denom: PropTypes.string,
            amount: PropTypes.string,
        }),
    }),
    pair: PropTypes.shape({
        id: PropTypes.shape({
            low: PropTypes.number,
        }),
        assetIn: PropTypes.shape({
            low: PropTypes.number,
        }),
        amountOut: PropTypes.shape({
            low: PropTypes.number,
        }),
    }),
    pool: PropTypes.shape({
        poolId: PropTypes.shape({
            low: PropTypes.number,
        }),
        firstBridgedAssetId: PropTypes.shape({
            low: PropTypes.number,
        }),
        secondBridgedAssetId: PropTypes.shape({
            low: PropTypes.number,
        }),
    }),
    refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.address,
        pool: state.lend.pool._,
        pair: state.lend.pair,
        assetMap: state.asset._.map,
        balances: state.account.balances.list,
        lang: state.language,
        refreshBalance: state.account.refreshBalance,
        markets: state.oracle.market,
        assetDenomMap: state.asset._.assetDenomMap,
    };
};

const actionsToProps = {
    setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(RepayTab_2);
