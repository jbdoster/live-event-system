import { DataAccessObject as RulesDataAccessObject, Filters as RulesFilters } from "./rules";
import { DataAccessObject as SubscriptionsDataAccessObject, Filters as SubscriptionsFilters } from "./subscriptions";

export type DataAccessObject = RulesDataAccessObject | SubscriptionsDataAccessObject;
export type Filters = RulesFilters | SubscriptionsFilters;

export { default as rules } from "./rules";
export { default as subscriptions } from "./subscriptions";