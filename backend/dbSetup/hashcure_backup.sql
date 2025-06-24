--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

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
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.appointment_status AS ENUM (
    'Scheduled',
    'Pending',
    'Cancelled',
    'Past'
);


ALTER TYPE public.appointment_status OWNER TO postgres;

--
-- Name: days; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.days AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);


ALTER TYPE public.days OWNER TO postgres;

--
-- Name: login_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.login_status AS ENUM (
    'Failed',
    'Success'
);


ALTER TYPE public.login_status OWNER TO postgres;

--
-- Name: ownerships; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.ownerships AS ENUM (
    'Government',
    'Private',
    'NGO/Trust',
    'Public-Private Partnership'
);


ALTER TYPE public.ownerships OWNER TO postgres;

--
-- Name: roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roles AS ENUM (
    'patient',
    'doctor',
    'hospital-admin',
    'admin'
);


ALTER TYPE public.roles OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id integer NOT NULL,
    patient_id integer,
    hospital_id integer,
    doctor_id integer,
    "time" timestamp without time zone DEFAULT now(),
    purpose text NOT NULL,
    chief_complaint text,
    diagnosis text,
    treatment_plan text,
    status public.appointment_status NOT NULL
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: disease_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disease_records (
    user_id integer NOT NULL,
    disease_id integer NOT NULL,
    record_date date DEFAULT now() NOT NULL,
    value double precision NOT NULL
);


ALTER TABLE public.disease_records OWNER TO postgres;

