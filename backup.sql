--
-- PostgreSQL database dump
--

\restrict yiXceRwfI7NmoqO8Key4lXYHoFqizhHTpjSWBFg2Iv1fphC2bFY5eCU91S2yItf

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Name: company_site_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_site_tab (
    company character varying(80) NOT NULL,
    contract character varying(20) NOT NULL,
    description character varying(140),
    country character varying(80),
    create_date date,
    rowversion date,
    rowkey character varying(200),
    rowstate character varying(80)
);


ALTER TABLE public.company_site_tab OWNER TO postgres;

--
-- Name: company_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_tab (
    company character varying(80) NOT NULL,
    name character varying(400) NOT NULL,
    creation_date date NOT NULL,
    association_no character varying(200),
    default_language character varying(8) NOT NULL,
    logotype character varying(400),
    corporate_form character varying(32),
    country character varying(8) NOT NULL,
    created_by character varying(120) NOT NULL,
    localization_country character varying(80) NOT NULL,
    rowversion numeric(22,0) NOT NULL,
    rowkey character varying(200) NOT NULL
);


ALTER TABLE public.company_tab OWNER TO postgres;

--
-- Name: customer_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_info (
    customer_id character varying(80) NOT NULL,
    name character varying(400) NOT NULL,
    association_no character varying(200),
    corporate_form character varying(32),
    country character varying(8) DEFAULT 'TR'::character varying NOT NULL,
    party_type character varying(80),
    category character varying(80),
    check_limit character varying(20),
    limit_control_type character varying(80),
    default_language character varying(8) DEFAULT 'tr'::character varying NOT NULL,
    created_by character varying(80) NOT NULL,
    changed_by character varying(80),
    creation_date date NOT NULL,
    identifier_reference character varying(400),
    rowversion numeric(22,0) DEFAULT 1.0 NOT NULL,
    rowkey character varying(200) NOT NULL,
    rowtype character varying(120)
);


ALTER TABLE public.customer_info OWNER TO postgres;

--
-- Name: customer_order_line_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_order_line_tab (
    company character varying(80) NOT NULL,
    order_no character varying(48) NOT NULL,
    contract character varying(20) NOT NULL,
    line_no character varying(16) NOT NULL,
    rel_no character varying(16) NOT NULL,
    catalog_no character varying(100) NOT NULL,
    part_no character varying(100) NOT NULL,
    customer_part_no character varying(180),
    catalog_desc character varying(800),
    catalog_type character varying(4000),
    buy_qty_due numeric(22,2),
    customer_part_buy_qty numeric(22,2),
    base_sale_unit_price numeric(22,2),
    base_unit_price_incl_tax numeric(22,2),
    sale_unit_price numeric(22,2),
    unit_price_incl_tax numeric(22,2),
    sales_unit_meas character varying(40),
    price_unit_meas character varying(40),
    customer_part_unit_meas character varying(40),
    currency_rate numeric(22,2),
    discount numeric(22,2),
    additional_discount numeric(22,2),
    price_conv_factor numeric(22,2),
    customer_part_conv_factor numeric(22,2),
    date_entered date,
    planned_delivery_date date,
    planned_due_date date,
    promised_delivery_date date,
    real_ship_date date,
    wanted_delivery_date date,
    planned_ship_date date,
    first_actual_ship_date date,
    target_date date,
    line_item_no numeric(22,0),
    order_code character varying(12),
    delivery_type character varying(80),
    tax_code character varying(80),
    note_text character varying(4000),
    customer_no character varying(80),
    forward_agent_id character varying(80),
    ship_via_code character varying(12),
    delivery_terms character varying(20),
    part_ownership character varying(4000),
    activity_seq numeric(22,0),
    project_id character varying(40),
    customer_po_line_no character varying(16),
    free_of_charge character varying(4000),
    rowstate character varying(4000),
    rowversion numeric(22,0) DEFAULT 1 NOT NULL,
    rowkey character varying(200) NOT NULL
);


ALTER TABLE public.customer_order_line_tab OWNER TO postgres;

--
-- Name: customer_order_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_order_tab (
    company character varying(80) NOT NULL,
    order_no character varying(48) NOT NULL,
    contract character varying(20) NOT NULL,
    customer_no character varying(80) NOT NULL,
    customer_po_no character varying(200),
    date_entered date NOT NULL,
    wanted_delivery_date date,
    pay_term_base_date date,
    currency_code character varying(12),
    pay_term_id character varying(80),
    delivery_terms character varying(20),
    ship_via_code character varying(12),
    delivery_country_code character varying(4000),
    order_id character varying(12),
    authorize_code character varying(80),
    salesman_code character varying(80),
    bill_addr_no character varying(200),
    ship_addr_no character varying(200),
    internal_po_no character varying(48),
    note_text character varying(4000),
    rowstate character varying(4000),
    created_by character varying(80) NOT NULL,
    rowversion numeric(22,0) DEFAULT 1 NOT NULL,
    rowkey character varying(200) NOT NULL
);


ALTER TABLE public.customer_order_tab OWNER TO postgres;

--
-- Name: inventory_part; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_part (
    contract character varying(20) NOT NULL,
    part_no character varying(100) NOT NULL,
    accounting_group character varying(20),
    country_of_origin character varying(12),
    estimated_material_cost numeric(22,2),
    part_product_code character varying(20),
    part_product_family character varying(20),
    part_status character varying(4),
    planner_buyer character varying(80),
    prime_commodity character varying(20),
    second_commodity character varying(20),
    unit_meas character varying(40),
    sales_unit_meas character varying(40),
    description character varying(800),
    list_price numeric(22,2),
    list_price_incl_tax numeric(22,2),
    price_conv_factor numeric(22,2),
    tax_code character varying(80),
    tax_class_id character varying(80),
    sales_type character varying(4000),
    sales_type_db character varying(80),
    storage_width_requirement numeric(22,2),
    storage_height_requirement numeric(22,2),
    storage_depth_requirement numeric(22,2),
    storage_volume_requirement numeric(22,2),
    storage_weight_requirement numeric(22,2),
    min_storage_temperature numeric(22,2),
    max_storage_temperature numeric(22,2),
    min_storage_humidity numeric(22,2),
    max_storage_humidity numeric(22,2),
    standard_putaway_qty numeric(22,2),
    standard_pack_size numeric(22,2),
    create_date date,
    expected_leadtime numeric(22,0),
    rowversion numeric(22,0) DEFAULT 1.0 NOT NULL,
    rowkey character varying(200) NOT NULL,
    type_code_db character varying(50),
    type_code character varying(50)
);


