import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import type { Title } from "../types";

// Setup icônes
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Composant Helper pour gérer le dessin nativement
const DrawControl = ({ onCreated }: { onCreated: (geo: any) => void }) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        marker: false,
        circle: false,
        rectangle: false,
        polyline: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawnItems },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      drawnItems.clearLayers(); // Ne garder qu'un seul polygone à la fois
      drawnItems.addLayer(e.layer);
      onCreated(e.layer.toGeoJSON());
    });

    return () => {
      map.removeControl(drawControl);
    };
  }, [map, onCreated]);

  return null;
};

interface MapComponentProps {
  titles: Title[];
  onDrawCreated?: (geojson: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  titles,
  onDrawCreated,
}) => {
  const center: [number, number] = [3.86195, 11.52187];

  return (
    <div className="w-full h-[500px] relative">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full outline-none"
        style={{ background: "#0f172a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {onDrawCreated && <DrawControl onCreated={onDrawCreated} />}

        {Array.isArray(titles) &&
          titles.map((title) => {
            const geom =
              typeof title.geometry === "string"
                ? JSON.parse(title.geometry)
                : title.geometry;
            if (
              geom &&
              (geom.type === "Polygon" || geom.type === "MultiPolygon")
            ) {
              return (
                <GeoJSON
                  key={title.titleID}
                  data={geom}
                  style={() => ({
                    color: "#2dd4bf",
                    weight: 3,
                    opacity: 0.8,
                    fillColor: "#2dd4bf",
                    fillOpacity: 0.15,
                  })}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(
                      `<div style="font-family: sans-serif; padding: 4px;">
                         <h4 style="margin: 0 0 8px 0; color: #0f172a; font-weight: 800; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">${title.titleID}</h4>
                         <div style="font-size: 12px; color: #64748b;">Propriétaire: <b>${title.owner}</b></div>
                       </div>`,
                    );
                  }}
                />
              );
            }
            return null;
          })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
