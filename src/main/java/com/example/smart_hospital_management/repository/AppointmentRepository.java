package com.example.smart_hospital_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smart_hospital_management.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTime(
            Long doctorId,
            String appointmentDate,
            String appointmentTime
    );
}