ALTER TABLE public.inventory_part OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    module character varying(50) NOT NULL,
    page character varying(50) NOT NULL,
    action character varying(50) NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: prod_structure_head_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prod_structure_head_tab (
    contract character varying(20) NOT NULL,
    part_no character varying(100) NOT NULL,
    eng_chg_level character varying(20) NOT NULL,
    bom_type_db character varying(20) NOT NULL,
    note_text text,
    eff_phase_in_date date,
    eff_phase_out_date date,
    create_date date NOT NULL,
    rowstate character varying(4000),
    created_by character varying(80) NOT NULL,
    rowversion numeric(22,0) DEFAULT 1 NOT NULL,
    rowkey character varying(200) NOT NULL
);


ALTER TABLE public.prod_structure_head_tab OWNER TO postgres;

--
-- Name: prod_structure_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prod_structure_tab (
    contract character varying(20) NOT NULL,
    part_no character varying(100) NOT NULL,
    eng_chg_level character varying(20) NOT NULL,
    bom_type_db character varying(20) NOT NULL,
    alternative_no character varying(20) NOT NULL,
    line_item_no numeric(22,0) NOT NULL,
    line_sequence numeric(22,0) NOT NULL,
    operation_no numeric(22,0) NOT NULL,
    note_text text,
    source character varying(80),
    create_date date NOT NULL,
    last_activity_date date,
    component_part character varying(100),
    rowstate character varying(4000),
    created_by character varying(80) NOT NULL,
    rowversion numeric(22,0) DEFAULT 1 NOT NULL,
    rowkey character varying(200) NOT NULL
);


ALTER TABLE public.prod_structure_tab OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    "Code" character varying(64) NOT NULL,
    "Name" character varying(256) NOT NULL,
    "Price" numeric(18,2) NOT NULL,
    "StockQty" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: routing_head_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routing_head_tab (
    company character varying(80) NOT NULL,
    contract character varying(20) NOT NULL,
    part_no character varying(100) NOT NULL,
    routing_revision character varying(16) NOT NULL,
    bom_type character varying(80) NOT NULL,
    phase_in_date date,
    phase_out_date date,
    note_id numeric(22,0),
    note_text character varying(4000),
    create_date date,
    rowversion date,
    rowkey character varying(200)
);


ALTER TABLE public.routing_head_tab OWNER TO postgres;

--
-- Name: routing_operation_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routing_operation_tab (
    company character varying(80) NOT NULL,
    contract character varying(20) NOT NULL,
    part_no character varying(100) NOT NULL,
    routing_revision character varying(16) NOT NULL,
    bom_type character varying(80) NOT NULL,
    operation_no numeric(22,0) NOT NULL,
    operation_description character varying(140),
    work_center_no character varying(20),
    mach_run_factor numeric(22,0),
    mach_setup_time numeric(22,0),
    labor_class_no character varying(40),
    setup_labor_class_no character varying(40),
    crew_size numeric(22,0),
    setup_crew_size numeric(22,0),
    run_time_code character varying(80),
    note_text character varying(4000),
    rowversion date,
    rowkey character varying(200)
);


ALTER TABLE public.routing_operation_tab OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash text NOT NULL,
    role_id integer,
    status boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_center_tab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_center_tab (
    company character varying(80),
    contract character varying(20),
    work_center_no character varying(20),
    description character varying(140),
    work_center_code character varying(80),
    production_line character varying(48),
    department_no character varying(20),
    note_text text,
    create_date date,
    rowversion date,
    rowkey character varying(200),
    rowstate character varying(80)
);


ALTER TABLE public.work_center_tab OWNER TO postgres;

--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20251228123108_InitialCreate	10.0.1
20260108192228_AddCompanyTab	10.0.1
20260108194304_FixCompanyDate	10.0.1
20260111151633_AddCustomerInfoTable	10.0.1
20260111172139_CreateCustomerInfoTable	10.0.1
20241227000000_InitialCreate	8.0.0
20241228000000_AddUsers	8.0.0
20260115192003_RecreateCompanyTab	8.0.0
20260115201604_AddInventoryPartTable	10.0.1
\.


--
-- Data for Name: company_site_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_site_tab (company, contract, description, country, create_date, rowversion, rowkey, rowstate) FROM stdin;
TST	01	Ankara Tesisi	TR	\N	\N	TST_01_1769948973319	Active
\.


--
-- Data for Name: company_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_tab (company, name, creation_date, association_no, default_language, logotype, corporate_form, country, created_by, localization_country, rowversion, rowkey) FROM stdin;
TST	Test Firma	2026-01-11	123456	tr	logo.png	Anonim	TR	admin	Türkiye	4	bd32da0a-59f8-4145-8485-9033e997df79
\.


