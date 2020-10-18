import React from "react";
import Map, { MapOptions, Maps } from "google-map-react";
import firebase from "firebase";
import "./Home.css";
import { Card, CardBody, Jumbotron } from "reactstrap";
import "typeface-roboto";
import styled, { keyframes } from "styled-components";
import { createGraph, GraphNode } from "../Alg";

const apiKey = "AIzaSyCJiHvsBg2dVQrVxyEmoNZayjH7m1orWGw";
const location = {
  address: "Broxton Rocks, Georgia",
  lat: 31.73909,
  lng: -82.85999,
};
const zoomLevel = 10;
const firebaseConfig = {
  apiKey: "AIzaSyDmRVqrP68RNSXyjopUz7od5HlGJ4vRLXM",
  authDomain: "treewatch-f6df4.firebaseapp.com",
  databaseURL: "https://treewatch-f6df4.firebaseio.com",
  projectId: "treewatch-f6df4",
  storageBucket: "treewatch-f6df4.appspot.com",
  messagingSenderId: "1087238844150",
  appId: "1:1087238844150:web:40fa1a8ffb6243dfc6c6d7",
  measurementId: "G-N2DG5BH91S",
};

const tempThreshold = 60;

const colors = {
  red: {
    light: "#ff8a80",
    dark: "#ff5252",
  },
  blue: { light: "#90caf9", dark: "#2196f3" },
  propBlack: { light: "#757575", dark: "#424242" },
  orange: { light: "#ffab91", dark: "#ff3d00" },
  green: {
    light: "#69f0ae",
    dark: "#00c853",
  },
};

type NodeMeta = {
  name: string;
  loc: {
    latitude: number;
    longitude: number;
  };
};
type LogItem = {
  co2: number;
  collector_id: number;
  humidity: number;
  sender_id: number;
  status: number;
  temp: number;
  timestamp: number;
};
export type Node = {
  meta: NodeMeta;
  log: LogItem[];
  color: {
    light: string;
    dark: string;
  };
};

async function copData() {
  const db = firebase.firestore();
  return db
    .collection("node-data")
    .get()
    .then((res) => {
      return res.docs;
    });
}

