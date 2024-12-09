import { Flex, Container, Heading, IconButton, Card } from "@radix-ui/themes";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";

function LogPage() {
    return (
        <Flex height={'100%'} align={'stretch'} justify={'start'} direction={'column'}>
            <Container size={'3'}>
                <Flex gap={'4'} align={'center'} justify={'center'}>
                    <Heading>Log</Heading>
                    <IconButton variant='ghost'>
                        <MixerHorizontalIcon width={18} height={18} />
                    </IconButton>
                </Flex>
                <Card size={'1'} style={{ height: '100%' }}>
                </Card>
            </Container>
        </Flex>
    )
}

export default LogPage;