--
-- Data for Name: customer_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_info (customer_id, name, association_no, corporate_form, country, party_type, category, check_limit, limit_control_type, default_language, created_by, changed_by, creation_date, identifier_reference, rowversion, rowkey, rowtype) FROM stdin;
CUST001	Ahmet Yılmaz Ticaret	ASSN123456	as	TR	company	regular	warning	credit_limit	tr	System	System	2026-01-11	12345678901	2	cbb81c22-3503-40d4-a550-90a750898ad5	customer
CUST002	Test Ticaret	ASSN123454	as	TR	company	regular	warning	credit_limit	tr	System	admin	2026-01-11	12345678901	1	80ce6a0a-816c-4aba-8e78-4f7f21a21153	customer
CUST003	İstanbul Reklam ve Tabela A.Ş.	ASSN789012	as	TR	company	vip	warning	credit_limit	tr	admin	admin	2025-06-15	1234567890	1	d56f3e29-1a2c-4b8d-9e7f-0a1b2c3d4e5f	customer
CUST004	Ankara Neon Reklam Ltd. Şti.	ASSN345678	ltd	TR	company	corporate	block	both	tr	System	admin	2025-07-22	2345678901	1	a89b12cd-34ef-56gh-78ij-90kl12mn34op	customer
CUST005	İzmir Aydınlatmalı Tabelacılık	ASSN901234	ltd	TR	company	wholesale	warning	order_limit	tr	admin	\N	2025-08-10	3456789012	1	b23c45de-67f8-90ab-12cd-34ef56gh78ij	customer
CUST006	Panorama Reklam ve Organizasyon	ASSN567890	as	TR	company	corporate	no_limit	none	en	System	System	2025-09-05	4567890123	1	c34d56ef-78g9-01hi-23jk-45lm67no89pq	customer
CUST007	Mega Board Dijital Baskı Merkezi	ASSN123789	joint	TR	company	vip	block	credit_limit	tr	admin	admin	2025-10-18	5678901234	1	d45e67f8-90g1-23hi-45jk-67lm89no01pq	customer
CUST008	EuroSign GmbH	ASSN-EU-001	ltd	DE	company	wholesale	warning	both	de	System	\N	2025-11-01	DE123456789	1	e56f78g9-01h2-34ij-56kl-78mn90op12qr	customer
CUST009	Middle East Advertising LLC	ASSN-ME-005	as	AE	company	corporate	no_limit	credit_limit	ar	admin	admin	2025-11-30	AE500123456	1	f67g89h0-12i3-45jk-67lm-89no01pq23rs	customer
CUST010	Global Banner Co.	\N	as	US	company	regular	warning	order_limit	en	System	\N	2025-12-10	US987654321	1	g78h90i1-23j4-56kl-78mn-90op12qr34st	customer
CUST011	London Display Ltd.	ASSN-UK-044	ltd	GB	company	retail	block	both	en	admin	admin	2026-01-05	GB12345678	1	h89i01j2-34k5-67lm-89no-01pq23rs45tu	customer
CUST012	Paris Pub SARL	ASSN-FR-789	ltd	FR	company	regular	warning	credit_limit	fr	System	admin	2026-01-12	FR789123456	1	i90j12k3-45l6-78mn-90op-12qr34st56uv	customer
CUST013	Çelik Tabela (Mehmet Çelik)	\N	individual	TR	individual	retail	no_limit	none	tr	admin	\N	2025-07-30	11111111111	1	j01k23l4-56m7-89no-01pq-23rs45tu67vw	customer
CUST014	Şenol Reklam Atölyesi	ASSN-TR-555	individual	TR	individual	regular	warning	order_limit	tr	System	\N	2025-08-14	22222222222	1	k12l34m5-67n8-90op-12qr-34st56uv78wx	customer
CUST015	Bursa Işıl Reklam	ASSN-TR-321	cooperative	TR	company	regular	block	credit_limit	tr	admin	admin	2025-09-28	33333333333	1	l23m45n6-78o9-01pq-23rs-45tu67vw89xy	customer
CUST016	Antalya Sahil Tabela	\N	branch	TR	company	retail	warning	none	tr	System	admin	2025-10-11	44444444444	1	m34n56o7-89p0-12qr-34st-56uv78wx90yz	customer
CUST017	Ada Neon (Ahmet & Kardeşleri)	ASSN-TR-987	commandite	TR	company	regular	no_limit	both	tr	admin	\N	2025-11-25	55555555555	1	n45o67p8-90q1-23rs-45tu-67vw89xy01za	customer
CUST018	İstanbul Büyükşehir Belediyesi	\N	\N	TR	government	corporate	no_limit	none	tr	System	System	2025-12-01	\N	1	o56p78q9-01r2-34st-56uv-78wx90yz12ab	customer
CUST019	Türkiye Eğitim Gönüllüleri Derneği	ASSN-DER-001	non_profit	TR	non_profit	regular	warning	credit_limit	tr	admin	admin	2026-01-08	\N	1	p67q89r0-12s3-45tu-67vw-89xy01za23bc	customer
CUST020	Ankara Üniversitesi Rektörlüğü	\N	\N	TR	government	corporate	block	both	tr	System	\N	2026-01-15	66666666666	1	q78r90s1-23t4-56uv-78wx-90yz12za34cd	customer
CUST021	Çevre ve Şehircilik Bakanlığı (İl Müd.)	\N	government	TR	government	corporate	no_limit	none	tr	admin	admin	2026-01-20	\N	1	r89s01t2-34u5-67vw-89xy-01za23bc45de	customer
CUST022	Yerel Esnaf ve Sanatkarlar Odası	ASSN-ODA-076	cooperative	TR	non_profit	wholesale	warning	order_limit	tr	System	admin	2026-01-25	77777777777	1	s90t12u3-45v6-78wx-90yz-12za34bc56ef	customer
\.


