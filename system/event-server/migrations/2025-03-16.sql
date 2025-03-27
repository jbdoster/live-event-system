--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: events; Type: SCHEMA; Schema: -; Owner: admin
--

CREATE SCHEMA events;


ALTER SCHEMA events OWNER TO admin;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA events;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: rules; Type: TABLE; Schema: events; Owner: admin
--

CREATE TABLE events.rules (
    event_key character varying(32) NOT NULL,
    id uuid DEFAULT events.uuid_generate_v4() NOT NULL,
    required boolean,
    event_property_data_type character varying(10),
    number_value_minimum integer,
    number_value_maximum integer,
    string_length_maximum integer,
    regular_expression_match character varying,
    version integer NOT NULL,
    event_property_key character varying(32) NOT NULL
);


ALTER TABLE events.rules OWNER TO admin;

--
-- Data for Name: rules; Type: TABLE DATA; Schema: events; Owner: admin
--

COPY events.rules (event_key, id, required, event_property_data_type, number_value_minimum, number_value_maximum, string_length_maximum, regular_expression_match, version, event_property_key) FROM stdin;
update_user_profile	6af0f812-f2af-43eb-82ee-8c3be542b886	\N	string	\N	\N	50	^[a-zA-Z'-]+$	1	firstName
\.


--
-- Name: rules event_key_unique; Type: CONSTRAINT; Schema: events; Owner: admin
--

ALTER TABLE ONLY events.rules
    ADD CONSTRAINT event_key_unique UNIQUE (event_key);


--
-- Name: rules id_primary_key; Type: CONSTRAINT; Schema: events; Owner: admin
--

ALTER TABLE ONLY events.rules
    ADD CONSTRAINT id_primary_key PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

