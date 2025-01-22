import { Stack } from "@chakra-ui/react";
import { Field } from "../../../../components/ui/field";
import { ru } from "date-fns/locale";
import { DatePicker } from "../../../../components/DatePicker/DatePicker";
import "react-datepicker/dist/react-datepicker.css";

import { useGraphContext } from "../../../../providers/GraphProvider/GraphContext";

function PeriodPicker() {
    console.log("Render PeriodPicker");
    const { startDate, endDate, setStartDate, setEndDate} = useGraphContext();

    return (
        <Stack>
            <Field label="Дата начала">
                <DatePicker
                    selected={new Date(startDate)}
                    onChange={(date) => {
                        setStartDate(date.getTime());
                    }}
                    portalId="datepicker-portal"
                    popperPlacement="right-end"
                    showPopperArrow={false}
                    locale={ru}
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
            </Field>
            <Field label="Дата окончания"   >
                <DatePicker
                    selected={new Date(endDate)}
                    onChange={(date) => {
                        setEndDate(date.getTime());
                    }}
                    portalId="datepicker-portal"
                    popperPlacement="right-end"
                    showPopperArrow={false}
                    locale={ru}
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
            </Field>
        </Stack>
    );
}

export default PeriodPicker;
