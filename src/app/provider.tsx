"use client";
import Loading from "@/components/Loading";
import store, { persistor } from "@/redux/store";
import React from "react";
import { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

interface LayoutProps {
  children: ReactNode;
}

const Providers = ({ children }: Readonly<LayoutProps>) => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {domLoaded && <React.Fragment>{children}</React.Fragment>}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
