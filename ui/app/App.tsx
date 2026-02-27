import { Page } from "@dynatrace/strato-components-preview/layouts";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Scheduler } from "./pages/Scheduler";
import { Create } from "./pages/Create";

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<Create/>}/>
          <Route path="/scheduler" element={<Scheduler/>}/>
        </Routes>
      </Page.Main>
    </Page>
  );
};