--
-- Data for Name: customer_order_line_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_order_line_tab (company, order_no, contract, line_no, rel_no, catalog_no, part_no, customer_part_no, catalog_desc, catalog_type, buy_qty_due, customer_part_buy_qty, base_sale_unit_price, base_unit_price_incl_tax, sale_unit_price, unit_price_incl_tax, sales_unit_meas, price_unit_meas, customer_part_unit_meas, currency_rate, discount, additional_discount, price_conv_factor, customer_part_conv_factor, date_entered, planned_delivery_date, planned_due_date, promised_delivery_date, real_ship_date, wanted_delivery_date, planned_ship_date, first_actual_ship_date, target_date, line_item_no, order_code, delivery_type, tax_code, note_text, customer_no, forward_agent_id, ship_via_code, delivery_terms, part_ownership, activity_seq, project_id, customer_po_line_no, free_of_charge, rowstate, rowversion, rowkey) FROM stdin;
TST	SO10002	001	001	001	VIN-002	VIN-002	ANR-VINYL-01	Kalendir Vinil - 1.52m x 50m - Şeffaf	STANDARD	2.00	50.00	45.85	54.10	45.85	54.10	MT	M2	M2	1.00	0.00	0.00	50.00	1.00	2026-01-18	2026-01-26	\N	\N	\N	2026-01-28	\N	\N	\N	1	ORDER	STANDARD	KGV	Yüzey kaplama için şeffaf vinil	CUST004	\N	KARGO	EXW	COMPANY	1	PROJ-ANR-001	1	N	ACTIVE	2	45d8ddfa-2f6e-4ed2-b6f7-c591f2433cc3
TST	SO10001	001	001	001	ACR-001	ACR-001	IRT-PANEL-01	Akrilik Levha 3mm Kalınlık - 1220x2440mm - Şeffaf1	STANDARD	5.00	5.00	252.00	297.36	252.00	297.36	M2	M2	M2	1.00	5.00	0.00	1.00	1.00	2026-01-15	2026-01-23	\N	\N	\N	2026-01-25	\N	\N	\N	1	ORDER	STANDARD	KGV	Şeffaf arka panel için	CUST003	\N	KARGO	DAP	COMPANY	1	PROJ-IRT-001	1	N	ACTIVE	4	8dfb10cf-5422-4ea5-9868-5992b6171210
TST	SO10001	001	002	002	LED-002	LED-002	IRT-LED-02	LED Modül 50x50mm - Beyaz 6000K - IP65	STANDARD	120.00	120.00	119.00	140.42	119.00	140.42	ADET	ADET	ADET	1.00	10.00	0.00	1.00	1.00	2026-01-15	2026-01-23	\N	\N	\N	2026-01-25	\N	\N	\N	2	ORDER	STANDARD	KGV	Aydınlatma için beyaz LED modüller	CUST003	\N	KARGO	DAP	COMPANY	2	PROJ-IRT-001	2	N	ACTIVE	4	f395812d-9bef-40dc-bf80-3a50cbfa3710
TST	SO10001	001	003	003	AP-002	AP-002	IRT-FRAME-03	Alüminyum 40x40mm Kare Profil - 6 metre	STANDARD	45.00	8.00	169.00	199.42	169.00	199.42	MT	MT	MT	1.00	5.00	0.00	1.00	1.00	2026-01-15	2026-01-23	\N	\N	\N	2026-01-25	\N	\N	\N	3	ORDER	STANDARD	KGV	Tabela çerçevesi montajı için	CUST003	\N	KARGO	DAP	COMPANY	3	PROJ-IRT-001	3	N	ACTIVE	4	3da09b6a-df57-4337-bc46-e2fe453919e8
TST	SO10004	001	001	001	COMP-101	COMP-101	PRO-PANEL-01	Alüminyum Kompozit Panel 3mm - 1220x2440mm	STANDARD	20.00	20.00	133.00	156.94	133.00	156.94	M2	M2	M2	8.50	0.00	0.00	1.00	1.00	2026-01-22	2026-02-03	\N	\N	\N	2026-02-05	\N	\N	\N	1	ORDER	STANDARD	KGV	High-quality composite panel for corporate signage	CUST006	\N	HAVA	CIP	COMPANY	1	PROJ-PRO-001	1	N	ACTIVE	1	f395812d-9bef-40dc-bf80-3a50cbfa3711
TST	SO10005	001	001	001	ACR-002	ACR-002	MB-PANEL-01	Akrilik Levha 5mm Kalınlık - 1220x2440mm - Beyaz Opak	STANDARD	10.00	10.00	308.70	364.27	308.70	364.27	M2	M2	M2	1.00	0.00	0.00	1.00	1.00	2026-01-25	2026-02-01	\N	\N	\N	2026-02-03	\N	\N	\N	1	ORDER	STANDARD	KGV	Dijital baskı alt yüzeyi	CUST007	\N	KARGO	DDP	COMPANY	1	PROJ-MB-001	1	N	ACTIVE	1	3da09b6a-df57-4337-bc46-e2fe453919e9
TST	SO10005	001	002	002	VIN-001	VIN-001	MB-VINYL-02	Cast Vinil Film - 1.27m x 50m - Beyaz	STANDARD	2.00	100.00	25.90	30.56	25.90	30.56	MT	M2	M2	1.00	0.00	0.00	50.00	1.00	2026-01-25	2026-02-01	\N	\N	\N	2026-02-03	\N	\N	\N	2	ORDER	STANDARD	KGV	Baskı yüzeyi için cast vinil	CUST007	\N	KARGO	DDP	COMPANY	2	PROJ-MB-001	2	N	ACTIVE	1	45d8ddfa-2f6e-4ed2-b6f7-c591f2433cc4
TST	SO10012	001	001	001	AP-001	AP-001	IBB-PROFILE-01	Alüminyum 20x20mm Kare Profil - 6 metre	STANDARD	30.00	30.00	120.75	142.49	120.75	142.49	MT	MT	MT	1.00	0.00	0.00	1.00	1.00	2026-02-05	2026-02-18	\N	\N	\N	2026-02-20	\N	\N	\N	1	ORDER	STANDARD	KGV	Kamu binası tabela çerçevesi	CUST018	\N	KARGO	DDP	COMPANY	1	PROJ-IBB-001	1	N	ACTIVE	1	f395812d-9bef-40dc-bf80-3a50cbfa3712
TST	SO10012	001	002	002	ACR-003	ACR-003	IBB-PANEL-02	Akrilik Levha 2mm Kalınlık - 1220x2440mm - Kırmızı	STANDARD	15.00	15.00	211.05	249.04	211.05	249.04	M2	M2	M2	1.00	0.00	0.00	1.00	1.00	2026-02-05	2026-02-18	\N	\N	\N	2026-02-20	\N	\N	\N	2	ORDER	STANDARD	KGV	Yönlendirme panoları	CUST018	\N	KARGO	DDP	COMPANY	2	PROJ-IBB-001	2	N	ACTIVE	1	3da09b6a-df57-4337-bc46-e2fe453919e10
TST	SO10002	001	002	002	FAST-001	FAST-001	ANR-FAST-02	Kendinden Contalı Vida 4x20mm - Paslanmaz - 100 adet/paket	STANDARD	3.00	300.00	12.25	14.46	12.25	14.46	PAKET	ADET	ADET	1.00	0.00	0.00	0.01	100.00	2026-01-18	2026-01-26	\N	\N	\N	2026-01-28	\N	\N	\N	2	ORDER	STANDARD	KGV	Montaj vidaları	CUST004	\N	KARGO	EXW	COMPANY	2	PROJ-ANR-001	2	N	ACTIVE	2	5c94f1f9-cc04-4360-bdff-5f45b20ec550
TST	SO10003	001	001	001	LED-001	LED-001	IAT-LEDSTRIP-01	RGB LED Şerit 5050 - 5 metre - IP20	STANDARD	50.00	50.00	63.35	74.75	60.00	70.80	MT	MT	MT	1.00	5.28	0.00	1.00	1.00	2026-01-20	2026-01-28	\N	\N	\N	2026-01-30	\N	\N	\N	1	ORDER	STANDARD	KGV	Toptan alım indirimli fiyat	CUST005	\N	DENIZ	FCA	COMPANY	1	PROJ-IAT-001	1	N	ACTIVE	2	b8443d0c-dc75-4bf2-ae49-238d3a09b838
TST	SO10003	001	002	002	LED-003	LED-003	IAT-DRIVER-02	LED Driver 12V 5A - IP67 - Su Geçirmez	STANDARD	60.00	10.00	45.50	53.69	43.23	51.01	ADET	ADET	ADET	1.00	5.00	0.00	1.00	1.00	2026-01-20	2026-01-28	\N	\N	\N	2026-01-30	\N	\N	\N	2	ORDER	STANDARD	KGV	LED şeritler için güç kaynağı	CUST005	\N	DENIZ	FCA	COMPANY	2	PROJ-IAT-001	2	N	ACTIVE	2	8dfb10cf-5422-4ea5-9868-5992b6171211
TST	SO10009	001	001	001	MET-001	MET-001	CT-STEEL-01	Paslanmaz Çelik Levha 304 Kalite - 1mm - 1m²	STANDARD	2.00	2.00	45.50	53.69	45.50	53.69	M2	M2	M2	1.00	0.00	0.00	1.00	1.00	2026-01-30	2026-02-03	\N	\N	\N	2026-02-05	\N	\N	\N	1	ORDER	STANDARD	KGV	Paslanmaz çelik tabela gövdesi	CUST013	\N	KARGO	DAP	CUSTOMER	1	\N	1	N	ACTIVE	2	b8443d0c-dc75-4bf2-ae49-238d3a09b839
TST	SO10009	001	002	002	FAST-002	FAST-002	CT-FAST-02	Bağlantı Köşesi - Alüminyum - 90 derece - 25 adet/paket	STANDARD	2.00	50.00	21.28	25.11	21.28	25.11	PAKET	ADET	ADET	1.00	0.00	0.00	0.04	25.00	2026-01-30	2026-02-03	\N	\N	\N	2026-02-05	\N	\N	\N	2	ORDER	STANDARD	KGV	Montaj bağlantı köşeleri	CUST013	\N	KARGO	DAP	CUSTOMER	2	\N	2	N	ACTIVE	2	8dfb10cf-5422-4ea5-9868-5992b6171212
TST	SO10009	001	003	003	MET-001	MET-001	\N	Paslanmaz Çelik Levha 304 Kalite - 1mm - 1m²	STANDARD	1.00	\N	\N	\N	0.00	\N	\N	\N	\N	\N	\N	\N	1.00	\N	2026-01-30	\N	\N	\N	\N	\N	\N	\N	\N	\N	ORDER	\N	\N	\N	CUST013	\N	\N	\N	\N	\N	\N	\N	\N	ACTIVE	2	9b8f4ccd-6742-4274-a50e-b01aa6e41f9d
TST	SO07211	001	001	001	LED-003	LED-003	\N	LED Driver 12V 5A - IP67 - Su Geçirmez	STANDARD	1.00	\N	\N	\N	0.00	\N	\N	\N	\N	\N	\N	\N	1.00	\N	2026-01-31	\N	\N	\N	\N	\N	\N	\N	\N	\N	ORDER	\N	\N	\N	CUST001	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	1bca0a60-e6fd-43f7-b8ee-bff066217b71
\.


