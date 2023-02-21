import { Button, message, Select, Slider } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setBalanceRefresh } from "../../../actions/account";
import { Col, NoDataIcon, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import CustomRow from "../../../components/common/Asset/CustomRow";
import Details from "../../../components/common/Asset/Details";
import CustomInput from "../../../components/CustomInput";
import { ValidateInputNumber } from "../../../config/_validation";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { queryAllLendByOwnerAndPool } from "../../../services/lend/query";
import {
    amountConversion,
    amountConversionWithComma,
    denomConversion,
    getAmount
} from "../../../utils/coin";
import { commaSeparator, marketPrice } from "../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import ActionButton from "../../Myhome/DepositWithdraw/ActionButton";
// import { ActionButton } from "../ActionButton";
// import ActionButton from "./ActionButton";
import "./index.less";

const { Option } = Select;

const WithdrawTab = ({
    lang,
    dataInProgress,
    refreshLendPosition,
    pool,
    assetMap,
    address,
    refreshBalance,
    setBalanceRefresh,
    markets,
    assetDenomMap,
}) => {
    const [assetList, setAssetList] = useState();
    const [amount, setAmount] = useState();
    const [validationError, setValidationError] = useState();
    const [allLendByOwner, setAllLendByOwner] = useState([]);
    const [selectedAssetId, setSelectedAssetId] = useState(0)
    const [availableBalance, setAvailableBalance] = useState(0)
    const [lendPosition, setLendPosition] = useState()

    // const selectedAssetId = lendPosition?.assetId?.toNumber();
    console.log(lendPosition, "lendPosition");
    // const availableBalance = lendPosition?.availableToBorrow || 0;

    useEffect(() => {
        if (pool?.poolId) {
            setAssetList([
                assetMap[pool?.transitAssetIds?.main?.toNumber()],
                assetMap[pool?.transitAssetIds?.first?.toNumber()],
                assetMap[pool?.transitAssetIds?.second?.toNumber()],
            ]);
        }
    }, [pool]);

    const fetchAllLendByOwnerAndPool = (address, poolId) => {
        queryAllLendByOwnerAndPool(address, poolId, (error, result) => {
            if (error) {
                message.error(error);
                return;
            }

            console.log(result, "AllLendByOwnerAndPool");
            setAllLendByOwner(result?.lends)
        });
    };

    useEffect(() => {
        fetchAllLendByOwnerAndPool(address, pool?.poolId)
    }, [address, pool])


    useEffect(() => {
        // refreshLendPosition();
    }, [refreshBalance]);

    const refreshData = () => {
        // refreshLendPosition();
        setAmount();
        setBalanceRefresh(refreshBalance + 1);
    };
    const handleInputChange = (value) => {
        value = toDecimals(value, assetMap[selectedAssetId]?.decimals)
            .toString()
            .trim();

        setAmount(value);
        setValidationError(
            ValidateInputNumber(
                getAmount(value, assetMap[selectedAssetId]?.decimals),
                availableBalance
            )
        );
    };

    const handleMaxClick = () => {
        return handleInputChange(
            amountConversion(
                Number(availableBalance),
                assetMap[selectedAssetId]?.decimals
            )
        );
    };

    const handleAssetChange = (value) => {
        console.log(value, "Selected asset");
        setLendPosition(allLendByOwner[value])
        setSelectedAssetId(allLendByOwner[value]?.assetId?.toNumber());
        setAvailableBalance(allLendByOwner[value]?.availableToBorrow)
        // setAmount(0);
        // setValidationError();
    };

    const marks = {
        0: "0%",
        50: '50%',
        100: "100%",
    };

    return (
        <div className="details-wrapper market-details-wrapper">
            <div className="details-left commodo-card">
                <CustomRow assetList={assetList} poolId={pool?.poolId?.low} />
                <div className="assets-select-card mb-0">
                    <div className="assets-left">
                        <label className="left-label">Withdraw</label>
                        <div className="assets-select-wrapper">
                            <Select
                                className="assets-select"
                                popupClassName="asset-select-dropdown"
                                // defaultValue="1"
                                // value={selectedAssetId}
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
                                suffixIcon={
                                    <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                                }
                                notFoundContent={<NoDataIcon />}
                            >
                                {
                                    allLendByOwner?.length > 0 && allLendByOwner?.map((item, index) => {
                                        return (
                                            <Option key={index} value={index}>
                                                <div className="select-inner">
                                                    <div className="svg-icon">
                                                        <div className="svg-icon-inner">
                                                            <SvgIcon
                                                                name={iconNameFromDenom(
                                                                    assetMap[item?.assetId]?.denom
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="name">
                                                        {denomConversion(assetMap[item?.assetId]?.denom)}
                                                        <label>(cPool-{denomConversion(assetMap[item?.assetId]?.denom)})</label>
                                                    </div>
                                                </div>
                                            </Option>
                                        )
                                    })
                                }

                            </Select>
                        </div>
                    </div>
                    <div className="assets-right">
                        <div className="label-right">
                            Available
                            <span className="ml-1">
                                {amountConversionWithComma(
                                    availableBalance,
                                    assetMap[selectedAssetId]?.decimals
                                )}{" "}
                                {denomConversion(assetMap[selectedAssetId]?.denom)}
                            </span>
                            <div className="max-half">
                                <Button className="active" onClick={handleMaxClick}>
                                    Max
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="input-select">
                                <CustomInput
                                    value={amount}
                                    onChange={(event) => handleInputChange(event.target.value)}
                                    validationError={validationError}
                                />
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
                                )}
                            </small>
                        </div>
                    </div>
                </div>


                <Row>
                    <Col sm="12" className="mx-auto card-bottom-details">
                        <Row className="mt-2">
                            <Col>
                                <label>
                                    Max LTV
                                    <TooltipIcon text="The maximum borrowing power of the collateral" />
                                </label>
                            </Col>
                            <Col className="text-right">
                                -
                            </Col>
                        </Row>
                        <Row className="mt-1">
                            <Col sm="12">
                                <Slider
                                    marks={marks}
                                    defaultValue={37}
                                    tooltip={{ open: false }}
                                    className="commodo-slider market-slider-1"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <label>Lend APY</label>
                            </Col>
                            <Col className="text-right">
                                -
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <div className="assets-form-btn">
                    <ActionButton
                        name="Withdraw"
                        lang={lang}
                        disabled={
                            !Number(amount) ||
                            validationError?.message ||
                            dataInProgress ||
                            !selectedAssetId
                        }
                        amount={amount}
                        address={address}
                        lendId={lendPosition?.lendingId}
                        denom={lendPosition?.amountIn?.denom}
                        refreshData={() => refreshData()}
                        assetDenomMap={assetDenomMap}
                    />
                </div>
            </div>
            <div className="details-right">
                <div className="commodo-card">
                    <Details
                        asset={assetMap[pool?.transitAssetIds?.first?.toNumber()]}
                        poolId={pool?.poolId}
                        parent="lend"
                    />
                </div>
                <div className="commodo-card">
                    <Details
                        asset={assetMap[pool?.transitAssetIds?.second?.toNumber()]}
                        poolId={pool?.poolId}
                        parent="lend"
                    />
                </div>
                <div className="commodo-card">
                    <Details
                        asset={assetMap[pool?.transitAssetIds?.main?.toNumber()]}
                        poolId={pool?.poolId}
                        parent="lend"
                    />
                </div>
            </div>
        </div>
    );
};

WithdrawTab.propTypes = {
    dataInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    // refreshLendPosition: PropTypes.func.isRequired,
    refreshBalance: PropTypes.number.isRequired,
    setBalanceRefresh: PropTypes.func.isRequired,
    address: PropTypes.string,
    assetMap: PropTypes.object,
    assetDenomMap: PropTypes.object,
    markets: PropTypes.object,
    lendPosition: PropTypes.shape({
        lendingId: PropTypes.shape({
            low: PropTypes.number,
        }),
        amountIn: PropTypes.shape({
            denom: PropTypes.string,
            amount: PropTypes.string,
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
};

const stateToProps = (state) => {
    return {
        address: state.account.address,
        pool: state.lend.pool._,
        assetMap: state.asset._.map,
        balances: state.account.balances.list,
        refreshBalance: state.account.refreshBalance,
        lang: state.language,
        markets: state.oracle.market,
        assetDenomMap: state.asset._.assetDenomMap,
    };
};

const actionsToProps = {
    setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(WithdrawTab);
