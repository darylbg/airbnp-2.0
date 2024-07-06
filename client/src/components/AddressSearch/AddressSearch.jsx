import React, { useState, useCallback, useEffect } from "react";
import { Link, } from "react-router-dom";
import * as From from "@radix-ui/react-form";
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
    const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    setToken(accessToken);
    config.accessToken = accessToken;
  }, []);

  const { formRef, showConfirm } = useConfirmAddress({
    minimap: true,
    skipConfirmModal: (feature) =>
      ["exact", "high"].includes(feature.properties.match_code.confidence),
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
      <div 
      // ref={formRef} 
      className="address-search-container"
      >
        <div className="address-input-section">
          <div className="address-inputs">
            <AddressAutofill accessToken={token} onRetrieve={handleRetrieve}>
              <label className="address-label">Address</label>
              <input
                className="address-input autofill-address-input"
                placeholder="Start typing your address, e.g. 123 Main..."
                autoComplete="address-line1"
                id="mapbox-autofill"
              />
            </AddressAutofill>
            {!showFormExpanded && (
              <Link
                id="manual-entry"
                className="manual-address-entry"
                onClick={() => setShowFormExpanded(true)}
              >
                Enter an address manually
              </Link>
            )}
            <div
              className="address-input-group"
              style={{ display: showFormExpanded ? "flex" : "none" }}
            >
              <label className="address-label">Address Line 2</label>
              <input
                className="address-input"
                placeholder="Apartment, suite, unit, building, floor, etc."
                autoComplete="address-line2"
              />
              <label className="address-label">City</label>
              <input
                className="address-input"
                placeholder="City"
                autoComplete="address-level2"
              />
              <label className="address-label">State / Region</label>
              <input
                className="address-input"
                placeholder="State / Region"
                autoComplete="address-level1"
              />
              <label className="address-label">ZIP / Postcode</label>
              <input
                className="address-input"
                placeholder="ZIP / Postcode"
                autoComplete="postal-code"
              />
            </div>
          </div>
          <div className="address-search-minimap">
            <div id="minimap-container" className="address-minimap-container">
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
        {showFormExpanded && (
          <div className="form-buttons-section">
            <button
              type="button"
              className="clear-button"
              id="btn-reset"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </>
  );
}
