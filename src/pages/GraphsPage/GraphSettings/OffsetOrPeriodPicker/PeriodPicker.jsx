import { Field, Stack } from "@chakra-ui/react";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGraphStore } from "../../store/store";

export const PeriodPicker = () => {
    const startDate = useGraphStore((state) => state.startDate);
    const endDate = useGraphStore((state) => state.endDate);
    const setStartDate = useGraphStore.getState().setStartDate;
    const setEndDate = useGraphStore.getState().setEndDate;

    return (
        <Stack>
            <Field.Root>
                <Field.Label>Дата начала</Field.Label>
                <DatePicker
                    selected={new Date(startDate)}
                    onChange={(date) => {
                        setStartDate(date.getTime());
                    }}
                    portalId="datepicker-portal"
                    popperPlacement="right-end"
                    showPopperArrow={false}
                    timeFormat="HH:mm"
                    timeCaption="Время"
                    timeIntervals={15}
                    showTimeSelect={true}
                    dateFormat={"yyyy-MM-dd HH:mm"}
                    datePickerSize="xs"
                    inputProps={{
                        size: "xs",
                    }}
                    rootProps={{
                        p: "3px",
                    }}
                    placeholderText="Дата начала"
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Дата окончания</Field.Label>
                <DatePicker
                    selected={new Date(endDate)}
                    onChange={(date) => {
                        setEndDate(date.getTime());
                    }}
                    portalId="datepicker-portal"
                    popperPlacement="right-end"
                    showPopperArrow={false}
                    timeFormat="HH:mm"
                    timeCaption="Время"
                    timeIntervals={15}
                    showTimeSelect={true}
                    dateFormat={"yyyy-MM-dd HH:mm"}
                    datePickerSize="xs"
                    inputProps={{
                        size: "xs",
                    }}
                    rootProps={{
                        p: "2px",
                    }}
                    placeholderText="Дата окончания"
                />
            </Field.Root>
        </Stack>
    );
};
