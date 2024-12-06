import { useState } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { Tree } from 'react-arborist';
import SplitPane, { Pane, SashContent } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import './ConfigurationPage.css';

function ConfigurationPage() {
    const [sizes, setSizes] = useState([200, 'auto', 200]);

    const data = [
        {
            id: "1",
            name: "Прием",
            children: [
            { id: "c1", name: "General" },
            { id: "c2", name: "Random" },
            { id: "c3", name: "Open Source Projects" },
            ],
        },
        {
            id: "2",
            name: "Передача",
            children: [
            { id: "d1", name: "Alice" },
            { id: "d2", name: "Bob" },
            { id: "d3", name: "Charlie" },
            ],
        },
    ];

    return (
        <Box>
            <div style={{height: 500}}>
                <SplitPane 
                    split='vertical'
                    sizes={sizes}
                    onChange={setSizes}
                    resizerSize={3}
                    sashRender={(index, active) => (
                        <SashContent 
                            className={`sash-wrap-line ${active ? "active" : "inactive"}`}
                        >
                            <span className='line'/>
                        </SashContent>
                    )}>
                    <Pane minSize={100} maxSize='30%'>
                        <Flex height='100%' style={{background: "var(--accent-1)"}}>
                            <Tree initialData={data}/>
                        </Flex>
                    </Pane>
                    <Pane>
                        <Flex asChild height='100%' align='center' justify='center' style={{background: "var(--accent-2)"}}>
                            <Text>Конфигурация</Text>
                        </Flex>
                    </Pane>
                    <Pane minSize={100} maxSize='30%'>
                        <Flex asChild height='100%' align='center' justify='center' style={{background: "var(--accent-1)"}}>
                            <Text>Переменные</Text>
                        </Flex>
                    </Pane>
                </SplitPane>
            </div>
        </Box>
    )
}

export default ConfigurationPage;