--
-- Name: diseases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diseases (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.diseases OWNER TO postgres;

--
-- Name: diseases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diseases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.diseases_id_seq OWNER TO postgres;

--
-- Name: diseases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diseases_id_seq OWNED BY public.diseases.id;


--
-- Name: doctor_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_comments (
    doctor_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text,
    "time" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.doctor_comments OWNER TO postgres;

--
-- Name: doctor_experience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_experience (
    doctor_id integer NOT NULL,
    hospital_id integer NOT NULL,
    years integer NOT NULL
);


ALTER TABLE public.doctor_experience OWNER TO postgres;

--
-- Name: doctor_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_ratings (
    doctor_id integer,
    user_id integer,
    rating integer DEFAULT 0,
    CONSTRAINT doctor_ratings_rating_check CHECK (((rating >= 0) AND (rating <= 5)))
);


ALTER TABLE public.doctor_ratings OWNER TO postgres;

--
-- Name: doctor_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_schedule (
    doctor_id integer NOT NULL,
    day public.days NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    CONSTRAINT doctor_schedule_check CHECK ((start_time < end_time))
);


ALTER TABLE public.doctor_schedule OWNER TO postgres;

--
-- Name: doctor_specializations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_specializations (
    doctor_id integer NOT NULL,
    specialization_id integer NOT NULL
);


ALTER TABLE public.doctor_specializations OWNER TO postgres;

--
-- Name: doctor_videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_videos (
    doctor_id integer NOT NULL,
    video_url text NOT NULL,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.doctor_videos OWNER TO postgres;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    description text,
    fees integer,
    experience integer,
    qualifications text,
    allow_direct_booking boolean DEFAULT true
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: hospital_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital_comments (
    hospital_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text,
    "time" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.hospital_comments OWNER TO postgres;

--
-- Name: hospital_doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital_doctors (
    hospital_id integer NOT NULL,
    doctor_id integer NOT NULL
);


ALTER TABLE public.hospital_doctors OWNER TO postgres;

--
-- Name: hospital_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital_ratings (
    hospital_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer DEFAULT 0,
    CONSTRAINT hospital_ratings_rating_check CHECK (((rating >= 0) AND (rating <= 5)))
);


ALTER TABLE public.hospital_ratings OWNER TO postgres;

--
-- Name: hospital_speciality; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital_speciality (
    hospital_id integer NOT NULL,
    speciality_id integer NOT NULL
);


ALTER TABLE public.hospital_speciality OWNER TO postgres;

--
-- Name: hospital_timings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital_timings (
    hospital_id integer NOT NULL,
    day public.days NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    CONSTRAINT hospital_timings_check CHECK ((start_time < end_time))
);


ALTER TABLE public.hospital_timings OWNER TO postgres;

--
-- Name: hospitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitals (
    id integer NOT NULL,
    name character varying(100),
    admin_id integer,
    started_at date,
    image text,
    district character varying(100),
    address text,
    ownership public.ownerships NOT NULL,
    description text,
    phone character varying(20)
);


ALTER TABLE public.hospitals OWNER TO postgres;

--
-- Name: hospitals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospitals_id_seq OWNER TO postgres;

--
-- Name: hospitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospitals_id_seq OWNED BY public.hospitals.id;


--
-- Name: login_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_logs (
    id integer NOT NULL,
    user_id integer,
    ip_address text,
    "time" timestamp without time zone DEFAULT now(),
    status public.login_status NOT NULL
);


ALTER TABLE public.login_logs OWNER TO postgres;

--
-- Name: login_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_logs_id_seq OWNER TO postgres;

--
-- Name: login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_logs_id_seq OWNED BY public.login_logs.id;


--
-- Name: medicines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicines (
    id integer NOT NULL,
    name character varying(200)
);


ALTER TABLE public.medicines OWNER TO postgres;

--
-- Name: medicines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medicines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicines_id_seq OWNER TO postgres;

--
-- Name: medicines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medicines_id_seq OWNED BY public.medicines.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    user_id integer NOT NULL,
    content text,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: patient_diseases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_diseases (
    user_id integer NOT NULL,
    disease_id integer NOT NULL,
    min_value integer DEFAULT 0,
    max_value integer DEFAULT 0
);


ALTER TABLE public.patient_diseases OWNER TO postgres;

--
-- Name: specialities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specialities (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.specialities OWNER TO postgres;

--
-- Name: specialities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.specialities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.specialities_id_seq OWNER TO postgres;

--
-- Name: specialities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.specialities_id_seq OWNED BY public.specialities.id;


--
-- Name: specializations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specializations (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.specializations OWNER TO postgres;

--
-- Name: specializations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.specializations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.specializations_id_seq OWNER TO postgres;

--
-- Name: specializations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.specializations_id_seq OWNED BY public.specializations.id;


--
-- Name: user_allergies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_allergies (
    user_id integer NOT NULL,
    medicine_id integer NOT NULL
);


ALTER TABLE public.user_allergies OWNER TO postgres;

--
-- Name: user_disease_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_disease_files (
    id integer NOT NULL,
    user_id integer NOT NULL,
    disease_id integer NOT NULL,
    file_url text NOT NULL,
    public_id text NOT NULL,
    name character varying(120)
);


ALTER TABLE public.user_disease_files OWNER TO postgres;

--
-- Name: user_disease_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_disease_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_disease_files_id_seq OWNER TO postgres;

--
-- Name: user_disease_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_disease_files_id_seq OWNED BY public.user_disease_files.id;


--
-- Name: user_disease_medicines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_disease_medicines (
    user_id integer NOT NULL,
    disease_id integer NOT NULL,
    started_at date NOT NULL,
    medicine_id integer NOT NULL
);


ALTER TABLE public.user_disease_medicines OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(100) NOT NULL,
    lastname character varying(100),
    email character varying(100) NOT NULL,
    password_hash character varying(100) NOT NULL,
    gender character(1),
    address text,
    phone character varying(20),
    dob date,
    image text,
    height integer,
    weight integer,
    blood_group character(4),
    role public.roles DEFAULT 'patient'::public.roles NOT NULL,
    is_willing_to_donate_blood boolean DEFAULT true,
    frequency_of_blood_donation integer DEFAULT 4,
    last_blood_donation_date date,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: diseases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseases ALTER COLUMN id SET DEFAULT nextval('public.diseases_id_seq'::regclass);


--
-- Name: hospitals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals ALTER COLUMN id SET DEFAULT nextval('public.hospitals_id_seq'::regclass);


--
-- Name: login_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs ALTER COLUMN id SET DEFAULT nextval('public.login_logs_id_seq'::regclass);


--
-- Name: medicines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines ALTER COLUMN id SET DEFAULT nextval('public.medicines_id_seq'::regclass);


--
-- Name: specialities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialities ALTER COLUMN id SET DEFAULT nextval('public.specialities_id_seq'::regclass);


--
-- Name: specializations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specializations ALTER COLUMN id SET DEFAULT nextval('public.specializations_id_seq'::regclass);


--
-- Name: user_disease_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_files ALTER COLUMN id SET DEFAULT nextval('public.user_disease_files_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, patient_id, hospital_id, doctor_id, "time", purpose, chief_complaint, diagnosis, treatment_plan, status) FROM stdin;
7	1	1	5	2025-06-19 04:30:00	Cough and Fever	chief complaint	diagnosis	treatment plan	Past
13	1	1	5	2025-06-18 04:30:00	abcd	Chief Complaint\n	Diagnosis	Treatment Plan\nTreatment Plan\n	Past
17	1	1	5	2025-06-29 11:00:00	cough and fever	You're looping over specializations, and for each one, you're checking if its name exists in specializations  You're looping over specializations, and for each one, you're checking if its name exists in specializations 	You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations 	You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations You're looping over specializations, and for each one, you're checking if its name exists in specializations 	Past
11	1	1	5	2025-06-19 15:00:00	sdfsdf	const isPhone = window.innerWidth < 728;\n  let style = { zIndex: 9999 };\n  if (!isPhone) {\n    style["display"] = "none";\n  }	const isPhone = window.innerWidth < 728;\n  let style = { zIndex: 9999 };\n  if (!isPhone) {\n    style["display"] = "none";\n  }const isPhone = window.innerWidth < 728;\n  let style = { zIndex: 9999 };\n  if (!isPhone) {\n    style["display"] = "none";\n  }	const isPhone = window.innerWidth < 728;\n  let style = { zIndex: 9999 };\n  if (!isPhone) {\n    style["display"] = "none";\n  }const isPhone = window.innerWidth < 728;\n  let style = { zIndex: 9999 };\n  if (!isPhone) {\n    style["display"] = "none";\n  }const isPhone = window.innerWidth < 728;\n  let style = { zIndex: 9999 };\n  if (!isPhone) {\n    style["display"] = "none";const isPhone = window.innerWidth < 728;\n  let style = { zIndex: 9999 };\n  if (!isPhone) {\n    style["display"] = "none";\n  }\n  }	Past
21	2	1	6	2025-06-22 16:09:22.784921	Fever	\N	\N	\N	Pending
22	1	1	6	2025-06-22 16:10:24.253585	Fever	\N	\N	\N	Pending
18	1	1	6	2025-06-19 11:20:00	assdvdf	\N	\N	\N	Pending
14	1	1	5	2025-06-18 10:00:00	avdc	\N	\N	\N	Pending
20	2	1	5	2025-06-22 15:12:37.55362	Fever	\N	\N	\N	Pending
9	1	1	5	2025-06-18 10:30:00	dvsdv	\N	\N	\N	Scheduled
15	1	1	5	2025-06-18 10:20:00	advsd	\N	\N	\N	Scheduled
10	1	1	5	2025-06-18 11:10:00	sdfsdf	\N	\N	\N	Scheduled
16	1	1	5	2025-06-19 10:20:00	cough	\N	\N	\N	Scheduled
\.


--
-- Data for Name: disease_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disease_records (user_id, disease_id, record_date, value) FROM stdin;
1	1	2025-06-30	24
1	1	2025-06-20	14
1	1	2025-06-26	20
1	1	2025-06-19	21
1	1	2025-06-21	24
1	1	2025-06-27	17
1	1	2025-06-11	12
1	2	2025-06-10	12
1	2	2025-06-25	14
1	2	2025-06-27	19
1	2	2025-06-08	20
1	2	2025-07-04	24
\.


--
-- Data for Name: diseases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diseases (id, name) FROM stdin;
1	Thyroid
2	abcd
3	asdf
4	sdsdvsdvsdv
5	fe
6	abcdef
7	abcdefabcd
8	new
9	afg
10	abd
11	thyroid
\.


--
-- Data for Name: doctor_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_comments (doctor_id, user_id, comment, "time") FROM stdin;
5	1	good doctor	2025-06-17 15:47:44.608446
\.


--
-- Data for Name: doctor_experience; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_experience (doctor_id, hospital_id, years) FROM stdin;
\.


--
-- Data for Name: doctor_ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_ratings (doctor_id, user_id, rating) FROM stdin;
5	1	3
\.


--
-- Data for Name: doctor_schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_schedule (doctor_id, day, start_time, end_time) FROM stdin;
5	Thursday	10:00:00	12:00:00
5	Saturday	10:00:00	12:00:00
5	Monday	14:00:00	17:00:00
5	Tuesday	14:00:00	17:00:00
5	Wednesday	14:00:00	17:00:00
5	Friday	14:00:00	17:00:00
5	Saturday	14:00:00	17:00:00
5	Sunday	14:00:00	19:00:00
\.


--
-- Data for Name: doctor_specializations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_specializations (doctor_id, specialization_id) FROM stdin;
6	2
7	3
8	4
9	1
10	2
11	3
12	4
13	1
\.


--
-- Data for Name: doctor_videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_videos (doctor_id, video_url, uploaded_at) FROM stdin;
5	https://youtu.be/kdgq-OwsOs8?si=lVr9G9WLnRZIM7rr	2025-06-21 19:18:31.988638
6	https://youtu.be/kdgq-OwsOs8?si=lVr9G9WLnRZIM7rr	2025-06-21 19:24:48.500891
7	https://youtu.be/kdgq-OwsOs8?si=lVr9G9WLnRZIM7rr	2025-06-21 19:24:52.214972
8	https://youtu.be/kdgq-OwsOs8?si=lVr9G9WLnRZIM7rr	2025-06-21 19:24:55.383105
9	https://youtu.be/kdgq-OwsOs8?si=lVr9G9WLnRZIM7rr	2025-06-21 19:24:58.932284
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, description, fees, experience, qualifications, allow_direct_booking) FROM stdin;
6	\N	400	\N	\N	t
7	\N	400	\N	\N	t
8	\N	400	\N	\N	t
9	\N	400	\N	\N	t
10	\N	400	\N	\N	t
11	\N	400	\N	\N	t
12	\N	400	\N	\N	t
13	\N	400	\N	\N	t
5	I am a doctor	400	6	MBBS MD	t
16	\N	400	\N	\N	t
17	\N	400	\N	\N	t
18	\N	400	\N	\N	t
19	\N	400	\N	\N	t
20	\N	400	\N	\N	t
21	\N	\N	\N	\N	t
\.


--
-- Data for Name: hospital_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital_comments (hospital_id, user_id, comment, "time") FROM stdin;
1	4	good hospital	2025-06-17 15:30:48.665204
2	4	very good hospital	2025-06-17 15:31:42.048378
\.


--
-- Data for Name: hospital_doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital_doctors (hospital_id, doctor_id) FROM stdin;
1	5
1	6
1	9
2	10
2	11
2	12
2	13
1	16
1	17
1	18
1	19
1	20
1	21
\.


--
-- Data for Name: hospital_ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital_ratings (hospital_id, user_id, rating) FROM stdin;
1	4	4
2	4	5
1	1	4
\.


--
-- Data for Name: hospital_speciality; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital_speciality (hospital_id, speciality_id) FROM stdin;
2	4
2	2
2	3
1	2
\.


--
-- Data for Name: hospital_timings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital_timings (hospital_id, day, start_time, end_time) FROM stdin;
\.


--
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospitals (id, name, admin_id, started_at, image, district, address, ownership, description, phone) FROM stdin;
2	Town Health Hospital	4	2005-05-01	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgyGO9GQ6eqpLvklCY3d51K1HhBxRAbL1Vag&s	Thiruvananthapuram	321 Main Street	Government	Multi-specialty hospital with modern facilities.	0484-7654321
1	City Health Hospital	3	2010-10-26	https://res.cloudinary.com/duki8udfb/image/upload/v1750670774/hashcure/hospitals/mz8wfwyyjrwx7y8uwqpd.png	Thiruvananthapuram	123 Main Street	NGO/Trust	Multi-specialty hospital with modern facilities.12	0484-12345679
3	NewHospital	25	\N	\N	\N	\N	Government	\N	\N
4	NewHospital2	26	\N	\N	\N	\N	Government	\N	\N
\.


--
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_logs (id, user_id, ip_address, "time", status) FROM stdin;
1	1	\N	2025-06-13 18:53:00.733731	Success
2	1	\N	2025-06-17 15:08:33.333212	Success
3	2	\N	2025-06-17 15:14:19.191115	Success
4	3	\N	2025-06-17 15:14:34.083291	Success
5	4	\N	2025-06-17 15:14:45.085635	Success
6	1	\N	2025-06-17 15:31:55.278868	Success
7	1	\N	2025-06-17 15:40:47.144335	Success
8	1	\N	2025-06-17 15:53:35.292965	Success
9	1	\N	2025-06-17 19:03:56.854234	Success
10	1	\N	2025-06-17 19:21:29.197016	Success
11	1	\N	2025-06-18 11:00:31.352898	Success
12	1	\N	2025-06-21 12:19:26.332079	Success
13	1	\N	2025-06-21 19:03:39.906623	Success
14	1	\N	2025-06-21 19:33:40.061208	Success
15	1	\N	2025-06-21 20:02:32.934414	Success
16	1	\N	2025-06-21 20:18:41.361914	Success
17	1	\N	2025-06-22 09:53:51.832258	Success
18	1	\N	2025-06-22 13:06:21.658865	Success
19	5	\N	2025-06-22 13:19:07.378658	Success
20	1	\N	2025-06-22 13:32:17.267394	Success
21	5	\N	2025-06-22 13:47:42.579999	Success
22	5	\N	2025-06-22 15:39:54.133038	Success
23	1	\N	2025-06-22 15:40:25.839151	Success
24	1	\N	2025-06-22 15:53:16.974636	Success
25	7	\N	2025-06-22 18:22:38.773235	Success
26	7	\N	2025-06-22 21:04:28.398055	Success
27	3	\N	2025-06-22 21:04:46.197283	Success
28	5	\N	2025-06-22 21:37:50.170502	Success
29	5	\N	2025-06-23 11:18:10.57121	Success
30	3	\N	2025-06-23 11:18:25.579529	Success
31	1	\N	2025-06-23 11:18:54.481482	Success
32	1	\N	2025-06-23 11:19:21.914311	Success
33	3	\N	2025-06-23 11:19:41.276193	Success
34	1	\N	2025-06-24 09:46:30.488242	Success
35	1	\N	2025-06-24 09:47:05.362365	Success
36	5	\N	2025-06-24 13:16:09.916134	Success
37	3	\N	2025-06-24 13:19:22.751722	Success
38	22	\N	2025-06-24 14:20:00.186753	Success
39	23	\N	2025-06-24 14:22:52.89837	Success
40	22	\N	2025-06-24 14:25:28.183533	Success
41	25	\N	2025-06-24 15:18:08.591818	Failed
42	25	\N	2025-06-24 15:18:13.74493	Failed
43	26	\N	2025-06-24 15:21:36.32453	Success
44	22	\N	2025-06-24 15:29:10.111591	Success
45	3	\N	2025-06-24 18:19:07.303829	Success
46	22	\N	2025-06-24 19:03:16.948844	Success
\.


--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicines (id, name) FROM stdin;
1	thyronorm
2	abcd
3	pqrs
4	lmno
5	hello
6	ge
7	new med
8	med
9	new medicine
10	cetrisine
11	medicine
12	ABCD
13	12
14	Thyronorm
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (user_id, content, "time") FROM stdin;
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 10:00 AM is cancelled. Thanks for using the application.	2025-06-21 20:17:26.345473
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 10:00 AM is cancelled. Thanks for using the application.	2025-06-21 20:17:26.345473
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 10:20 AM is cancelled. Thanks for using the application.	2025-06-21 20:20:39.430907
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 10:20 AM is cancelled. Thanks for using the application.	2025-06-21 20:20:39.430907
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 10:30 AM is cancelled. Thanks for using the application.	2025-06-21 20:48:04.438118
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 10:30 AM is cancelled. Thanks for using the application.	2025-06-21 20:48:04.438118
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 11:00 AM is cancelled. Thanks for using the application.	2025-06-22 12:17:06.054527
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 11:00 AM is cancelled. Thanks for using the application.	2025-06-22 12:17:06.054527
1	Your appointment with Dr. Doctor in City Health Hospital, on Thu Jun 19 2025 at 03:00 PM is cancelled. Thanks for using the application.	2025-06-22 15:29:43.390589
5	Your appointment with Alvin A S in City Health Hospital, on Thu Jun 19 2025 at 03:00 PM is cancelled. Thanks for using the application.	2025-06-22 15:29:43.390589
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 04:30 AM is cancelled. Thanks for using the application.	2025-06-22 15:34:41.461466
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 04:30 AM is cancelled. Thanks for using the application.	2025-06-22 15:34:41.461466
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 04:30 AM is cancelled. Thanks for using the application.	2025-06-22 15:55:26.882182
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 04:30 AM is cancelled. Thanks for using the application.	2025-06-22 15:55:26.882182
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 05:30 AM is cancelled. Thanks for using the application.	2025-06-22 15:55:30.539897
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 05:30 AM is cancelled. Thanks for using the application.	2025-06-22 15:55:30.539897
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 10:30 AM is cancelled. Thanks for using the application.	2025-06-22 16:41:49.908548
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 10:30 AM is cancelled. Thanks for using the application.	2025-06-22 16:41:49.908548
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 10:20 AM is cancelled. Thanks for using the application.	2025-06-22 16:42:00.863693
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 10:20 AM is cancelled. Thanks for using the application.	2025-06-22 16:42:00.863693
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 11:10 AM is cancelled. Thanks for using the application.	2025-06-22 16:42:18.372347
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 11:10 AM is cancelled. Thanks for using the application.	2025-06-22 16:42:18.372347
1	Your appointment with Dr. Doctor in City Health Hospital, on Thu Jun 19 2025 at 10:20 AM has been confirmed. Thanks for using the application.	2025-06-22 16:49:38.251104
5	Your have an appointment with Alvin A S in City Health Hospital, on Thu Jun 19 2025 at 10:20 AM. Thanks for using the application.	2025-06-22 16:49:38.251104
2	Your appointment with Dr. Doctor in City Health Hospital, on Sun Jun 22 2025 at 03:12 PM has been confirmed. Thanks for using the application.	2025-06-22 16:50:59.952848
5	Your have an appointment with Kiran Nambiar in City Health Hospital, on Sun Jun 22 2025 at 03:12 PM. Thanks for using the application.	2025-06-22 16:50:59.952848
1	Your appointment with Dr. Doctor in City Health Hospital, on Thu Jun 19 2025 at 03:00 PM has been confirmed. Thanks for using the application.	2025-06-22 16:51:13.7153
5	Your have an appointment with Alvin A S in City Health Hospital, on Thu Jun 19 2025 at 03:00 PM. Thanks for using the application.	2025-06-22 16:51:13.7153
1	Your appointment with Dr. Doctor in City Health Hospital, on Thu Jun 19 2025 at 03:00 PM has been confirmed. Thanks for using the application.	2025-06-22 16:51:42.396342
5	Your have an appointment with Alvin A S in City Health Hospital, on Thu Jun 19 2025 at 03:00 PM. Thanks for using the application.	2025-06-22 16:51:42.396342
1	Your appointment with Dr. Doctor in City Health Hospital, on Thu Jun 19 2025 at 10:20 AM has been confirmed. Thanks for using the application.	2025-06-22 16:52:36.624698
5	Your have an appointment with Alvin A S in City Health Hospital, on Thu Jun 19 2025 at 10:20 AM. Thanks for using the application.	2025-06-22 16:52:36.624698
1	Your appointment with Dr. Doctor in City Health Hospital, on Thu Jun 19 2025 at 10:20 AM is cancelled. Thanks for using the application.	2025-06-22 16:52:51.468305
5	Your appointment with Alvin A S in City Health Hospital, on Thu Jun 19 2025 at 10:20 AM is cancelled. Thanks for using the application.	2025-06-22 16:52:51.468305
1	Your appointment with Dr. Doctor in City Health Hospital, on Wed Jun 18 2025 at 11:00 AM is cancelled. Thanks for using the application.	2025-06-22 16:53:07.095135
5	Your appointment with Alvin A S in City Health Hospital, on Wed Jun 18 2025 at 11:00 AM is cancelled. Thanks for using the application.	2025-06-22 16:53:07.095135
\.


--
-- Data for Name: patient_diseases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_diseases (user_id, disease_id, min_value, max_value) FROM stdin;
1	9	0	0
1	2	10	12
1	10	0	0
1	11	0	0
\.


--
-- Data for Name: specialities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specialities (id, name) FROM stdin;
1	Emergency
2	Surgery
3	Outpatient
4	Radiology
\.


--
-- Data for Name: specializations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specializations (id, name) FROM stdin;
1	Cardiology
2	Neurology
3	Orthopedics
4	Pediatrics
\.


--
-- Data for Name: user_allergies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_allergies (user_id, medicine_id) FROM stdin;
1	8
1	9
1	10
\.


--
-- Data for Name: user_disease_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_disease_files (id, user_id, disease_id, file_url, public_id, name) FROM stdin;
6	1	1	https://res.cloudinary.com/duki8udfb/image/upload/v1750746214/hashcure/patients/reports/u9jhbhvnuwoz2orhmfho.pdf	hashcure/patients/reports/u9jhbhvnuwoz2orhmfho	Thyroid-Tue Jun 24 2025-11:53:35
4	1	1	https://res.cloudinary.com/duki8udfb/image/upload/v1750231589/hashcure/patients/reports/lafkwtmtllkei0m97ib8.pdf	hashcure/patients/reports/lafkwtmtllkei0m97ib8	File1
5	1	1	https://res.cloudinary.com/duki8udfb/image/upload/v1750746158/hashcure/patients/reports/jwa7vcf7ytc6kvuhbotp.pdf	hashcure/patients/reports/jwa7vcf7ytc6kvuhbotp	File2
7	1	2	https://res.cloudinary.com/duki8udfb/image/upload/v1750750684/hashcure/patients/reports/k8xnn0eidyk7yvpkgevh.pdf	hashcure/patients/reports/k8xnn0eidyk7yvpkgevh	abcd-Tue Jun 24 2025-13:08:06
8	1	2	https://res.cloudinary.com/duki8udfb/image/upload/v1750750898/hashcure/patients/reports/fyu2npmavkwiooex2ubi.png	hashcure/patients/reports/fyu2npmavkwiooex2ubi	abcd-Tue Jun 24 2025-13:11:39
\.


--
-- Data for Name: user_disease_medicines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_disease_medicines (user_id, disease_id, started_at, medicine_id) FROM stdin;
1	1	2025-06-24	1
1	2	2025-06-26	14
1	2	2025-06-28	11
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, lastname, email, password_hash, gender, address, phone, dob, image, height, weight, blood_group, role, is_willing_to_donate_blood, frequency_of_blood_donation, last_blood_donation_date, created_at, updated_at) FROM stdin;
21	abcd	doctor	abcd@gmail.com	$2b$10$htfD0DAicT1kw0aOs7zMB.J5v9E72vOXa/7sn4Ww919yJJg37HlSC	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:49:26.535138	2025-06-23 13:49:26.535138
2	Kiran	Nambiar	kiran@gmail.com	$2b$10$uDjjieDn8QF6qwWtHXRHpeIGotb7M2FhX0V0P60n5U.MmiRjgFDZ.	M	\N	\N	2005-03-28	/boy.png	180	52	A+  	patient	t	4	\N	2025-06-17 15:14:19.185343	2025-06-17 15:14:19.185343
3	Admin	1	admin1@gmail.com	$2b$10$lo/z68YmWmctupzVlih0G.aGLS.Pj45T4ZIhrCSL3Z7ItNrKMwFRu	M	\N	\N	2005-03-28	/boy.png	180	52	A+  	hospital-admin	t	4	\N	2025-06-17 15:14:34.079951	2025-06-17 15:14:34.079951
4	Admin	2	admin2@gmail.com	$2b$10$RHRdDEbOipPeM.ii2OYu1OMR9DhRRUIWRSY8f2koNyqKCIj6sflR6	M	\N	\N	2005-03-28	/boy.png	180	52	A+  	hospital-admin	t	4	\N	2025-06-17 15:14:45.080661	2025-06-17 15:14:45.080661
6	Doctor	2	doctor2@gmail.com	$2b$10$jtbLld2Bd0aPXpL1t5/IJeoRTBfk2TrTkmmX858b553YXjKTYlATq	M	\N	\N	2005-03-28	/boy.png	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:10.46031	2025-06-17 15:27:10.46031
23	patient		patient@gmail.com	$2b$10$ZFS2LDUoUQpm8FztO02s2Oii6Q57tLoBR.EUrrb4RJOIAz/9yT4P2	\N	\N	\N	\N	\N	\N	\N	\N	patient	t	4	\N	2025-06-24 14:22:52.846883	2025-06-24 14:22:52.846883
8	Doctor	4	doctor4@gmail.com	$2b$10$0grGKwV6G611wgoCysy69u88XxrOxWeLwuAkZ3Oa03YTNU5PIiSFC	M	\N	\N	2005-03-28	/boy.png	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:20.254248	2025-06-17 15:27:20.254248
9	Doctor	5	doctor5@gmail.com	$2b$10$SWvRE/R.WtNXlSOFNkLF8ejFwJoMEKs3fbTGQ.zqw4oygBNdLJQwu	M	\N	\N	2005-03-28	/boy.png	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:26.150244	2025-06-17 15:27:26.150244
10	Doctor	6	doctor6@gmail.com	$2b$10$QaQBKMPAFL2HEmF2y9EPEOjHirjF3aYc8IiaLFFHRGB59IF9T2jIG	F	\N	\N	2005-03-28	/girl.png	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:32.589397	2025-06-17 15:27:32.589397
11	Doctor	7	doctor7@gmail.com	$2b$10$Mv4NywQ4t8RQVgIX1uGJCegWp3JvQo8dNVpsGJpCQOJbRhXNTOV5m	F	\N	\N	2005-03-28	/girl.png	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:38.00398	2025-06-17 15:27:38.00398
12	Doctor	8	doctor8@gmail.com	$2b$10$PcqZEQEI3uX.Iy87rWtpiecEQsiuiCXr5zSVKNBIyEwHz949zwjrm	F	\N	\N	2005-03-28	/girl.png	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:42.797376	2025-06-17 15:27:42.797376
13	Doctor	9	doctor9@gmail.com	$2b$10$m29vlBWH6iNSC8cOecd44eC/8RQW1WWGwWSlgg4blaIVKMBEYwCKO	F	\N	\N	2005-03-28	/girl.png	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:46.932929	2025-06-17 15:27:46.932929
1	Alvin	A S	alvinanildas@gmail.com	$2b$10$.8FIBgLL7Tb/bIFb08khmus6fbjK6rfoDuJorWcV6YvbRUuf.a4YW	M	Das Bhavan Elavattom Elavattom PO	8086290149	2005-03-28	https://res.cloudinary.com/duki8udfb/image/upload/v1750578435/hashcure/patients/images/cs8sbbnk8zrnkuolxubn.png	169	53	A+  	patient	f	5	2025-06-10	2025-06-13 18:53:00.692921	2025-06-13 18:53:00.692921
22	admin		admin@example.com	$2b$10$ItbkSVJyc3Sn4VTZMM9F4eb3TPaZmQkXVHygPJ./flmwVJCDDYsT.	\N	\N	\N	\N	\N	\N	\N	\N	admin	t	4	\N	2025-06-24 14:20:00.181425	2025-06-24 14:20:00.181425
25	abcd		abcd1@gmail.com	abcd	\N	\N	\N	\N	\N	\N	\N	\N	hospital-admin	t	4	\N	2025-06-24 15:17:41.533501	2025-06-24 15:17:41.533501
26	abcd		abcd2@gmail.com	$2b$10$06RrDEtKscnHA1s4I7K4zeiYcmDIVAqllJ9KZxdquUW0EegGlw18G	\N	\N	\N	\N	\N	\N	\N	\N	hospital-admin	t	4	\N	2025-06-24 15:21:28.217857	2025-06-24 15:21:28.217857
5	Doctor	1	doctor1@gmail.com	$2b$10$LCoLUC.IuV1yDW/FnTtwKuIIMZd4FaHqXLv7xCyXxNx/pbJfczHQu	F	Elavattom	8086290149	2005-03-23	https://res.cloudinary.com/duki8udfb/image/upload/v1750596037/hashcure/patients/images/ey4y39tkbpcbjnnhyeyw.png	169	53	B+  	doctor	t	5	2024-12-30	2025-06-17 15:27:04.407176	2025-06-17 15:27:04.407176
7	Doctor	3	doctor3@gmail.com	$2b$10$DnjL1T.n34j/5CNespuNvu.fwHGof4pmRYrO30NXVaO3bV9ViJs.2	M	\N	\N	2005-03-28	\N	180	52	A+  	doctor	t	4	\N	2025-06-17 15:27:14.903495	2025-06-17 15:27:14.903495
14	Doctor 6		newdoctor6@gmail.com	$2b$10$68./kQUBsnT35yyI2G9QduuSA2ZUkrEwu0faZaJy/7uM6B2NfPrci	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:33:34.72139	2025-06-23 13:33:34.72139
15	doctor15		doctor15@gmail.com	$2b$10$yBKHSUyW5I9KznLXB85xnudNVTPlw286v3mzymvrKztmats/9hdMS	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:37:19.164342	2025-06-23 13:37:19.164342
16	doctor16		doctor16@gmail.com	$2b$10$4dFlMwgsBH1eInkmEqtftuE3SB9tVCTsV19jraNZdMbWSknWXcpNW	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:38:12.2779	2025-06-23 13:38:12.2779
17	doctor20		doctor20@gmail.com	$2b$10$rCPkrDEM69.G48jiBbjMkOvkp0./c/tAdFC7rGI/lPikPkts4jXoa	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:40:00.018585	2025-06-23 13:40:00.018585
18	1	doctor21		doctor21@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:42:15.781442	2025-06-23 13:42:15.781442
19	doctor22		d22@gmail.com	$2b$10$VzcMpdXT4tP246Dc0mnAluzx95JO3.lyyxmX3CD/nQ9pkJAAs.lce	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:43:54.981132	2025-06-23 13:43:54.981132
20	d23		d23@gmail.com	$2b$10$t0.uiFenIoVpSszHgFmKeuAzRhdicvzSsU24aUgxLNKHuvhpAIq5W	\N	\N	\N	\N	\N	\N	\N	\N	doctor	t	4	\N	2025-06-23 13:45:14.846551	2025-06-23 13:45:14.846551
\.


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 22, true);


--
-- Name: diseases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diseases_id_seq', 11, true);


--
-- Name: hospitals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospitals_id_seq', 4, true);


--
-- Name: login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_logs_id_seq', 46, true);


--
-- Name: medicines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicines_id_seq', 14, true);


--
-- Name: specialities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.specialities_id_seq', 1, false);


--
-- Name: specializations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.specializations_id_seq', 1, false);


--
-- Name: user_disease_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_disease_files_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 26, true);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: disease_records disease_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disease_records
    ADD CONSTRAINT disease_records_pkey PRIMARY KEY (user_id, disease_id, record_date);


--
-- Name: diseases diseases_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT diseases_name_key UNIQUE (name);


--
-- Name: diseases diseases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT diseases_pkey PRIMARY KEY (id);


--
-- Name: doctor_comments doctor_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_comments
    ADD CONSTRAINT doctor_comments_pkey PRIMARY KEY (doctor_id, user_id);


--
-- Name: doctor_experience doctor_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_experience
    ADD CONSTRAINT doctor_experience_pkey PRIMARY KEY (doctor_id, hospital_id);


--
-- Name: doctor_schedule doctor_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_schedule
    ADD CONSTRAINT doctor_schedule_pkey PRIMARY KEY (doctor_id, day, start_time, end_time);


--
-- Name: doctor_specializations doctor_specializations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_specializations
    ADD CONSTRAINT doctor_specializations_pkey PRIMARY KEY (doctor_id, specialization_id);


--
-- Name: doctor_videos doctor_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_videos
    ADD CONSTRAINT doctor_videos_pkey PRIMARY KEY (doctor_id, video_url);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: hospital_comments hospital_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_comments
    ADD CONSTRAINT hospital_comments_pkey PRIMARY KEY (hospital_id, user_id);


--
-- Name: hospital_doctors hospital_doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_doctors
    ADD CONSTRAINT hospital_doctors_pkey PRIMARY KEY (hospital_id, doctor_id);


--
-- Name: hospital_ratings hospital_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_ratings
    ADD CONSTRAINT hospital_ratings_pkey PRIMARY KEY (hospital_id, user_id);


--
-- Name: hospital_speciality hospital_speciality_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_speciality
    ADD CONSTRAINT hospital_speciality_pkey PRIMARY KEY (hospital_id, speciality_id);


--
-- Name: hospital_timings hospital_timings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_timings
    ADD CONSTRAINT hospital_timings_pkey PRIMARY KEY (hospital_id, day);


--
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (id);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (user_id, "time");


--
-- Name: patient_diseases patient_diseases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_diseases
    ADD CONSTRAINT patient_diseases_pkey PRIMARY KEY (user_id, disease_id);


--
-- Name: specialities specialities_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialities
    ADD CONSTRAINT specialities_name_key UNIQUE (name);


--
-- Name: specialities specialities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialities
    ADD CONSTRAINT specialities_pkey PRIMARY KEY (id);


--
-- Name: specializations specializations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specializations
    ADD CONSTRAINT specializations_name_key UNIQUE (name);


--
-- Name: specializations specializations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specializations
    ADD CONSTRAINT specializations_pkey PRIMARY KEY (id);


--
-- Name: user_allergies user_allergies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_allergies
    ADD CONSTRAINT user_allergies_pkey PRIMARY KEY (user_id, medicine_id);


--
-- Name: user_disease_files user_disease_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_files
    ADD CONSTRAINT user_disease_files_pkey PRIMARY KEY (id);


--
-- Name: user_disease_files user_disease_files_user_id_disease_id_file_url_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_files
    ADD CONSTRAINT user_disease_files_user_id_disease_id_file_url_key UNIQUE (user_id, disease_id, file_url);


--
-- Name: user_disease_medicines user_disease_medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_medicines
    ADD CONSTRAINT user_disease_medicines_pkey PRIMARY KEY (user_id, disease_id, medicine_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: disease_records disease_records_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disease_records
    ADD CONSTRAINT disease_records_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id) ON DELETE CASCADE;


--
-- Name: disease_records disease_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disease_records
    ADD CONSTRAINT disease_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: doctor_comments doctor_comments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_comments
    ADD CONSTRAINT doctor_comments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctor_comments doctor_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_comments
    ADD CONSTRAINT doctor_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: doctor_experience doctor_experience_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_experience
    ADD CONSTRAINT doctor_experience_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctor_experience doctor_experience_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_experience
    ADD CONSTRAINT doctor_experience_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: doctor_ratings doctor_ratings_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_ratings
    ADD CONSTRAINT doctor_ratings_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctor_ratings doctor_ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_ratings
    ADD CONSTRAINT doctor_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: doctor_schedule doctor_schedule_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_schedule
    ADD CONSTRAINT doctor_schedule_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctor_specializations doctor_specializations_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_specializations
    ADD CONSTRAINT doctor_specializations_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctor_specializations doctor_specializations_specialization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_specializations
    ADD CONSTRAINT doctor_specializations_specialization_id_fkey FOREIGN KEY (specialization_id) REFERENCES public.specializations(id) ON DELETE CASCADE;


--
-- Name: doctor_videos doctor_videos_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_videos
    ADD CONSTRAINT doctor_videos_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctors doctors_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hospital_comments hospital_comments_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_comments
    ADD CONSTRAINT hospital_comments_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospital_comments hospital_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_comments
    ADD CONSTRAINT hospital_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hospital_doctors hospital_doctors_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_doctors
    ADD CONSTRAINT hospital_doctors_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: hospital_doctors hospital_doctors_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_doctors
    ADD CONSTRAINT hospital_doctors_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospital_ratings hospital_ratings_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_ratings
    ADD CONSTRAINT hospital_ratings_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospital_ratings hospital_ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_ratings
    ADD CONSTRAINT hospital_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hospital_speciality hospital_speciality_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_speciality
    ADD CONSTRAINT hospital_speciality_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospital_speciality hospital_speciality_speciality_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_speciality
    ADD CONSTRAINT hospital_speciality_speciality_id_fkey FOREIGN KEY (speciality_id) REFERENCES public.specialities(id) ON DELETE CASCADE;


--
-- Name: hospital_timings hospital_timings_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_timings
    ADD CONSTRAINT hospital_timings_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospitals hospitals_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: login_logs login_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: patient_diseases patient_diseases_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_diseases
    ADD CONSTRAINT patient_diseases_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id) ON DELETE CASCADE;


--
-- Name: patient_diseases patient_diseases_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_diseases
    ADD CONSTRAINT patient_diseases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_allergies user_allergies_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_allergies
    ADD CONSTRAINT user_allergies_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.medicines(id) ON DELETE CASCADE;


--
-- Name: user_allergies user_allergies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_allergies
    ADD CONSTRAINT user_allergies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_disease_files user_disease_files_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_files
    ADD CONSTRAINT user_disease_files_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id) ON DELETE CASCADE;


--
-- Name: user_disease_files user_disease_files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_files
    ADD CONSTRAINT user_disease_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_disease_medicines user_disease_medicines_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_medicines
    ADD CONSTRAINT user_disease_medicines_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id) ON DELETE CASCADE;


--
-- Name: user_disease_medicines user_disease_medicines_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_medicines
    ADD CONSTRAINT user_disease_medicines_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.medicines(id) ON DELETE CASCADE;


--
-- Name: user_disease_medicines user_disease_medicines_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_disease_medicines
    ADD CONSTRAINT user_disease_medicines_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