function Marker(props: {
  node: Node;
  onPress: () => void;
  [index: string]: any;
}) {
  let light = "",
    dark = "";
  if (!props.node.color) {
    light = colors.blue.light;
    dark = colors.blue.dark;
  } else {
    light = props.node.color.light;
    dark = props.node.color.dark;
  }

  const delay = 0;

  const pulseDot = keyframes`
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;
  const pulseRing = keyframes` 0% {
  transform: scale(0.5);
}
80%,
100% {
  opacity: 0;
}`;

  let ringAnim = 2.5;
  let dotAnim = 1.5;
  if (props.node.color && props.node.color !== colors.blue) {
    ringAnim = 1;
    dotAnim = 0.5;
  }

  let size = 20;
  if (props.node.color == colors.red) {
    size = 40;
  }

  const Ring = styled.div`
    animation: ${pulseRing} ${ringAnim}s cubic-bezier(0.215, 0.61, 0.355, 1)
      infinite;
    background-color: var(--marker, ${light});
    border-radius: 60px;
    content: "";
    display: block;
    height: 300%;
    left: -100%;
    position: relative;
    top: -100%;
    width: 300%;
  `;

  const Dot = styled.div`
    animation: ${pulseDot} ${dotAnim}s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s
      infinite;
    background-color: var(--marker, ${dark});
    border-radius: 50%;
    box-sizing: border-box;
    height: ${size}px;
    width: ${size}px;
    cursor: grab;
  `;

  return (
    <Dot onClick={props.onPress}>
      <Ring></Ring>
    </Dot>
  );
}

type Props = {};

type State = {
  nodes: Node[];
  selectedNodeIndex: number;
  prevColor?: {
    light: string;
    dark: string;
  };
  notification?: Node;
};
class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nodes: [],
      selectedNodeIndex: -1,
      prevColor: undefined,
      notification: undefined,
    };
  }

  renderSubscriptionOptions(classes: any) {
    if (!("serviceWorker" in navigator) && !("PushManager" in window)) {
      return (
        <p>
          Notification feature is supported only in:
          <br />
          Chrome Desktop and Mobile (version 50+)
          <br />
          Firefox Desktop and Mobile (version 44+)
          <br />
          Opera on Mobile (version 37+)
        </p>
      );
    } else {
      return <div>Enable/Disable GNIB(IRP) Appointment Notifications</div>;
    }
  }

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
    copData().then((data) => {
      let nodes: Node[] = [];
      data.forEach((doc) => {
        nodes.push(doc.data() as Node);
      });

      this.setState({ nodes: nodes });
    });

    // register service worker
  }

  notifCard = (node: Node) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          width: "50%",
          maxWidth: 500,
          padding: 20,
          borderRadius: 7.5,
          position: "absolute",
          top: "5vh",
          left: "30%",
        }}
      >
        <h1>
          Notification!<br></br> New Node Data Available
        </h1>
        <h2 style={{ marginTop: 10 }}>{node.meta.name}</h2>
        <div
          style={{
            borderRadius: 4,
            backgroundColor: "#e0e0e0",
            marginTop: 5,
            padding: 15,
          }}
        >
          <h3>
            Current Status:
            <span
              style={{
                fontWeight: "normal",
                position: "absolute",
                color: 'red',
                right: 40,
              }}
            >
              {" "}
              Not Connected
            </span>
          </h3>
          <h3 style={{ marginTop: 5 }}>
            Latitude:{" "}
            <span
              style={{
                fontWeight: "normal",
                position: "absolute",
                right: 40,
              }}
            >
              {node.meta.loc.latitude.toFixed(6)}
            </span>
          </h3>
          <h3 style={{ marginTop: 5 }}>
            Longitude:{" "}
            <span
              style={{
                fontWeight: "normal",
                position: "absolute",
                right: 40,
              }}
            >
              {node.meta.loc.longitude.toFixed(6)}
            </span>
          </h3>
        </div>
        <div
          id="data"
          style={{
            backgroundColor: "#0288d1",
            borderRadius: 7.5,
            marginTop: 15,
            padding: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 40,
                height: 40,
                marginTop: 10,
              }}
              src="https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/sun-512.png"
            />
            <p style={{ paddingTop: 10, paddingLeft: 10, fontWeight: "bold" }}>
              Temperature
            </p>
            <div
              style={{
                marginTop: 5,
                position: "absolute",
                right: 30,
                backgroundColor: "#ff8a80",
                padding: 5,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 10,
              }}
            >
              <p style={{ color: "white", fontWeight: "bold" }}>
                {node.log[node.log.length - 1].temp.toFixed(2)}°C
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 40,
                height: 40,
                marginTop: 10,
              }}
              src="https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/rain-512.png"
            />
            <p style={{ paddingTop: 10, paddingLeft: 10, fontWeight: "bold" }}>
              Humidity
            </p>
            <div
              style={{
                marginTop: 5,
                position: "absolute",
                right: 30,
                backgroundColor: "#82b1ff",
                padding: 5,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 10,
              }}
            >
              <p style={{ color: "white", fontWeight: "bold" }}>
                {" "}
                {node.log[node.log.length - 1].humidity.toFixed(2)}%
              </p>
            </div>
          </div>{" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 40,
                height: 40,
                marginTop: 10,
              }}
              src="https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png"
            />
            <p style={{ paddingTop: 10, paddingLeft: 10, fontWeight: "bold" }}>
              Air Quality (CO2)
            </p>
            <div
              style={{
                marginTop: 5,
                position: "absolute",
                right: 30,
                backgroundColor: "#69f0ae",
                padding: 5,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 10,
              }}
            >
              <p style={{ color: "white", fontWeight: "bold" }}>
                {node.log[node.log.length - 1].co2.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            padding: 15,
            backgroundColor: colors.blue.light,
            borderRadius: 5,
          }}
          onClick={() => {
            this.setState({ notification: undefined });
          }}
        >
          <h2 style={{ color: "white" }}>Close</h2>
        </div>
      </div>
    );
  };

  card = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          width: "30%",
          maxWidth: 300,
          padding: 20,
          margin: 20,
          borderRadius: 7.5,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <h1>Explore</h1>
        <h2 style={{ marginTop: 10 }}>
          {this.state.nodes[this.state.selectedNodeIndex].meta.name}
        </h2>
        <div
          style={{
            borderRadius: 4,
            backgroundColor: "#e0e0e0",
            marginTop: 5,
            padding: 15,
          }}
        >
          <h3>
            Current Status:
            <span
              style={{
                fontWeight: "normal",
                position: "absolute",
                right: 40,
                color: 'red'
              }}
            >
              {" "}
              Not Connected
            </span>
          </h3>
          <h3 style={{ marginTop: 5 }}>
            Latitude:{" "}
            <span
              style={{
                fontWeight: "normal",
                position: "absolute",
                right: 40,
              }}
            >
              {this.state.nodes[
                this.state.selectedNodeIndex
              ]?.meta.loc.latitude.toFixed(6)}
            </span>
          </h3>
          <h3 style={{ marginTop: 5 }}>
            Longitude:{" "}
            <span
              style={{
                fontWeight: "normal",
                position: "absolute",
                right: 40,
              }}
            >
              {this.state.nodes[
                this.state.selectedNodeIndex
              ].meta.loc.longitude.toFixed(6)}
            </span>
          </h3>
        </div>
        <div
          id="data"
          style={{
            backgroundColor: "#0288d1",
            borderRadius: 7.5,
            marginTop: 15,
            padding: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 40,
                height: 40,
                marginTop: 10,
              }}
              src="https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/sun-512.png"
            />
            <p style={{ paddingTop: 10, paddingLeft: 10, fontWeight: "bold" }}>
              Temperature
            </p>
            <div
              style={{
                marginTop: 5,
                position: "absolute",
                right: 30,
                backgroundColor: "#ff8a80",
                padding: 5,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 10,
              }}
            >
              <p style={{ color: "white", fontWeight: "bold" }}>
                {this.state.nodes[this.state.selectedNodeIndex].log[
                  this.state.nodes[this.state.selectedNodeIndex].log.length - 1
                ].temp.toFixed(2)}
                °C
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 40,
                height: 40,
                marginTop: 10,
              }}
              src="https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/rain-512.png"
            />
            <p style={{ paddingTop: 10, paddingLeft: 10, fontWeight: "bold" }}>
              Humidity
            </p>
            <div
              style={{
                marginTop: 5,
                position: "absolute",
                right: 30,
                backgroundColor: "#82b1ff",
                padding: 5,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 10,
              }}
            >
              <p style={{ color: "white", fontWeight: "bold" }}>
                {" "}
                {this.state.nodes[this.state.selectedNodeIndex].log[
                  this.state.nodes[this.state.selectedNodeIndex].log.length - 1
                ].humidity.toFixed(2)}
                %
              </p>
            </div>
          </div>{" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 40,
                height: 40,
                marginTop: 10,
              }}
              src="https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png"
            />
            <p style={{ paddingTop: 10, paddingLeft: 10, fontWeight: "bold" }}>
              Air Quality (CO2)
            </p>
            <div
              style={{
                marginTop: 5,
                position: "absolute",
                right: 30,
                backgroundColor: "#69f0ae",
                padding: 5,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 10,
              }}
            >
              <p style={{ color: "white", fontWeight: "bold" }}>
                {this.state.nodes[this.state.selectedNodeIndex].log[
                  this.state.nodes[this.state.selectedNodeIndex].log.length - 1
                ].co2.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  randInRange = (start: number, end: number) => {
    return Math.random() * (end - start) + start;
  };

  skewedRandInRange = (start: number, end: number) => {
    return Math.pow(Math.random(), 10) * (end - start) + start;
  };

  simulate = () => {
    // generate a bunch of nodes
    let nodes: Node[] = [];
    let startLat = 31.7,
      endLat = 31.9;
    let startLon = -83,
      endLon = -82.7;
    let n = 25;
    for (var i = 0; i < n; i++) {
      let lat = this.randInRange(startLat, endLat);
      let lon = this.randInRange(startLon, endLon);
      let log: LogItem[] = [];
      for (var j = 0; j < this.randInRange(1, 3); j++) {
        let temp = this.skewedRandInRange(30, 200);
        let humidity = this.randInRange(30, 100);
        let airquality = temp * 150;
        log.push({
          co2: airquality,
          humidity: humidity,
          temp: temp,
          timestamp: Date.now(),
          status: 1,
          collector_id: this.randInRange(1, 3),
          sender_id: this.randInRange(1, n),
        });
      }
      let color = colors.blue;
      if (log[log.length - 1].temp > tempThreshold) {
        color = colors.red;
      }
      nodes.push({
        meta: {
          loc: {
            latitude: lat,
            longitude: lon,
          },
          name: "Node " + i,
        },
        log: log,
        color: color,
      });
    }
    this.setState({ nodes: nodes });
  };

  createGraph = (): GraphNode => {
    return createGraph(this.state.selectedNodeIndex, this.state.nodes);
  };

  simulateGraphProp = async () => {
    let graph = this.createGraph();
    let q: GraphNode[] = [];
    q.push(graph);
    type Visits = {
      [index: string]: boolean;
    };
    let visited: Visits = {};
    while (q.length > 0) {
      let node = q.shift();
      let edges = node?.edges;

      // set all edge colors to new color
      let current = this.state.nodes;
      let ct = 0;
      edges?.forEach((val, ind) => {
        if (!visited[val.data.meta.name]) {
          current[val.index].color = colors.green;
          q.push(val);
          visited[val.data.meta.name] = true;
          ct += 1;
        } else {
          current[val.index].color = colors.orange;
        }
      });
      this.setState({ nodes: current });
      if (ct > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  render() {
    return (
      <div style={{ height: "100vh" }} className="Home">
        <Map
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={location}
          defaultZoom={zoomLevel}
          options={mapOptions}
          onClick={(val) => {}}
        >
          {this.state.nodes.map((val, ind, arr) => {
            return (
              <Marker
                lat={val.meta.loc.latitude}
                lng={val.meta.loc.longitude}
                name={val.meta.name}
                node={val}
                color="#80d8ff"
                onPress={() => {
                  let current = this.state.nodes;
                  let prevColor = this.state.prevColor;
                  if (this.state.selectedNodeIndex != -1 && prevColor) {
                    current[this.state.selectedNodeIndex].color = prevColor;
                  }
                  if (current[ind].color) {
                    prevColor = current[ind].color;
                  } else {
                    prevColor = colors.blue;
                  }
                  current[ind].color = colors.green;

                  this.setState({
                    nodes: current,
                    selectedNodeIndex: ind,
                    prevColor: prevColor,
                  });
                }}
              />
            );
          })}
        </Map>
        <div
          style={{
            padding: 20,
            borderRadius: 10,
            position: "absolute",
            bottom: 30,
            left: 30,
            backgroundColor: "#0091ea",
          }}
          onClick={() => {
            this.simulate();
          }}
        >
          <h1 style={{ fontWeight: "bold", color: "white" }}>Simulate</h1>
        </div>
        <div
          style={{
            padding: 20,
            borderRadius: 10,
            position: "absolute",
            bottom: 30,
            left: 200,
            backgroundColor: "#0091ea",
          }}
          onClick={() => {
            this.simulateGraphProp();
          }}
        >
          <h1 style={{ fontWeight: "bold", color: "white" }}>Propogate</h1>
        </div>

        {this.state.selectedNodeIndex >= 0 ? this.card() : undefined}
        {this.state.notification
          ? this.notifCard(this.state.notification)
          : undefined}
      </div>
    );
  }
}

function mapOptions(maps: Maps): MapOptions {
  return {
    streetViewControl: false,
    scaleControl: false,
    fullscreenControl: false,
    panControl: false,
    draggable: true,
    styles: [
      {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
    ],
    gestureHandling: "greedy",
    disableDoubleClickZoom: true,
    minZoom: 11,
    maxZoom: 18,
    draggableCursor: "default",
    draggingCursor: "default",
    mapTypeControl: true,
    mapTypeId: maps.MapTypeId.SATELLITE,
    mapTypeControlOptions: {
      style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: maps.ControlPosition.BOTTOM_CENTER,
      mapTypeIds: [],
    },

    zoomControl: false,
    clickableIcons: false,
  };
}

export default Home;
