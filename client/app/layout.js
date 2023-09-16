"use client";

import "./globals.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Wrapper from "./wrapperComponent";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Wrapper>{children}</Wrapper>
        </Provider>
      </body>
    </html>
  );
}