--
-- Data for Name: customer_order_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_order_tab (company, order_no, contract, customer_no, customer_po_no, date_entered, wanted_delivery_date, pay_term_base_date, currency_code, pay_term_id, delivery_terms, ship_via_code, delivery_country_code, order_id, authorize_code, salesman_code, bill_addr_no, ship_addr_no, internal_po_no, note_text, rowstate, created_by, rowversion, rowkey) FROM stdin;
TST	SO10002	001	CUST004	ANR-2456	2026-01-18	2026-01-28	2026-02-05	TRY	15GÜN	EXW	KARGO	TR	ORD002	AUTH002	SALES02	1	2	INT-ANR-001	Neon tabela ve montaj hizmeti	ACTIVE	admin	2	f395812d-9bef-40dc-bf80-3a50cbfa3707
TST	SO10003	001	CUST005	IAT-TS-789	2026-01-20	2026-01-30	2026-02-15	TRY	30GÜN	FCA	DENIZ	TR	ORD003	AUTH003	SALES01	1	1	INT-IAT-001	Toptan LED tabela siparişi	ACTIVE	admin	2	3da09b6a-df57-4337-bc46-e2fe453919e6
TST	SO10001	001	CUST003	IRT-2024-015	2026-01-15	2026-01-25	2026-02-10	TRY	30GÜN	DAP	KARGO	TR	ORD001	AUTH001	SALES01	1	1	INT-IRT-001	Aydınlatmalı tabela ve reklam panosu siparişi1	ACTIVE	admin	4	8dfb10cf-5422-4ea5-9868-5992b6171201
TST	SO10004	001	CUST006	PRO-INT-0224	2026-01-22	2026-02-05	2026-02-20	USD	60GÜN	CIP	HAVA	US	ORD004	AUTH004	SALES03	1	3	INT-PRO-001	International corporate signage order	ACTIVE	admin	1	45d8ddfa-2f6e-4ed2-b6f7-c591f2433cc1
TST	SO10005	001	CUST007	MB-4567-DB	2026-01-25	2026-02-03	2026-02-18	TRY	30GÜN	DDP	KARGO	TR	ORD005	AUTH005	SALES02	2	2	INT-MB-001	Büyük format dijital baskı ve laminasyon	ACTIVE	admin	1	5c94f1f9-cc04-4360-bdff-5f45b20ec548
TST	SO10012	001	CUST018	IBB-2024/156	2026-02-05	2026-02-20	2026-03-15	TRY	60GÜN	DDP	KARGO	TR	ORD012	AUTH012	SALES05	1	1	INT-IBB-001	Kamu hizmet binası tabelaları	ACTIVE	admin	1	b8443d0c-dc75-4bf2-ae49-238d3a09b837
TST	SO10009	001	CUST013	CT-2024-003	2026-01-30	2026-02-05	2026-02-12	TRY	PEŞİN	DAP	KARGO	TR	ORD009	AUTH009	SALES01	1	1	INT-CT-001	Paslanmaz çelik tabela ve montaj	ACTIVE	admin	2	3da09b6a-df57-4337-bc46-e2fe453919e7
TST	SO07211	001	CUST001	a	2026-01-31	2026-01-09	\N	TRY	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ACTIVE	admin	1	1fe66466-c9a7-42d0-9ad8-b074ac8cafd5
\.


