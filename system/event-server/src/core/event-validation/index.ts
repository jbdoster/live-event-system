import { Message } from "../types";

import { DataAccessObject } from "../io/api/EventRules";

export default (
    message: Message,
    rules: DataAccessObject[],
): void => {
    if (!message.sessionId) {
        throw new Error("Message missing session ID");
    }
    if (!message.version) {
        throw new Error("Message missing version number");
    }

    if (typeof message.version !== typeof 1) {
        throw new Error("Version number must be an integer.");
    }

    if (!message.eventKey) {
        throw new Error("Message missing event key");
    }

    if (!rules.length) {
        throw new Error("Rules definition needed for event: " + message.eventKey);
    }

    const required = rules.filter(rule => rule.required);
    const missing = required.find(r => !message.data[r.event_property_key]);
    if (missing) {
        throw new Error("Property missing: " + missing.event_property_key)
    }

    Object.keys(message.data).forEach(
        propertyKey => {
            const rulesByProperty = rules.filter(
                rule => rule.event_property_key === propertyKey && typeof propertyKey === rule.event_property_data_type
            );
            if (!rulesByProperty.length) {
                throw new Error(`Event data property missing rules: ${message.eventKey} ${propertyKey}`);
            }
            rulesByProperty.forEach(
                rule => {
                    const value = message.data[propertyKey];
                    const dataType = typeof value;

                    if (rule.event_property_data_type !== dataType) {
                        throw new Error(`Incorrect data type: ${message.eventKey} ${propertyKey} required: ${rule.event_property_data_type} actual: ${dataType}`);
                    }


                    if (dataType === "number") {
                        if ((value as number) < (rule?.number_value_minimum as number)) {
                            throw new Error(`Mimimum integer value exceeded ${message.eventKey} ${propertyKey} minimum: ${rule.number_value_minimum} actual: ${value}`);
                        }
                        if ((value as number) > (rule?.number_value_maximum as number)) {
                            throw new Error(`Maximum integer value exceeded ${message.eventKey} ${propertyKey} minimum: ${rule.number_value_minimum} actual: ${value}`);
                        }
                    }

                    if (dataType === "string") {
                        if ((value as string).length > (rule.string_length_maximum as number)) {
                            throw new Error(`Maximum character length exceeded ${message.eventKey} ${propertyKey} minimum: ${rule.number_value_minimum} actual: ${value}`);
                        }
                    }
                }
            )
        }
    )
    // rules.forEach(
    //     rule => {
    //         const rulesByProperty = rule
    //     }
    // );
}