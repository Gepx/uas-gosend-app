import React, { useState } from "react";
import PickupForm from "../components/PickupForm";
import DeliverForm from "../components/DeliverForm";

const Home = () => {
  const [currentStep, setCurrentStep] = useState("pickup");
  const [pickupLocation, setPickupLocation] = useState(null);

  const handlePickupSubmit = (location) => {
    setPickupLocation(location);
    setCurrentStep("delivery");
  };

  const handleBack = () => {
    if (currentStep === "delivery") {
      setCurrentStep("pickup");
    }
  };

  const handleDeliveryComplete = () => {
    // Reset all states when delivery is complete
    setCurrentStep("pickup");
    setPickupLocation(null);
  };

  return (
    <div className="home-container">
      {currentStep === "pickup" ? (
        <PickupForm onSubmit={handlePickupSubmit} />
      ) : (
        <DeliverForm
          onBack={handleBack}
          pickupLocation={pickupLocation}
          onDeliveryComplete={handleDeliveryComplete}
        />
      )}
    </div>
  );
};

export default Home;