--
-- Data for Name: inventory_part; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_part (contract, part_no, accounting_group, country_of_origin, estimated_material_cost, part_product_code, part_product_family, part_status, planner_buyer, prime_commodity, second_commodity, unit_meas, sales_unit_meas, description, list_price, list_price_incl_tax, price_conv_factor, tax_code, tax_class_id, sales_type, sales_type_db, storage_width_requirement, storage_height_requirement, storage_depth_requirement, storage_volume_requirement, storage_weight_requirement, min_storage_temperature, max_storage_temperature, min_storage_humidity, max_storage_humidity, standard_putaway_qty, standard_pack_size, create_date, expected_leadtime, rowversion, rowkey, type_code_db, type_code) FROM stdin;
TR001	AP-001	RAW	TR	85.50	ALU-PROF	ALUMINUM	ACT	Planlama-01	ALUMINUM	EXTRUSION	MT	MT	Alüminyum 20x20mm Kare Profil - 6 metre	120.75	142.49	1.00	KDV20	20	RETAIL	DB-RETAIL	0.02	0.02	6.00	0.00	2.50	15.00	35.00	30.00	70.00	50.00	10.00	2024-01-15	7	6	AP001_20240115_001	\N	\N
TR001	LED-001	ELEC	CN	45.25	LED-STRIP	ELECTRONICS	ACT	Planlama-03	ELECTRONICS	LIGHTING	METER	METER	RGB LED Şerit 5050 - 5 metre - IP20	63.35	74.75	1.00	KDV20	20	RETAIL	DB-RETAIL	0.01	0.01	0.05	0.00	0.80	5.00	40.00	20.00	80.00	100.00	20.00	2024-01-25	15	1	LED001_20240125_001	\N	\N
TR001	LED-002	ELEC	CN	85.00	LED-MODULE	ELECTRONICS	ACT	Planlama-03	ELECTRONICS	LIGHTING	UNIT	UNIT	LED Modül 50x50mm - Beyaz 6000K - IP65	119.00	140.42	1.00	KDV20	20	RETAIL	DB-RETAIL	0.05	0.05	0.05	0.00	0.05	5.00	40.00	20.00	80.00	200.00	50.00	2024-02-05	20	1	LED002_20240205_001	\N	\N
TR001	LED-003	ELEC	CN	32.50	LED-DRIVER	ELECTRONICS	ACT	Planlama-04	ELECTRONICS	POWER	UNIT	UNIT	LED Driver 12V 5A - IP67 - Su Geçirmez	45.50	53.69	1.00	KDV20	20	RETAIL	DB-RETAIL	0.08	0.04	0.12	0.00	0.30	5.00	40.00	20.00	80.00	80.00	20.00	2024-02-15	25	1	LED003_20240215_001	\N	\N
TR001	ACR-001	RAW	TR	180.00	ACRYLIC	SHEET	ACT	Planlama-05	PLASTIC	SHEET	SQM	SQM	Akrilik Levha 3mm Kalınlık - 1220x2440mm - Şeffaf	252.00	297.36	1.00	KDV20	20	WHOLESALE	DB-WHOLESALE	1.22	2.44	0.00	0.01	15.00	15.00	30.00	40.00	60.00	20.00	5.00	2024-01-30	5	1	ACR001_20240130_001	\N	\N
TR001	ACR-002	RAW	DE	220.50	ACRYLIC	SHEET	ACT	Planlama-05	PLASTIC	SHEET	SQM	SQM	Akrilik Levha 5mm Kalınlık - 1220x2440mm - Beyaz Opak	308.70	364.27	1.00	KDV20	20	WHOLESALE	DB-WHOLESALE	1.22	2.44	0.01	0.01	25.00	15.00	30.00	40.00	60.00	15.00	3.00	2024-02-12	7	1	ACR002_20240212_001	\N	\N
TR001	AP-002	RAW	TR	120.00	ALU-PROF	ALUMINUM	ACT	Planlama-01	ALUMINUM	EXTRUSION	R	METER	Alüminyum 40x40mm Kare Profil - 6 metre	169.00	199.42	1.00	KDV20	20	RETAIL	DB-RETAIL	0.04	0.04	6.00	0.01	4.80	15.00	35.00	30.00	70.00	40.00	8.00	2024-01-20	7	3	AP002_20240120_001	\N	\N
TR001	AP-003	RAW	DE	95.75	ALU-PROF	ALUMINUM	ACT	Planlama-02	ALUMINUM	EXTRUSION	METER	METER	Alüminyum 30x30mm Kare Profil - 6 metre	134.05	158.18	1.00	KDV20	20	RETAIL	DB-RETAIL	0.03	0.03	6.00	0.01	3.20	15.00	35.00	30.00	70.00	45.00	9.00	2024-02-10	10	2	AP003_20240210_001	\N	\N
TR001	ACR-003	RAW	TR	150.75	ACRYLIC	SHEET	ACT	Planlama-06	PLASTIC	SHEET	SQM	SQM	Akrilik Levha 2mm Kalınlık - 1220x2440mm - Kırmızı	211.05	249.04	1.00	KDV20	20	WHOLESALE	DB-WHOLESALE	1.22	2.44	0.00	0.01	10.00	15.00	30.00	40.00	60.00	25.00	6.00	2024-02-20	5	1	ACR003_20240220_001	\N	\N
TR001	VIN-001	RAW	TR	18.50	VINYL	FILM	ACT	Planlama-07	PLASTIC	FILM	ROLL	SQM	Cast Vinil Film - 1.27m x 50m - Beyaz	25.90	30.56	50.00	KDV20	20	WHOLESALE	DB-WHOLESALE	1.27	0.05	0.50	0.03	25.00	10.00	25.00	30.00	60.00	30.00	10.00	2024-01-18	3	1	VIN001_20240118_001	\N	\N
TR001	VIN-002	RAW	DE	32.75	VINYL	FILM	ACT	Planlama-07	PLASTIC	FILM	ROLL	SQM	Kalendir Vinil - 1.52m x 50m - Şeffaf	45.85	54.10	50.00	KDV20	20	WHOLESALE	DB-WHOLESALE	1.52	0.05	0.50	0.04	28.00	10.00	25.00	30.00	60.00	25.00	8.00	2024-02-08	5	1	VIN002_20240208_001	\N	\N
TR001	VIN-003	RAW	TR	22.90	VINYL	FILM	ACT	Planlama-08	PLASTIC	FILM	ROLL	SQM	Reklamcılık Vinili - 1.27m x 50m - Siyah	32.06	37.83	50.00	KDV20	20	WHOLESALE	DB-WHOLESALE	1.27	0.05	0.50	0.03	23.00	10.00	25.00	30.00	60.00	35.00	12.00	2024-02-22	4	1	VIN003_20240222_001	\N	\N
TR001	FAST-001	RAW	TR	8.75	FASTENER	HARDWARE	ACT	Planlama-09	STEEL	HARDWARE	UNIT	UNIT	Kendinden Contalı Vida 4x20mm - Paslanmaz - 100 adet	12.25	14.46	100.00	KDV20	20	RETAIL	DB-RETAIL	0.10	0.10	0.02	0.00	0.15	10.00	40.00	20.00	80.00	500.00	100.00	2024-01-22	2	1	FAST001_20240122_001	\N	\N
TR001	FAST-002	RAW	TR	15.20	FASTENER	HARDWARE	ACT	Planlama-09	STEEL	HARDWARE	UNIT	UNIT	Bağlantı Köşesi - Alüminyum - 90 derece - 25 adet	21.28	25.11	25.00	KDV20	20	RETAIL	DB-RETAIL	0.05	0.05	0.03	0.00	0.08	10.00	40.00	20.00	80.00	300.00	60.00	2024-02-14	3	1	FAST002_20240214_001	\N	\N
TR001	FAST-003	RAW	CN	6.90	FASTENER	HARDWARE	ACT	Planlama-10	STEEL	HARDWARE	UNIT	UNIT	Plastik Somun 4mm - Siyah - 500 adet	9.66	11.40	500.00	KDV20	20	RETAIL	DB-RETAIL	0.08	0.08	0.05	0.00	0.25	10.00	40.00	20.00	80.00	800.00	200.00	2024-02-25	20	1	FAST003_20240225_001	\N	\N
TR001	CAB-001	ELEC	TR	42.80	CABLE	ELECTRICAL	ACT	Planlama-11	COPPER	CABLE	METER	METER	2x1.5mm² Güç Kablosu - Siyah - 100 metre rulo	59.92	70.71	100.00	KDV20	20	WHOLESALE	DB-WHOLESALE	0.01	0.01	0.10	0.00	15.00	5.00	40.00	20.00	80.00	50.00	10.00	2024-01-28	4	1	CAB001_20240128_001	\N	\N
TR001	CAB-002	ELEC	TR	28.50	CABLE	ELECTRICAL	ACT	Planlama-11	COPPER	CABLE	METER	METER	4x0.75mm² Sinyal Kablosu - 100 metre rulo	39.90	47.08	100.00	KDV20	20	WHOLESALE	DB-WHOLESALE	0.01	0.01	0.10	0.00	8.00	5.00	40.00	20.00	80.00	60.00	12.00	2024-02-18	4	1	CAB002_20240218_001	\N	\N
TR001	PAINT-001	CHEM	TR	65.00	PAINT	COATING	ACT	Planlama-12	CHEMICAL	COATING	LITER	LITER	Akrilik Sprey Boya - Siyah Mat - 400ml	91.00	107.38	1.00	KDV20	20	RETAIL	DB-RETAIL	0.07	0.07	0.23	0.00	0.50	5.00	25.00	30.00	70.00	120.00	24.00	2024-02-03	3	1	PAINT001_20240203_001	\N	\N
TR001	PAINT-002	CHEM	DE	120.50	PAINT	COATING	ACT	Planlama-12	CHEMICAL	COATING	LITER	LITER	Metal Yüzey Astarı - Gri - 1 litre	168.70	199.07	1.00	KDV20	20	WHOLESALE	DB-WHOLESALE	0.08	0.08	0.15	0.00	1.20	5.00	25.00	30.00	70.00	80.00	16.00	2024-02-16	7	1	PAINT002_20240216_001	\N	\N
TR001	COMP-001	ELEC	CN	18.75	COMPONENT	ELECTRONICS	ACT	Planlama-13	ELECTRONICS	COMPONENT	UNIT	UNIT	IR Kumanda Alıcı Modülü - 38kHz	26.25	30.98	1.00	KDV20	20	RETAIL	DB-RETAIL	0.02	0.02	0.01	0.00	0.02	5.00	40.00	20.00	80.00	300.00	60.00	2024-02-07	25	1	COMP001_20240207_001	\N	\N
TR001	COMP-002	ELEC	CN	35.20	COMPONENT	ELECTRONICS	ACT	Planlama-13	ELECTRONICS	COMPONENT	UNIT	UNIT	Arduino Uno R3 Mikrodenetleyici Kartı	49.28	58.15	1.00	KDV20	20	RETAIL	DB-RETAIL	0.07	0.05	0.01	0.00	0.03	5.00	40.00	20.00	80.00	150.00	30.00	2024-02-21	30	1	COMP002_20240221_001	\N	\N
TR001	TOOL-001	TOOL	DE	450.00	TOOL	EQUIPMENT	ACT	Planlama-14	STEEL	TOOL	UNIT	UNIT	Isı Tabancası - 2000W - Profesyonel	630.00	743.40	1.00	KDV20	20	RETAIL	DB-RETAIL	0.25	0.15	0.30	0.01	1.80	10.00	40.00	20.00	70.00	20.00	5.00	2024-02-28	10	1	TOOL001_20240228_001	\N	\N
001	PART02124	\N	\N	\N	\N	\N	\N	\N	\N	\N	ADET	ADET	ssfa	1.00	1.00	1.00	KDV01	STANDARD	SATIS	SALE	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-31	\N	2	29d9c46d-952a-40ca-b5f8-a7c9a2adebad	M	P
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, module, page, action) FROM stdin;
\.


