import { Stack } from "@chakra-ui/react";
import { Field } from "../../../../components/ui/field";
import { ru } from "date-fns/locale";
import { DatePicker } from "../../../../components/DatePicker/DatePicker";
import "react-datepicker/dist/react-datepicker.css";

function PeriodPicker({settings, setSettings}) {
    return (
        <Stack>
            <Field label="Дата начала">
                <DatePicker
                    selected={new Date(settings.startDate)}
                    onChange={(date) => {
                        setSettings({...settings, startDate: date.getTime()});
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
                    selected={new Date(settings.endDate)}
                    onChange={(date) => {
                        setSettings({...settings, endDate: date.getTime()});
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
