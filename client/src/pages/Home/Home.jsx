import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as Accordion from "@radix-ui/react-accordion";
import ButtonComponent from "../../components/PrimitiveComponents/ButtonComponent/ButtonComponent";
import HeroImage from "../../assets/images/HeroImage.jpg";
import Phone1 from "../../assets/images/phone2.png";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { SearchBox } from "@mapbox/search-js-react";
import { setUserLocation, setMapCenter } from "../../reducers/bookingReducer";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [addressData, setAddressData] = useState(null);
  const [addressValue, setAddressValue] = React.useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      addressSearch: "",
    },
  });

  const handleAddressChange = (d) => {
    setAddressValue(d);
  };

  const handleAddressRetrieve = (result) => {
    const features = result.features[0];
    const userLocation = {
      coordinates: {
        lng: features.geometry.coordinates[0],
        lat: features.geometry.coordinates[1],
      },
      fullAddress: features.properties.full_address,
    };
    // dispatch(setUserLocation(userLocation))
    setAddressData(userLocation);
  };

  const onSubmit = () => {
    if (addressData) {
      const mapCenter = {
        coordinates: addressData.coordinates,
      };
      console.log("address data", addressData);
      dispatch(setUserLocation(addressData));
      dispatch(setMapCenter(mapCenter));

      navigate("/search");
    }
  };

  const searchBoxTheme = {
    variables: { 
      border: "none"
    }
  }

  return (
    <div className="home-page">
      <section className="home-hero-section">
        <div className="hero-content">
          <div className="hero-content-text">
            <div className="text">
              <p className="subtitle-1">10,000+ available bathrooms for you.</p>
              <div className="title">
                <p>Bathrooms available near you</p>
              </div>
              <p className="subtitle-2">Go out stress free</p>
            </div>
            <div className="search">
              <Form.Root
                onSubmit={handleSubmit(onSubmit)}
                className="hero-search-form"
              >
                <Form.Field className="search-field">
                  <SearchBox
                    style={{ width: "100%" }}
                    className="hero-address-searchBox"
                    accessToken="pk.eyJ1IjoiZGF6emExMjMiLCJhIjoiY2x5MDM4c29yMGh1eTJqcjZzZTRzNzEzaiJ9.dkx0lvLDJy35oWNvOW5mFg"
                    options={{
                      language: "en",
                      country: "GB",
                    }}
                    theme={searchBoxTheme}
                    placeholder="Search address or city"
                    onRetrieve={handleAddressRetrieve}
                    value={addressValue}
                    onChange={handleAddressChange}
                  />
                </Form.Field>
                <Form.Field className="search-button">
                  <Form.Submit asChild>
                    <ButtonComponent
                      type="submit"
                      className="large-rounded-button action-button"
                    >
                      Search closest locations
                    </ButtonComponent>
                  </Form.Submit>
                </Form.Field>
              </Form.Root>
            </div>
          </div>
          <div className="hero-content-img">
            <img src={HeroImage} alt="" />
          </div>
        </div>
        <div className="hero-ticker">
          <div className="tick">
            <strong>10,000+ LOCATIONS GLOBALLY</strong>
          </div>
          <div className="tick">
            <strong>25,000+ USERS</strong>
          </div>
          <div className="tick">
            <strong>95 COUNTRIES</strong>
          </div>
          <div className="tick">
            <strong>FROM £1.00/VISIT</strong>
          </div>
          <div className="tick">
            <strong>10,000+ LOCATIONS GLOBALLY</strong>
          </div>
          <div className="tick">
            <strong>25,000+ USERS</strong>
          </div>
          <div className="tick">
            <strong>95 COUNTRIES</strong>
          </div>
          <div className="tick">
            <strong>FROM £1.00/VISIT</strong>
          </div>
        </div>
      </section>
      <section className="home-steps-section home-section">
        <div className="home-section-wrapper">
          <div className="section-heading">
            <p>How it works</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-img">
                <div className="step-index">1.</div>
              </div>
              <div className="step-text">
                <h1>Book online or on the app</h1>
                <p>Head to our website or book from your phone on our app.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-img">
                <div className="step-index">2.</div>
              </div>
              <div className="step-text">
                <h1>Book online or on the app</h1>
                <p>Head to our website or book from your phone on our app.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-img">
                <div className="step-index">3.</div>
              </div>
              <div className="step-text">
                <h1>Book online or on the app</h1>
                <p>Head to our website or book from your phone on our app.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="home-book-now-section home-section">
        <div className="background-pattern"></div>
        <div className="home-section-wrapper">
          <p className="section-heading">Book now</p>
          <div className="book-now-section-content">
            <div className="book-now-section-text">
              <p className="section-subheading">
                Instantly find close, clean bathrooms to use.
              </p>
              <ButtonComponent className="large-rounded-button action-button">
                Find nearest locations
              </ButtonComponent>
            </div>
            <div className="book-now-section-img">
              <img src={Phone1} alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="home-faqs-section home-section">
        <div className="home-section-wrapper">
          <p className="section-heading">FAQ'S</p>
          <Accordion.Root type="multiple" collapsible>
            <Accordion.Item value="item-1">
              <Accordion.Header className="AccordionHeader">
                <Accordion.Trigger className="AccordionTrigger">
                  <span>QUESTION ONE</span>
                  <span className="material-symbols-outlined accordion-icon">
                    arrow_drop_down
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="AccordionContent">
                Answer one
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2">
              <Accordion.Header>
                <Accordion.Trigger className="AccordionTrigger">
                  <span>QUESTION TWO</span>
                  <span className="material-symbols-outlined accordion-icon">
                    arrow_drop_down
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="AccordionContent">
                Answer two
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-3">
              <Accordion.Header>
                <Accordion.Trigger className="AccordionTrigger">
                  <span>QUESTION THREE</span>
                  <span className="material-symbols-outlined accordion-icon">
                    arrow_drop_down
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="AccordionContent">
                Answer two
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-4">
              <Accordion.Header>
                <Accordion.Trigger className="AccordionTrigger">
                  <span>QUESTION FOUR</span>
                  <span className="material-symbols-outlined accordion-icon">
                    arrow_drop_down
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="AccordionContent">
                Answer two
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-5">
              <Accordion.Header>
                <Accordion.Trigger className="AccordionTrigger">
                  <span>QUESTION FIVE</span>
                  <span className="material-symbols-outlined accordion-icon">
                    arrow_drop_down
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="AccordionContent">
                Answer two
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </section>
    </div>
  );
}
