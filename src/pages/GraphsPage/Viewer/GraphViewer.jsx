import { useEffect, useState } from "react";
import { HStack, IconButton, Card } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import faker from "faker";
import WebSocketService from "../../../services/websocketService";
const wsService = new WebSocketService("ws://192.168.1.1:8800");

const testData = [
    {
        variableName: "test1",
        variableValue: 4564,
        variableDesc: "РРРРРРРРРРРР",
        measureUnit: "кПа",
        timestamp: 1737430572676
    },
    {
        variableName: "test1",
        variableValue: 56,
        variableDesc: "РРРРРРРРРРРР",
        measureUnit: "кПа",
        timestamp: 1737431702339
    }
];

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    zoomPlugin,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Chart.js Line Chart",
        },
        zoom: {
            pan: {
                enabled: true,
                mode: "x",
                modifierKey: "ctrl"
            },
            zoom: {
                drag: {
                    enabled: true
                },
                mode: "x"
            }
        }
    },
};
  
const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data1 = {
    labels,
    datasets: [
        {
            label: "Dataset 1",
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
            label: "Dataset 2",
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
    ],
};

function GraphViewer({ wsRequest }) {
    console.log("Render GraphViewer");
    const [data, setData] = useState({
        labels,
        datasets: [
            {
                label: "Dataset 1",
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
                label: "Dataset 2",
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    });
    
    useEffect(() => {
        testData.forEach(element => {
            
        });
    }, []);

    useEffect(() => {
        wsService.connect();

        const messageHandler = (message) => {
            //console.log(message);
            appendLogs(message);
        };

        wsService.addMessageHandler(messageHandler);
        
        wsService.sendMessage({ graph: wsRequest });

        return () => {
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, []);

    return (
        <>
            <Card.Root
                w={"100%"}
                shadow={"xl"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{
                    _open: "scale-fade-in",
                }}
            >
                <Card.Header>
                    <HStack>
                        <Link to="/graphs" >
                            <IconButton
                                size={"xs"}
                                shadow={"xs"}
                                variant={"outline"}
                            >
                                <LuArrowLeft/>
                            </IconButton>
                        </Link>
                    </HStack>
                </Card.Header>
                <Card.Body>
                    <Line options={options} data={data} />
                </Card.Body>
            </Card.Root>
        </>
    );
}

export default GraphViewer;
