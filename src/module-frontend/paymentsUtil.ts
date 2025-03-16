import axios from "axios";

export const navigateToPurchasePage = () => {
  window.open("https://hsiehchengyi.gumroad.com/l/spaciiing-pro", "_blank"); // Replace with your desired URL
};

export const navigateToCheckOutPage = (plan: "monthly" | "yearly") => {
  if (plan === "monthly") {
    window.open(
      "https://app.gumroad.com/checkout?product=xyjsy&option=8LhOD0wJakerUsuuL0H3jw%3D%3D&recurrence=monthly&quantity=1",
      "_blank"
    );
  } else {
    window.open(
      "https://app.gumroad.com/checkout?product=xyjsy&option=8LhOD0wJakerUsuuL0H3jw%3D%3D&recurrence=yearly&quantity=1",
      "_blank"
    );
  }

  // window.open("https://hsiehchengyi.gumroad.com/l/spaciiing-pro", "_blank");
};

export async function verifyLicenseKey(licenseKey: string) {
  const data = {
    access_token: "Cxuf3E0O7Tlb6O6Yp5f6EpNan1kWD1SUDzAnj0x61HY",
    product_id: "i5iN91_Nnx8Frr_mPRS32A==",
    license_key: licenseKey,
  };

  try {
    const response = await axios.post(
      "https://api.gumroad.com/v2/licenses/verify",
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Verification failed");
    }
    throw new Error("Network error or invalid request");
  }
}