--
-- Data for Name: prod_structure_head_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prod_structure_head_tab (contract, part_no, eng_chg_level, bom_type_db, note_text, eff_phase_in_date, eff_phase_out_date, create_date, rowstate, created_by, rowversion, rowkey) FROM stdin;
01	AP-001	A	STANDARD	\N	2026-02-01	2026-02-07	2026-02-01	ACTIVE	System	1	8d2e17b1-c848-4681-8a79-193488d16daa
\.


--
-- Data for Name: prod_structure_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prod_structure_tab (contract, part_no, eng_chg_level, bom_type_db, alternative_no, line_item_no, line_sequence, operation_no, note_text, source, create_date, last_activity_date, component_part, rowstate, created_by, rowversion, rowkey) FROM stdin;
01	AP-001	A	STANDARD	000	1	10	10	\N	\N	2026-02-01	\N	LED-001	ACTIVE	System	1	9a3b54aa-094d-4ab7-803d-e9ae09e6743a
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, "Code", "Name", "Price", "StockQty", "CreatedAt") FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
1	1
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
\.


--
-- Data for Name: routing_head_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routing_head_tab (company, contract, part_no, routing_revision, bom_type, phase_in_date, phase_out_date, note_id, note_text, create_date, rowversion, rowkey) FROM stdin;
TST	01	AP-001	A	STANDARD	2026-02-01	2026-02-11	\N	d	2026-02-01	2026-02-01	c9843360-a5c0-47c5-acf5-daa085e54022
\.


