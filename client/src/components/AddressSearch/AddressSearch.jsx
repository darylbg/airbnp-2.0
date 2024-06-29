import React, { useState, useCallback, useEffect } from "react";
import {
  AddressAutofill,
  AddressMinimap,
  useConfirmAddress,
  config,
} from "@mapbox/search-js-react";

import "./AddressSearch.css";

export default function AddressSearch() {
  const [showFormExpanded, setShowFormExpanded] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [feature, setFeature] = useState();
  const [showValidationText, setShowValidationText] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const accessToken =
    process.env.REACT_APP_MAPBOX_TOKEN;
    setToken(accessToken);
    config.accessToken = accessToken;
  }, []);

  const { formRef, showConfirm } = useConfirmAddress({
    minimap: true,
    skipConfirmModal: (feature) => {
      ["exact", "high"].includes(feature.properties.match_code.confidence);
    },
  });

  const handleRetrieve = useCallback(
    (res) => {
      const feature = res.features[0];
      setFeature(feature);
      setShowMinimap(true);
      setShowFormExpanded(true);
    },
    [setFeature, setShowMinimap]
  );

  function handleSaveMarkerLocation(coordinate) {
    console.log(`Marker moved to ${JSON.stringify(coordinate)}.`);
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await showConfirm();
      if (result.type === "nochange") submitForm();
    },
    [showConfirm]
  );

  const submitForm = () => {
    setShowValidationText(true);
    setTimeout(() => {
      resetForm();
    }, 2500);
  };

  const resetForm = () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    setShowFormExpanded(false);
    setShowValidationText(false);
    setFeature(null);
  };

  return (
    <>
      <form ref={formRef} className="">
        <div className="">
          <div className="">
            {/* Input form */}
            
            <AddressAutofill accessToken={token} onRetrieve={handleRetrieve}>
            <label className="">Address</label>
              <input
                className=""
                placeholder="Start typing your address, e.g. 123 Main..."
                autoComplete="address-line1"
                id="mapbox-autofill"
              />
            </AddressAutofill>
            {!showFormExpanded && (
              <div
                id="manual-entry"
                className=""
                onClick={() => setShowFormExpanded(true)}
              >
                Enter an address manually
              </div>
            )}
            <div
              className=""
              style={{ display: showFormExpanded ? "block" : "none" }}
            >
              <label className="">
                Address Line 2
              </label>
              <input
                className=""
                placeholder="Apartment, suite, unit, building, floor, etc."
                autoComplete="address-line2"
              />
              <label className="txt-s txt-bold color-gray mb3">City</label>
              <input
                className=""
                placeholder="City"
                autoComplete="address-level2"
              />
              <label className="txt-s txt-bold color-gray mb3">
                State / Region
              </label>
              <input
                className=""
                placeholder="State / Region"
                autoComplete="address-level1"
              />
              <label className="txt-s txt-bold color-gray mb3">
                ZIP / Postcode
              </label>
              <input
                className=""
                placeholder="ZIP / Postcode"
                autoComplete="postal-code"
              />
            </div>
          </div>
          <div className="address-search-minimap">
            {/* Visual confirmation map */}
            <div id="minimap-container" className="h240 w360 relative mt18">
              <AddressMinimap
                canAdjustMarker={true}
                satelliteToggle={true}
                feature={feature}
                show={showMinimap}
                onSaveMarkerLocation={handleSaveMarkerLocation}
              />
            </div>
          </div>
        </div>

        {/* Form buttons */}
        {showFormExpanded && (
          <div className="">
            {/* <button type="submit" className="btn round" id="btn-confirm">
              Confirm
            </button> */}
            <button
              type="button"
              className=""
              id="btn-reset"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        )}
      </form>

      {/* Validation text
      {showValidationText && (
        <div id="validation-msg" className="">
          Order successfully submitted.
        </div>
      )} */}
    </>
  );
}
