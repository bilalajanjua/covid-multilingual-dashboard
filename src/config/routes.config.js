import React from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Search from "../components/Search";
import Country from "../components/Country";
import Map from "../components/Map";

export const MainRoutes = () => (
  <Switch>
    <Route exact path="/" component={Dashboard} />
    <Route exact path="/search" component={Search} />
    <Route exact path="/country/:name" component={Country} />
    <Route exact path="/map" component={Map} />
    <Route render={() => <h3>No Match</h3>} />
  </Switch>
);