--
-- Data for Name: routing_operation_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routing_operation_tab (company, contract, part_no, routing_revision, bom_type, operation_no, operation_description, work_center_no, mach_run_factor, mach_setup_time, labor_class_no, setup_labor_class_no, crew_size, setup_crew_size, run_time_code, note_text, rowversion, rowkey) FROM stdin;
TST	01	LED-002	A	STANDARD	10	DS	1	1	1	2	\N	\N	\N	HOUR	\N	2026-02-01	d82a66b8-97f5-472e-9da3-8b440f477c66
TST	01	LED-002	A	STANDARD	20	123	1	1	1	1	\N	\N	\N	HOUR	\N	2026-02-01	1c3d137f-a371-4c5e-9f60-cfbe0330689a
TST	01	AP-001	A	STANDARD	10	k	1	1	1	1	\N	\N	\N	HOUR	\N	2026-02-01	bf22b6a7-e187-4453-8170-b45ca1c89fe9
TST	01	AP-001	A	STANDARD	20	e	1	1	1	1	\N	\N	\N	HOUR	\N	2026-02-01	6ed10b26-f1b0-419a-84c5-1a5f6cad26be
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, role_id, status) FROM stdin;
1	admin	$2a$06$srF3e0A2XlstDHs1UV7fv.eLokrDackLXYWM2HDQ6Z4rgIhKIC05y	1	t
\.


--
-- Data for Name: work_center_tab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_center_tab (company, contract, work_center_no, description, work_center_code, production_line, department_no, note_text, create_date, rowversion, rowkey, rowstate) FROM stdin;
TST	01	CNC001	CNC Tezgahı 1	Üretim	Cnc1	Cnc1		2026-02-01	2026-02-01	e52c9a35-8e74-4fe7-bdad-bcfc79b04f91	Active
\.


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: company_tab PK_company_tab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_tab
    ADD CONSTRAINT "PK_company_tab" PRIMARY KEY (company);


--
-- Name: customer_info PK_customer_info; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_info
    ADD CONSTRAINT "PK_customer_info" PRIMARY KEY (customer_id);


--
-- Name: inventory_part PK_inventory_part; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_part
    ADD CONSTRAINT "PK_inventory_part" PRIMARY KEY (contract, part_no);


--
-- Name: permissions PK_permissions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "PK_permissions" PRIMARY KEY (id);


--
-- Name: products PK_products; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_products" PRIMARY KEY (id);


--
-- Name: role_permissions PK_role_permissions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "PK_role_permissions" PRIMARY KEY (role_id, permission_id);


--
-- Name: roles PK_roles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_roles" PRIMARY KEY (id);


--
-- Name: users PK_users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_users" PRIMARY KEY (id);


--
-- Name: company_site_tab company_contract_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_site_tab
    ADD CONSTRAINT company_contract_unique UNIQUE (company, contract);


--
-- Name: company_site_tab contract_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_site_tab
    ADD CONSTRAINT contract_unique UNIQUE (contract);


--
-- Name: customer_order_line_tab customer_order_line_tab_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order_line_tab
    ADD CONSTRAINT customer_order_line_tab_pkey PRIMARY KEY (company, order_no, contract, line_no, rel_no);


--
-- Name: customer_order_tab customer_order_tab_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order_tab
    ADD CONSTRAINT customer_order_tab_pkey PRIMARY KEY (company, order_no, contract);


--
-- Name: prod_structure_tab pk_prod_structure; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prod_structure_tab
    ADD CONSTRAINT pk_prod_structure PRIMARY KEY (contract, part_no, eng_chg_level, bom_type_db, alternative_no, line_item_no, line_sequence, operation_no);


--
-- Name: prod_structure_head_tab pk_prod_structure_head; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prod_structure_head_tab
    ADD CONSTRAINT pk_prod_structure_head PRIMARY KEY (contract, part_no, eng_chg_level, bom_type_db);


--
-- Name: routing_head_tab routing_head_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routing_head_tab
    ADD CONSTRAINT routing_head_unique UNIQUE (company, contract, part_no, routing_revision, bom_type);


--
-- Name: routing_operation_tab routing_operation_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routing_operation_tab
    ADD CONSTRAINT routing_operation_unique UNIQUE (company, contract, part_no, bom_type, routing_revision, operation_no);


--
-- Name: work_center_tab uq_work_center; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_center_tab
    ADD CONSTRAINT uq_work_center UNIQUE (company, contract, work_center_no);


--
-- Name: IX_products_Code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_products_Code" ON public.products USING btree ("Code");


--
-- Name: IX_users_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_users_role_id" ON public.users USING btree (role_id);


--
-- Name: IX_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_users_username" ON public.users USING btree (username);


--
-- Name: idx_customer_order_line_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_order_line_order ON public.customer_order_line_tab USING btree (company, order_no, contract);


--
-- Name: users FK_users_roles_role_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_users_roles_role_id" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: customer_order_line_tab customer_order_line_tab_company_order_no_contract_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order_line_tab
    ADD CONSTRAINT customer_order_line_tab_company_order_no_contract_fkey FOREIGN KEY (company, order_no, contract) REFERENCES public.customer_order_tab(company, order_no, contract) ON DELETE CASCADE;


--
-- Name: prod_structure_tab fk_prod_structure_head; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prod_structure_tab
    ADD CONSTRAINT fk_prod_structure_head FOREIGN KEY (contract, part_no, eng_chg_level, bom_type_db) REFERENCES public.prod_structure_head_tab(contract, part_no, eng_chg_level, bom_type_db) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict yiXceRwfI7NmoqO8Key4lXYHoFqizhHTpjSWBFg2Iv1fphC2bFY5eCU91S2yItf

