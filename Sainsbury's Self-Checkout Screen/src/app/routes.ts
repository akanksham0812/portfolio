import { createHashRouter as createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Welcome from "./components/Welcome";
import SmartBasketPlace from "./components/SmartBasketPlace";
import SmartBasketScanning from "./components/SmartBasketScanning";
import ManualScan from "./components/ManualScan";
import ReviewItems from "./components/ReviewItems";
import PaymentSelection from "./components/PaymentSelection";
import PaymentProcessing from "./components/PaymentProcessing";
import BaggingArea from "./components/BaggingArea";
import Complete from "./components/Complete";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Welcome },
      { path: "smart-basket-place", Component: SmartBasketPlace },
      { path: "smart-basket-scanning", Component: SmartBasketScanning },
      { path: "manual-scan", Component: ManualScan },
      { path: "review", Component: ReviewItems },
      { path: "payment-selection", Component: PaymentSelection },
      { path: "payment-processing", Component: PaymentProcessing },
      { path: "bagging-area", Component: BaggingArea },
      { path: "complete", Component: Complete },
    ],
  },
]);
