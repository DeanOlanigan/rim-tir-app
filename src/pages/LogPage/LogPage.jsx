import { Flex, Container, Heading, IconButton, Text, Grid, ScrollArea, Select, Card, RadioCards, Box, Button, Callout, Spinner } from "@radix-ui/themes";
import { DownloadIcon, EyeOpenIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

function LogPlaceTypeCard({ headingText, logList, loading, selectedLog, onSelectLog }) {
    const handleSelect = (log) => {
        onSelectLog(log);
    };

    const downloadAllLogFiles = () => {
        let type = '';
        switch (headingText) {
            case 'Логи на sd карте роутера':
                type = 'sd';
                break;
            case 'Логи во внутренней памяти роутера':
            default:
                type = 'r';
                break;
        }
        const fetchDownload = async () => {
            try {
                const response = await fetch(`http://192.168.1.1:8080/api/v1/getArchive?archive=logs&type=${type}`);
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    alert('TASK STARTED');
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (err) {
                throw new Error(`Ошибка: ${err.message}`);
            }
        }
        fetchDownload();
    }

    return (
        <Card>
            <Flex direction={'column'} gap={'2'}>
                <Heading size={'3'}>{headingText}</Heading>
                <Button 
                    loading={loading}
                    size={'2'}
                    variant='surface'
                    style={{width: '100%'}}
                    onClick={downloadAllLogFiles}>
                    <DownloadIcon width={18} height={18} /> Скачать все логи из списка
                </Button>
                <Spinner loading={loading}>
                    <ScrollArea type='always' scrollbars='vertical' style={{height: '30vh'}} size={'1'}>
                        <Box px={'4'}>
                            {logList && logList.length > 0 ? (
                                <RadioCards.Root 
                                    gap={'2'}
                                    size={'1'}
                                    variant='surface'
                                    onValueChange={(value) => handleSelect(value)}
                                    value={selectedLog.type === headingText ? selectedLog.name : null}>
                                    {logList.map((log, index) => (
                                        <RadioCards.Item 
                                            key={index}
                                            value={log}
                                            text={log}>
                                            {log}
                                        </RadioCards.Item>
                                    ))}
                                </RadioCards.Root>
                            ) : (
                                <Text weight={'medium'} as='div' align={'center'} color='tomato'>Не найдено</Text>
                            )}
                        </Box>
                    </ScrollArea>
                </Spinner>
            </Flex>
        </Card>
    )
}

function LogViewChoser({ loading }) {
    return (
        <>
            <Text weight={'regular'}>Количество отображаемых строк:</Text>
            <Flex direction={'column'} width={'5rem'}>
                <Select.Root defaultValue='500'>
                    <Select.Trigger />
                    <Select.Content position='popper'>
                        <Select.Item value='100'>100</Select.Item>
                        <Select.Item value='250'>250</Select.Item>
                        <Select.Item value='500'>500</Select.Item>
                        <Select.Item value='1000'>1000</Select.Item>
                        <Select.Item value='2500'>2500</Select.Item>
                        <Select.Item value='5000'>5000</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>
            <IconButton loading={loading} variant='outline'>
                <EyeOpenIcon width={18} height={18} />
            </IconButton>
        </>
    )
}

function LogChooser({ apiEndpoint }) {
    const [rLogs, setRLogs] = useState([]);
    const [sLogs, setSLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState({type: null, name: null});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    setRLogs(result.data.rLog || []);
                    setSLogs(result.data.sLog || []);
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [apiEndpoint]);

    return (
        <Flex direction={'column'} gap={'2'}>
            <Box pl={'4'}>
                <Heading size={'5'} color='gray'>Выберите файл</Heading>
            </Box>

            {error ? (
                <Callout.Root color='red'>
                    <Callout.Icon>
                        <CrossCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>
                        {error}
                    </Callout.Text>
                </Callout.Root>
            ) : <></> }
            
            <Grid columns={'2'} width={'auto'} gap={'1'}>
                <LogPlaceTypeCard 
                    headingText={'Логи на sd карте роутера'}  
                    loading={loading}
                    logList={sLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: 'Логи на sd карте роутера', name })}/>
                <LogPlaceTypeCard 
                    headingText={'Логи во внутренней памяти роутера'} 
                    loading={loading}
                    logList={rLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: 'Логи во внутренней памяти роутера', name })}/>
            </Grid>
            <Flex gap={'2'} align={'center'} justify={'end'} direction={'row'}>
                <LogViewChoser loading={loading} />
            </Flex>
        </Flex>
    )
}

function LogPage() {
    return (
        <Container size={'2'}>
            <LogChooser apiEndpoint={'http://192.168.1.1:8080/api/v1/getLogfilesList'} />
        </Container>
    )
}

export default LogPage;
