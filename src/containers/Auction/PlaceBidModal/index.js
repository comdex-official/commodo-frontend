import { Button, message, Modal } from "antd";
import Long from "long";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Col, Row } from "../../../components/common";
import Snack from "../../../components/common/Snack";
import CustomInput from "../../../components/CustomInput/index";
import Timer from "../../../components/Timer";
import { comdex } from "../../../config/network";
import { ValidateInputNumber } from "../../../config/_validation";
import { APP_ID } from "../../../constants/common";
import { querySingleDutchLendAuction } from "../../../services/auction";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee } from "../../../services/transaction";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  orderPriceConversion
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice
} from "../../../utils/number";
import { toDecimals } from "../../../utils/string";
import variables from "../../../utils/variables";
import "./index.less";

const PlaceBidModal = ({
  lang,
  address,
  auction,
  refreshBalance,
  params,
  assetDenomMap,
  markets,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [validationError, setValidationError] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [maxValidationError, setMaxValidationError] = useState();
  const [calculatedQuantityBid, setCalculatedQuantityBid] = useState();
  const [newCurrentAuction, setNewCurrentAuction] = useState(auction);

  const dispatch = useDispatch();

  const fetchSingleDutchAuctions = (auctionId, auctionMappingId) => {
    querySingleDutchLendAuction(auctionId, auctionMappingId, (error, data) => {
      if (error) {
        message.error(error);
        return;
      }
      setNewCurrentAuction(data?.auction);
    });
  };

  const showModal = () => {
    fetchSingleDutchAuctions(auction?.auctionId, auction?.auctionMappingId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = () => {
    setInProgress(true);
    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.auction.v1beta1.MsgPlaceDutchLendBidRequest",
          value: {
            bidder: address,
            auctionId: auction?.auctionId,
            amount: {
              denom: auction?.outflowTokenInitAmount?.denom,
              amount: getAmount(
                bidAmount,
                assetDenomMap[auction?.outflowTokenInitAmount?.denom]?.decimals
              ),
            },
            max: orderPriceConversion(maxPrice || 0),
            appId: Long.fromNumber(APP_ID),
            auctionMappingId: params?.dutchId,
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        setIsModalOpen(false);

        if (error) {
          setBidAmount(0);
          setMaxPrice(0);
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }

        setBidAmount(0);
        setMaxPrice(0);
        message.success(
          <Snack
            message={variables[lang].tx_success}
            explorerUrlToTx={comdex.explorerUrlToTx}
            hash={result?.transactionHash}
          />
        );
        dispatch({
          type: "BALANCE_REFRESH_SET",
          value: refreshBalance + 1,
        });
      }
    );
  };

  const handleChange = (value) => {
    value = toDecimals(value).toString().trim();

    setValidationError(
      ValidateInputNumber(
        value,
        Number(
          amountConversion(
            newCurrentAuction?.outflowTokenCurrentAmount?.amount || 0,
            assetDenomMap[newCurrentAuction?.outflowTokenCurrentAmount?.denom]
              ?.decimals
          )
        ) || 0
      )
    );
    setBidAmount(value);
  };

  const calculateQuantityBidFor = () => {
    let calculatedAmount = Number(
      bidAmount *
        Number(
          amountConversion(
            decimalConversion(newCurrentAuction?.outflowTokenCurrentPrice) || 0,
            assetDenomMap[auction?.outflowTokenInitAmount?.denom]?.decimals
          )
        )
    ).toFixed(6);
    setCalculatedQuantityBid(calculatedAmount);
  };

  useEffect(() => {
    if (isModalOpen) {
      const interval = setInterval(() => {
        fetchSingleDutchAuctions(auction?.auctionId, auction?.auctionMappingId);
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isModalOpen]);

  const handleMaxPriceChange = (value) => {
    value = toDecimals(
      value,
      assetDenomMap[newCurrentAuction?.inflowTokenTargetAmount?.denom]?.decimals
    )
      .toString()
      .trim();

    setMaxValidationError(
      ValidateInputNumber(
        getAmount(
          value,
          assetDenomMap[newCurrentAuction?.inflowTokenTargetAmount?.denom]
            ?.decimals
        )
      )
    );
    setMaxPrice(value);
  };

  useEffect(() => {
    calculateQuantityBidFor();
  }, [bidAmount, newCurrentAuction?.outflowTokenCurrentPrice]);

  return (
    <>
      <Button type="primary" size="small" className="px-3" onClick={showModal}>
        {" "}
        Place Bid{" "}
      </Button>
      <Modal
        centered={true}
        className="palcebid-modal auction-placebid-modal"
        footer={null}
        header={null}
        open={isModalOpen}
        width={550}
        closable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={null}
      >
        <div className="palcebid-modal-inner">
          <Row>
            <Col sm="6">
              <p>Remaining Time </p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                <Timer
                  expiryTimestamp={
                    newCurrentAuction && newCurrentAuction.endTime
                  }
                />
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Oracle Price</p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                {" "}
                $
                {Number(
                  marketPrice(
                    markets,
                    newCurrentAuction?.outflowTokenCurrentAmount?.denom,
                    assetDenomMap[
                      newCurrentAuction?.outflowTokenCurrentAmount?.denom
                    ]?.id
                  ) || 0
                )}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Opening Auction Price</p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                {" "}
                $
                {commaSeparator(
                  Number(
                    amountConversion(
                      decimalConversion(
                        newCurrentAuction?.outflowTokenInitialPrice
                      ) || 0,
                      assetDenomMap[auction?.outflowTokenInitAmount?.denom]
                        ?.decimals
                    ) || 0
                  )
                )}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Current Auction Price</p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                $
                {commaSeparator(
                  Number(
                    amountConversion(
                      decimalConversion(
                        newCurrentAuction?.outflowTokenCurrentPrice
                      ) || 0,
                      assetDenomMap[auction?.outflowTokenInitAmount?.denom]
                        ?.decimals
                    ) || 0
                  )
                )}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Auctioned Quantity </p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                {amountConversionWithComma(
                  newCurrentAuction?.outflowTokenCurrentAmount?.amount || 0,
                  assetDenomMap[
                    newCurrentAuction?.outflowTokenCurrentAmount?.denom
                  ]?.decimals
                )}{" "}
                {denomConversion(
                  newCurrentAuction?.outflowTokenCurrentAmount?.denom
                )}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>
                {" "}
                Target{" "}
                {denomConversion(
                  newCurrentAuction?.inflowTokenCurrentAmount?.denom
                )}
              </p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                {commaSeparator(
                  Number(
                    amountConversion(
                      newCurrentAuction?.inflowTokenTargetAmount?.amount,
                      assetDenomMap[
                        newCurrentAuction?.inflowTokenTargetAmount?.denom
                      ]?.decimals
                    ) -
                      amountConversion(
                        newCurrentAuction?.inflowTokenCurrentAmount?.amount,
                        assetDenomMap[
                          newCurrentAuction?.inflowTokenCurrentAmount?.denom
                        ]?.decimals
                      )
                  ).toFixed(6) || 0
                )}{" "}
                {denomConversion(
                  newCurrentAuction?.inflowTokenCurrentAmount?.denom
                )}
              </label>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p>Quantity Bid For</p>
            </Col>
            <Col
              sm="6"
              className="text-right auction-quantity-max-btn-main-container"
            >
              <CustomInput
                value={bidAmount}
                onChange={(event) => handleChange(event.target.value)}
                validationError={validationError}
              />
              <label>
                <div className="input-denom">
                  {denomConversion(
                    newCurrentAuction?.outflowTokenCurrentAmount?.denom
                  )}
                </div>
              </label>
              <div className="auction-quantity-max-btn">
                <button
                  onClick={() => {
                    handleChange(
                      amountConversion(
                        newCurrentAuction?.outflowTokenCurrentAmount?.amount ||
                          0,
                        assetDenomMap[
                          newCurrentAuction?.outflowTokenCurrentAmount?.denom
                        ]?.decimals
                      ) || 0
                    );
                  }}
                >
                  Max
                </button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <p>
                Your{" "}
                {denomConversion(
                  newCurrentAuction?.inflowTokenCurrentAmount?.denom
                )}{" "}
                Bid
              </p>
            </Col>
            <Col sm="6" className="text-right">
              <label>
                {calculatedQuantityBid}{" "}
                {denomConversion(
                  newCurrentAuction?.inflowTokenCurrentAmount?.denom
                )}
              </label>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <p>Acceptable Max Price</p>
            </Col>
            <Col sm="6" className="text-right bid-custom-input">
              <CustomInput
                value={maxPrice}
                onChange={(event) => handleMaxPriceChange(event.target.value)}
                validationError={maxValidationError}
              />
              <label>
                <div className="input-denom">
                  {denomConversion(
                    newCurrentAuction?.inflowTokenTargetAmount?.denom
                  )}
                  /
                  {denomConversion(
                    newCurrentAuction?.outflowTokenCurrentAmount?.denom
                  )}
                </div>
              </label>
            </Col>
          </Row>
          <Row className="p-0">
            <Col className="text-center mt-3">
              <Button
                type="primary"
                className="btn-filled px-5"
                size="large"
                loading={inProgress}
                disabled={
                  !Number(bidAmount) ||
                  !Number(maxPrice) ||
                  validationError?.message
                }
                onClick={handleClick}
              >
                Place Bid
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

PlaceBidModal.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  assetDenomMap: PropTypes.object,
  refreshBalance: PropTypes.number.isRequired,
  auction: PropTypes.shape({
    minBid: PropTypes.shape({
      amount: PropTypes.string,
      denom: PropTypes.string,
    }),
    bid: PropTypes.shape({
      amount: PropTypes.string,
      denom: PropTypes.string,
    }),
    id: PropTypes.shape({
      high: PropTypes.number,
      low: PropTypes.number,
      unsigned: PropTypes.bool,
    }),
  }),
  refreshData: PropTypes.func.isRequired,
  markets: PropTypes.object,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
    markets: state.oracle.market,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(PlaceBidModal);
