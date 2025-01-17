"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type FunctionComponent } from "react";

const UserInfo = {
  firstName: "Adam",
  lastName: "Smith",
  email: "adam.smith@example.com",
  phone: "123-456-7890",
  address: "123 Main St, Anytown, USA",
  city: "Anytown",
  state: "CA",
  zip: "94109",
  liscensePlate: "ABC9803",
  permanentPlate: true,
  make: "Subaru",
  model: "Outback",
  year: "2020",
  color: "Blue",
};

const FillOutForm: FunctionComponent = () => {
    
  const fillForm = api.form.fillForm.useMutation({
    onSuccess: () => {
      console.log("Form filled out successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleFillForm = () => {
    fillForm.mutate(UserInfo);
  };

  return (
    <div>
      <Button onClick={handleFillForm} disabled={fillForm.isLoading}>
        {fillForm.isLoading ? "Filling Form..." : "Fill Out Form"}
      </Button>
    </div>
  );
};

export default FillOutForm;
