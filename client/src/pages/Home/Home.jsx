import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import ButtonComponent from "../../components/PrimitiveComponents/ButtonComponent/ButtonComponent";
import HeroImage from "../../assets/images/HeroImage2.jpg";
import Phone1 from "../../assets/images/phone2.png";
import { useDispatch } from "react-redux";
import { SearchBox } from "@mapbox/search-js-react";
import { setUserLocation, setMapCenter } from "../../reducers/bookingReducer";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import MapIcon from "../../assets/icons/StepIcons/map.png";
import BikeIcon from "../../assets/icons/StepIcons/bike.png";
import BbqIcon from "../../assets/icons/StepIcons/bbq.png";

export default function Home() {
  const [addressValue, setAddressValue] = React.useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddressChange = (d) => {
    setAddressValue(d);
  };

  const onAddressSubmit = (result) => {
    const features = result.features[0];
    const userLocation = {
      coordinates: {
        lng: features.geometry.coordinates[0],
        lat: features.geometry.coordinates[1],
      },
      fullAddress: features.properties.full_address,
    };
    const mapCenter = {
      coordinates: {
        lng: features.geometry.coordinates[0],
        lat: features.geometry.coordinates[1],
      },
    };
    dispatch(setUserLocation(userLocation));
    dispatch(setMapCenter(mapCenter));
    navigate("/search");
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const userLocation = {
            coordinates: {
              lng: longitude,
              lat: latitude,
            },
            fullAddress: "",
          };

          const mapCenter = {
            coordinates: {
              lng: userLocation.coordinates.lng,
              lat: userLocation.coordinates.lat,
            },
          };

          // Dispatch location and map center to Redux store
          dispatch(setUserLocation(userLocation));
          dispatch(setMapCenter(mapCenter));

          // Navigate to the search page only after dispatching the location
          navigate("/search");
        },
        (error) => {
          // Handle geolocation errors here if needed
          console.error("Error getting location", error);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const searchBoxTheme = {
    variables: {
      border: "none",
      borderRadius: "5px",
      boxShadow: "none",
      border: "1px solid #acacac",
      elements: {
        searchIcon: {
          display: "none"
        },
        input: {
          borderRadius: "50px"
        }
      }
    },
  };

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
              <div className="search-input">
                <SearchBox
                  style={{ width: "100%", borderRadius: "50px" }}
                  className="hero-address-searchBox"
                  accessToken="pk.eyJ1IjoiZGF6emExMjMiLCJhIjoiY2x5MDM4c29yMGh1eTJqcjZzZTRzNzEzaiJ9.dkx0lvLDJy35oWNvOW5mFg"
                  options={{
                    language: "en",
                    country: "GB",
                  }}
                  theme={searchBoxTheme}
                  placeholder="Search address or city"
                  onRetrieve={onAddressSubmit}
                  value={addressValue}
                  onChange={handleAddressChange}
                />
              </div>
              <ButtonComponent
                type="submit"
                className="large-rounded-button action-button"
                action={handleLocateUser}
              >
                Search closest locations
              </ButtonComponent>
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
                <img src={MapIcon} alt="" />
                <div className="step-index">1.</div>
              </div>
              <div className="step-text">
                <h1>Book online or on the app</h1>
                <p>Search you location and see nearby bathrooms available to book and use.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-img">
              <img src={BikeIcon} alt="" />
                <div className="step-index">2.</div>
              </div>
              <div className="step-text">
                <h1>Head to the location.</h1>
                <p>Travel to the selected location and be at peace.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-img">
              <img src={BbqIcon} alt="" />
                <div className="step-index">3.</div>
              </div>
              <div className="step-text">
                <h1>Continue on with your day!</h1>
                <p>Do whatever you like with the rest of your day.</p>
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
              <ButtonComponent
                type="submit"
                className="large-rounded-button action-button"
                action={handleLocateUser}
              >
                Search closest locations
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
      <Footer />
    </div>
  );
}
