import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useRef, useEffect, useState } from "react";
import "../styles/ApiStats.scss";

const UsageGraph = ({ data = {}, xKey = "floatXKey", yKey = "calls" }) => {
  
  //format data 
  const xKeys = data.xKeys;
  const usage = data.usage;

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);  
    
  // Step 3: Resizing chart logic
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const minBarWidth = 50;
  const chartWidth = xKeys.length * minBarWidth < containerRef.current?.offsetWidth ? containerRef.current?.offsetWidth : xKeys.length * minBarWidth;     
  
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: 220,
        display: "flex",
        background: "#fff",
        position: "relative",        
      }}
    >
      {/* Fixed Y-axis */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 30,
          height: 200,
          overflow: "hidden",
          zIndex: 100,
          background: "#fff",
          pointerEvents: "none",                                          
        }}
      >
        <LineChart width={30} height={220} data={usage} >
          
          <XAxis dataKey={xKey} height={20} tick={{ fontSize: 12 }} style={{ display:"none" }} />
          
          <YAxis
            dataKey={yKey}
            width={24}                                
            tick={{ fontSize: 12 }}  
            padding={{ top: 8 }}                      
          />                    
          
        </LineChart>
      </div>

      {/* Scrollable chart */}
      <div
        style={{
          overflowX: "auto",
          overflowY:"hidden",
          width: "100%",         
        }}
      >
        <div style={{ width: chartWidth }}>
          <LineChart width={chartWidth} height={220} data={usage}>
            <CartesianGrid strokeDasharray="3 3" vertical horizontal />

            <XAxis
              dataKey={xKey}
              type="number"
              domain={[0, xKeys.length - 1]}
              ticks={xKeys.map((_, i) => i)}                           
              tickFormatter={(index) => xKeys[index]}
              interval={0}              
              height={20}
              tick={{ fontSize: 12 }}
              padding={{ left: 26, right: 8 }}
              scale="linear"
            />                        

            <YAxis padding={{ top: 8 }} hide />

            <Tooltip
  contentStyle={{ fontSize: 12 }}
  labelFormatter={(label, payload) => {
    const time = payload?.[0]?.payload?.time;
    return `time: ${time || label}`;
  }}
/>

            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#4f46e5"
              strokeWidth={1.5}
              dot={{
                  r:2,
                  stroke:"#4f46e5",
                  strokeWidth: 1,
                  fill:"#fff"
              }}
              activeDot={{
                r: 3,
                stroke: "#4f46e5",
                strokeWidth: 1.5,
                fill: "#fff",
              }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default UsageGraph;