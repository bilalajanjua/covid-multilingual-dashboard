import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import MainLayout from "./shared/MainLayout";
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Source,
  Layer,
  setRTLTextPlugin
} from "react-map-gl";

import { useQuery } from "react-apollo";
import { Spin, Divider, Select, PageHeader } from "antd";
import { useTranslation } from "react-i18next";

import {
  MAP_TOKEN,
  MAP_STYLE,
  MAP_RTL_LINK,
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer
} from "../config/map.config.js";
import { GET_COUNTRIES_DATA } from "../services/map.service";

import "mapbox-gl/dist/mapbox-gl.css";
import { Show500Error } from "./shared/500Error";

const { Option } = Select;

setRTLTextPlugin(MAP_RTL_LINK, null, true);

function Map(props) {
  const containerRef = useRef();

  const { loading, data, error } = useQuery(GET_COUNTRIES_DATA);

  const { t } = useTranslation();

  const [selectedCriteria, setSelectedCriteria] = useState(
    "searchByCountry.text.totalCases,cases"
  );

  useEffect(() => {
    if (data && selectedCriteria) getMapFeatures();
  }, [data, selectedCriteria]);

  const [mapFeatures, setMapFeatures] = useState({
    type: "FeatureCollection",
    features: []
  });

  const [viewport, setViewport] = useState({
    width: "100%",
    height: 600,
    latitude: 30,
    longitude: 70,
    zoom: 3
  });

  useLayoutEffect(() => {
    function updateViewport() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setViewport({
          ...viewport,
          width
        });
      }
    }
    window.addEventListener("resize", updateViewport);
    updateViewport();
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const getMapFeatures = () => {
    const features = data.countries.map(country => {
      return {
        type: "Feature",
        properties: {
          cases: country[selectedCriteria.split(",")[1]],
          country: country.country
        },
        geometry: {
          type: "Point",
          coordinates: [country.countryInfo.long, country.countryInfo.lat]
        }
      };
    });

    setMapFeatures({
      type: "FeatureCollection",
      features
    });
  };

  const onCriteriaSelection = criteria => {
    setSelectedCriteria(criteria);
  };

  return (
    <MainLayout {...props}>
      <div ref={containerRef}>
        {!error && (
          <React.Fragment>
            <PageHeader
              title={t("map.controlPanel.title")}
              subTitle={t("map.controlPanel.subtitle")}
              avatar={{ src: "/assets/icons/world.svg" }}
            />
            <Divider />
            <Spin spinning={loading}>
              <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={MAP_TOKEN}
                onViewportChange={setViewport}
                mapStyle={MAP_STYLE}
              >
                {data && (
                  <Source
                    type="geojson"
                    data={mapFeatures}
                    cluster={true}
                    clusterMaxZoom={14}
                    clusterRadius={40}
                  >
                    <Layer {...clusterLayer} />
                    <Layer
                      {...clusterCountLayer(t(selectedCriteria.split(",")[0]))}
                    />
                    <Layer {...unclusteredPointLayer} />
                  </Source>
                )}
                <div
                  style={
                    t("site.direction") === "ltr"
                      ? {
                          right: 10,
                          position: "absolute",
                          direction: "ltr",
                          top: 10
                        }
                      : {
                          left: 10,
                          direction: "rtl",
                          position: "absolute",
                          top: 10
                        }
                  }
                >
                  <NavigationControl />
                  <FullscreenControl
                    container={document.querySelector("body")}
                  />
                  <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                  />
                </div>
                <div
                  className="control-panel"
                  style={
                    t("site.direction") === "ltr"
                      ? { left: 0, direction: "ltr" }
                      : { right: 0, direction: "rtl" }
                  }
                >
                  <label>
                    <b>{t("map.label.selectCriteria")}</b>
                  </label>
                  <br />
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    onSelect={onCriteriaSelection}
                    filterOption={(input, option) =>
                      t(option.value.split(",")[0])
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    defaultValue={selectedCriteria}
                  >
                    <Option
                      value={"searchByCountry.text.todayCases,todayCases"}
                    >
                      {t("searchByCountry.text.todayCases")}
                    </Option>
                    <Option
                      value={"searchByCountry.text.todayDeaths,todayDeaths"}
                    >
                      {t("searchByCountry.text.todayDeaths")}
                    </Option>
                    <Option value={"searchByCountry.text.totalCases,cases"}>
                      {t("searchByCountry.text.totalCases")}
                    </Option>
                    <Option value={"searchByCountry.text.totalDeaths,deaths"}>
                      {t("searchByCountry.text.totalDeaths")}
                    </Option>
                    <Option
                      value={"searchByCountry.text.recoveredCases,recovered"}
                    >
                      {t("searchByCountry.text.recoveredCases")}
                    </Option>
                    <Option value={"searchByCountry.text.activeCases,active"}>
                      {t("searchByCountry.text.activeCases")}
                    </Option>
                    <Option
                      value={"searchByCountry.text.criticalCases,critical"}
                    >
                      {t("searchByCountry.text.criticalCases")}
                    </Option>
                    <Option
                      value={
                        "searchByCountry.text.casesPerMillion,casesPerOneMillion"
                      }
                    >
                      {t("searchByCountry.text.casesPerMillion")}
                    </Option>
                    <Option
                      value={
                        "searchByCountry.text.deathsPerMillion,deathsPerOneMillion"
                      }
                    >
                      {t("searchByCountry.text.deathsPerMillion")}
                    </Option>
                  </Select>
                </div>
              </ReactMapGL>
            </Spin>
          </React.Fragment>
        )}
      </div>
      {!loading && error && <Show500Error />}
    </MainLayout>
  );
}

export default Map;
