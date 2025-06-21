create database hashcure_db;

\c hashcure_db

create type roles as enum ('patient', 'doctor', 'hospital-admin', 'admin');

create table users (
    id serial primary key,
    firstname varchar(100) not null,
    lastname varchar(100),
    email varchar(100) not null unique,
    password_hash varchar(100) not null,
    gender char(1),
    address text,
    phone varchar(20),
    dob date,
    image text,
    height integer,
    weight integer,
    blood_group char(4),
    role roles not null default 'patient',
    is_willing_to_donate_blood boolean default true,
    frequency_of_blood_donation integer default 4,
    last_blood_donation_date date,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table medicines (
    id serial primary key,
    name varchar(200)
);

create table user_allergies (
    user_id integer references users(id) on delete cascade,
    medicine_id integer references medicines(id) on delete cascade,
    primary key (user_id, medicine_id)
);

create type ownerships as enum ('Government', 'Private', 'NGO/Trust', 'Public-Private Partnership');

create table hospitals (
    id serial primary key,
    name varchar(100),
    admin_id integer references users(id) on delete set null,
    started_at date,
    image text,
    district varchar(100),
    address text,
    ownership ownerships not null,
    description text,
    phone varchar(20)
);

create table specialities (
    id serial primary key,
    name varchar(100) not null unique
);

create table hospital_speciality (
    hospital_id integer references hospitals(id) on delete cascade,
    speciality_id integer references specialities(id) on delete cascade,
    primary key (hospital_id, speciality_id)
);

create table doctors (
    id integer references users(id) on delete cascade,
    description text,
    fees integer,
    experience integer,
    qualifications text,
    allow_direct_booking boolean default true,
    primary key (id)
);

create table specializations (
    id serial primary key,
    name varchar(100) not null unique
);

create table doctor_specializations (
    doctor_id integer references doctors(id) on delete cascade,
    specialization_id integer references specializations(id) on delete cascade,
    primary key (doctor_id, specialization_id)
);

create table hospital_doctors (
    hospital_id integer references hospitals(id) on delete cascade,
    doctor_id integer references doctors(id) on delete cascade,
    primary key (hospital_id, doctor_id)
);

create table doctor_videos (
    doctor_id integer references doctors(id) on delete cascade,
    video_url text,
    uploaded_at timestamp default now(),
    primary key (doctor_id, video_url)
);

create type appointment_status as enum ('Scheduled', 'Pending', 'Cancelled', 'Past');

create table appointments (
    id serial primary key,
    patient_id integer references users(id) on delete cascade,
    hospital_id integer references hospitals(id) on delete cascade,
    doctor_id integer references doctors(id) on delete cascade,
    time timestamp default now(),
    purpose text not null,
    chief_complaint text,
    diagnosis text,
    treatment_plan text,
    status appointment_status not null
);

create type days as enum ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

create table doctor_schedule (
    doctor_id integer references doctors(id) on delete cascade,
    day days not null,
    start_time time not null,
    end_time time not null,
    check (start_time < end_time),
    primary key (doctor_id, day, start_time, end_time)
);

create table hospital_timings (
    hospital_id integer references hospitals(id) on delete cascade,
    day days not null,
    start_time time not null,
    end_time time not null,
    check (start_time < end_time),
    primary key (hospital_id, day)
);

create table doctor_experience (
    doctor_id integer references doctors(id) on delete cascade,
    hospital_id integer references hospitals(id) on delete cascade,
    years integer not null,
    primary key (doctor_id, hospital_id)
);

create table doctor_comments (
    doctor_id integer references doctors(id) on delete cascade,
    user_id integer references users(id) on delete cascade,
    comment text,
    time timestamp default now(),
    primary key (doctor_id, user_id)
);

create table doctor_ratings (
    doctor_id integer references doctors(id) on delete cascade,
    user_id integer references users(id) on delete cascade,
    rating integer default 0,
    check (rating >=0 and rating <= 5)
);

create table hospital_comments (
    hospital_id integer references hospitals(id) on delete cascade,
    user_id integer references users(id) on delete cascade,
    comment text,
    time timestamp default now(),
    primary key (hospital_id, user_id)
);

create table hospital_ratings (
    hospital_id integer references hospitals(id) on delete cascade,
    user_id integer references users(id) on delete cascade,
    rating integer default 0,
    check (rating >= 0 and rating <= 5),
    primary key (hospital_id, user_id)
);

create table notifications (
    user_id integer references users(id) on delete cascade,
    content text,
    time timestamp default now(),
    primary key (user_id, time)
);

create table diseases (
    id serial primary key,
    name varchar(100) unique not null
);

create table patient_diseases (
    user_id integer references users(id) on delete cascade,
    disease_id integer references diseases(id) on delete cascade,
    min_value integer default 0,
    max_value integer default 0,
    primary key (user_id, disease_id)
);

create table disease_records (
    user_id integer references users(id) on delete cascade,
    disease_id integer references diseases(id) on delete cascade,
    record_date date default now(),
    value float not null,
    primary key (user_id, disease_id, record_date)
);

create table user_disease_medicines (
    user_id integer references users(id) on delete cascade,
    disease_id integer references diseases(id) on delete cascade,
    started_at date not null,
    medicine_id integer references medicines(id) on delete cascade,
    primary key (user_id, disease_id, medicine_id)
);

create table user_disease_files (
    id serial primary key,
    user_id integer not null references users(id) on delete cascade,
    disease_id integer not null references diseases(id) on delete cascade,
    file_url text not null,
    public_id text not null,
    name varchar(120),
    unique (user_id, disease_id, file_url)
);

create type login_status as enum ('Failed', 'Success');

create table login_logs (
    id serial primary key,
    user_id integer references users(id) on delete set null,
    ip_address text,
    time timestamp default now(),
    status login_status not null
);