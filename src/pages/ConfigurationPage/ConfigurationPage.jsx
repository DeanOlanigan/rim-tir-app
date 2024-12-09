import { Box, Flex, Text, ContextMenu, DropdownMenu, IconButton } from '@radix-ui/themes';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Tree } from 'react-arborist';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './ConfigurationPage.css';

function ConfigurationPage() {

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
        <Box height='100%'>
            <PanelGroup autoSaveId='persistence' direction='horizontal'>
                <Panel collapsible={true} collapsedSize={0} minSize={9}>
                    <Flex px='5' align='center' justify='between' style={{background: 'var(--gray-4)', borderRadius: '0 var(--radius-4) 0 0'}}>
                        <Text>Проводник ИО</Text>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <IconButton variant='ghost'><DotsHorizontalIcon style={{color: 'var(--gray-12)'}}/></IconButton>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.CheckboxItem>Прием</DropdownMenu.CheckboxItem>
                                <DropdownMenu.CheckboxItem>Передача</DropdownMenu.CheckboxItem>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                    <PanelGroup autoSaveId='persistence1' direction='vertical'>
                        <Panel minSize={15} style={{background: 'var(--gray-4)', borderRadius: '0 0 var(--radius-4) 0'}}>
                            <Flex px='5'justify='center'>
                                <Text>Прием</Text>
                            </Flex>
                            <Flex height='100%'>
                                <Tree initialData={data}/>
                            </Flex>
                        </Panel>
                        <PanelResizeHandle className='verticalLine'/>
                        <Panel minSize={15} style={{background: 'var(--gray-4)', borderRadius: '0 var(--radius-4) 0 0'}}>
                            <Flex px='5'justify='center'>
                                <Text>Передача</Text>
                            </Flex>
                            <Flex asChild height='100%' align='center' justify='center'>
                                <ContextMenu.Root>
                                    <ContextMenu.Trigger>
                                        <Text>ИО</Text>        
                                    </ContextMenu.Trigger>
                                    <ContextMenu.Content>
                                        <ContextMenu.Item>Параметры</ContextMenu.Item>
                                    </ContextMenu.Content>
                                </ContextMenu.Root>
                            </Flex>
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className='verticalLine'/>
                <Panel minSize={15} style={{background: 'var(--gray-4)', borderRadius: 'var(--radius-4) var(--radius-4) 0 0'}}>
                    <Flex asChild height='100%' align='center' justify='center'>
                        <Text>Конфигурация</Text>
                    </Flex>
                </Panel>
                <PanelResizeHandle className='verticalLine'/>
                <Panel collapsible={true} collapsedSize={0} defaultSize={30} minSize={9} style={{background: 'var(--gray-4)', borderRadius: 'var(--radius-4) 0 0 0'}}>
                    <Flex px='5'justify='center'>
                        <Text>Переменные</Text>
                    </Flex>
                    <Flex asChild height='100%' align='center' justify='center'>
                        <Text>Переменные</Text>
                    </Flex>
                </Panel>
            </PanelGroup>
        </Box>
    )
}

export default ConfigurationPage;