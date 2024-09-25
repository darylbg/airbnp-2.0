import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import {
  AddressAutofill,
  AddressMinimap,
  useConfirmAddress,
  config,
} from "@mapbox/search-js-react";

import "./AddressSearch.css";
import { useController } from "react-hook-form";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";

export default function AddressSearch({
  control,
  errors,
  setValue,
  showFormExpanded,
  setShowFormExpanded,
  showMinimap,
  setShowMinimap,
  loading,
  listing,
  showExpandedAddressSearch,
  onSubmit, // <-- Add this prop
}) {
  const [feature, setFeature] = useState();
  const [showValidationText, setShowValidationText] = useState(false);
  const [token, setToken] = useState("");

  const { field: addressAutofillInput } = useController({
    name: "addressAutofillInput",
    control,
    rules: { required: "Address is required" },
    defaultValue: (listing && listing.addressLine1) || "",
  });

  const { field: addressLine2 } = useController({
    name: "addressLine2",
    control,
    defaultValue: (listing && listing.addressLine2) || "",
  });

  const { field: addressCity } = useController({
    name: "addressCity",
    control,
    defaultValue: (listing && listing.addressCity) || "",
  });

  const { field: addressRegion } = useController({
    name: "addressRegion",
    control,
    defaultValue: (listing && listing.addressRegion) || "",
  });

  const { field: addressPostCode } = useController({
    name: "addressPostCode",
    control,
    defaultValue: (listing && listing.addressPostCode) || "",
  });

  const { field: addressLongitude } = useController({
    name: "addressLongitude",
    control,
    defaultValue: (listing && listing.longitude) || "",
  });

  const { field: addressLatitude } = useController({
    name: "addressLatitude",
    control,
    defaultValue: (listing && listing.latitude) || "",
  });

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
      if (showExpandedAddressSearch) {
        setShowMinimap(true);
        setShowFormExpanded(true);
      }
      const [longitude, latitude] = feature.geometry.coordinates;
      setValue("addressLatitude", latitude);
      setValue("addressLongitude", longitude);
    },
    [setFeature, setShowMinimap, setValue]
  );

  function handleSaveMarkerLocation(coordinate) {
    console.log(`Marker moved to ${JSON.stringify(coordinate)}.`);
  }

  const handleSubmit = useCallback(
    async (e) => {
      console.log("running");
      e.preventDefault();
      const result = await showConfirm();
      if (result.type === "nochange") onSubmit(); // <-- Call onSubmit here
    },
    [showConfirm, onSubmit]
  );

  const resetForm = () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    setShowFormExpanded(false);
    setShowValidationText(false);
    setFeature(null);
  };

  return (
    <>
      <div className="address-search-container">
        <div className="address-input-section">
          <div className="address-inputs">
          <label className="address-label">Address</label>
            <Form.Field>
              <AddressAutofill accessToken={token} onRetrieve={handleRetrieve}>
        
                <Form.Control
                  className="input-outlined address-input autofill-address-input"
                  placeholder="Start typing your address, e.g. 123 Main..."
                  autoComplete="address-line1"
                  id="mapbox-autofill"
                  {...addressAutofillInput}
                />
              </AddressAutofill>
              <div className="field-message">
                {errors.addressAutofillInput?.message}
              </div>
            </Form.Field>
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
              <Form.Field>
                <Form.Label className="address-label">
                  Address Line 2
                </Form.Label>
                <Form.Control
                  className="address-input input-outlined"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  autoComplete="address-line2"
                  {...addressLine2}
                  disabled={loading}
                />
                <div className="field-message">
                  {errors.addressLine2?.message}
                </div>
              </Form.Field>
              <Form.Field style={{display: "flex", flexDirection: "column"}}>
                <Form.Label className="address-label">City</Form.Label>
                <Form.Control
                  className="address-input input-outlined"
                  placeholder="City"
                  autoComplete="address-level2"
                  {...addressCity}
                  disabled={loading}
                />
                <div className="field-message">
                  {errors.addressCity?.message}
                </div>
              </Form.Field>
              <Form.Field>
                <Form.Label className="address-label">
                  State / Region
                </Form.Label>
                <Form.Control
                  className="address-input input-outlined"
                  placeholder="State / Region"
                  autoComplete="address-level1"
                  {...addressRegion}
                  disabled={loading}
                />
                <div className="field-message">
                  {errors.addressRegion?.message}
                </div>
              </Form.Field>
              <Form.Field>
                <Form.Label className="address-label">
                  ZIP / Postcode
                </Form.Label>
                <Form.Control
                  className="address-input input-outlined"
                  placeholder="ZIP / Postcode"
                  autoComplete="postal-code"
                  {...addressPostCode}
                  disabled={loading}
                />
              </Form.Field>
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
            <ButtonComponent
            type="button"
            className="clear-button default-button control-button"
            // id="btn-reset"
            action={resetForm}
            >
              Clear form
            </ButtonComponent>
          </div>
        )}
      </div>
    </>
  );
}