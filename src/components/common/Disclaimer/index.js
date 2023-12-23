import { Button, Checkbox, Modal } from "antd";
import React, { useState } from "react";
import "./index.scss";

const Disclaimer = () => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("agreement_accepted") === null
  );
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <Modal
        centered={true}
        className="disclaimer-modal"
        footer={null}
        header={null}
        open={isOpen}
        closable={false}
        width={800}
        isHidecloseButton={true}
        maskStyle={{ background: "rgba(0, 0, 0, 0.6)" }}
      >
        <div className="disclaimer-inner" style={{ textAlign: "center" }}>
          <h2>Disclaimer</h2>
          <div className="description-text">
            <p>
              Your access and/or use of (a) the website located at
              https://commodo.one (being the Website referred to in the Terms
              (as defined below); (b) the Commodo Smart Contracts; and (c) the
              Comdex Chain on which the Commodo Smart Contracts are deployed,
              including related trademarks, and other intellectual property,
              whether such access and/or use is via (i) the Website or (ii)
              command line, locally installed programs, Software Development
              Kits, software code and blockchain and smart contract explorers,
              shall be subject to Terms of Use of Commodo (the “Terms”)
              (accessible at{" "}
              <a
                href="https://terms.comdex.one/Comdex_Commodo_Terms_and_Conditions.pdf"
                target="_blank"
              >
                Terms of Use Of Commodo
              </a>{" "}
              ) and in particular, to the various disclaimers and liability
              limitation set out in the section of the Terms entitled
              “Disclaimers and Limitation of Liability”.
            </p>

            <div className="border-box ">
              <p>
                Commodo (which includes the Website, the Commodo Smart Contracts
                and Comdex Chain are not intended for (a) access and/or use by
                Excluded Persons; or (b) access and/or use by any person or
                entity in, or accessing or using the Website from, an Excluded
                Jurisdiction.
              </p>{" "}
              <br />
              <p>
                Accordingly, if you are an Excluded Person or a person seeking
                to access and/or use Commodo from an Excluded Jurisdiction, you
                should not access and/or use or attempt to access and/or use
                Commodo.
              </p>
            </div>

            <p>
              The terms “Commodo Smart Contracts” and “Comdex Chain”
              (collectively referred to as “Commodo”) as well as “Excluded
              Persons” and “Excluded Jurisdictions” are as defined in the Terms.
            </p>
            <br />
            <p>
              Upgrades and modifications to Commodo are managed in a
              community-driven way by governance vote of holders of the CMDX
              Token native to the Comdex blockchain. There may be changes to the
              Terms since you had last accessed and/or used Commodo.
            </p>
            <br />
            <p>
              By proceeding to access and/or use Commodo you are agreeing to the
              prevailing Terms on behalf of yourself and any entity you
              represent, and you represent and warrant that you have the right
              and authority to do so.
            </p>
          </div>
          <div className="text-center mt-4">
            <Checkbox
              checked={isChecked}
              onChange={() => {
                setIsChecked((value) => !value);
              }}
            >
              I have read and understood the Terms of Use and wish to proceed.
            </Checkbox>
          </div>
          <div className="d-flex agree-btn">
            <Button
              disabled={!isChecked}
              name="Agree"
              type="primary"
              size="large"
              onClick={() => {
                setIsOpen(false);
                localStorage.setItem("agreement_accepted", "true");
              }}
              className="btn-filled"
            >
              Proceed
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Disclaimer;
