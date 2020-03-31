import React from "react";
import { Switch, Route, Link } from "react-router-dom";
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
    <Route
      render={() => (
        <h3>
          Invalid Route. <Link to="/">Back to Dashboard</Link>
        </h3>
      )}
    />
  </Switch>
);
