import { HStack, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "faker";
import { Card } from "@chakra-ui/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
            text: "Chart.js Bar Chart",
        },
    },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
    labels,
    datasets: [
        {
            label: "Dataset 1",
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
            label: "Dataset 2",
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
    ],
};

function GraphViewer() {
    console.log("Render GraphViewer");
    
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
                    <Bar options={options} data={data} />
                </Card.Body>
            </Card.Root>
        </>
    );
}

export default GraphViewer;
