package com.example.smart_hospital_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.smart_hospital_management.entity.Appointment;
import com.example.smart_hospital_management.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment bookAppointment(Appointment appointment) {

        List<Appointment> existingAppointments =
                appointmentRepository
                .findByDoctorIdAndAppointmentDateAndAppointmentTime(
                        appointment.getDoctorId(),
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                );

        if (!existingAppointments.isEmpty()) {
            throw new RuntimeException(
                    "Doctor is already booked for this date and time"
            );
        }

        appointment.setStatus("BOOKED");

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {

        Appointment existingAppointment =
                appointmentRepository.findById(id).orElse(null);

        if (existingAppointment != null) {

            existingAppointment.setPatientId(appointment.getPatientId());
            existingAppointment.setDoctorId(appointment.getDoctorId());
            existingAppointment.setAppointmentDate(
                    appointment.getAppointmentDate()
            );
            existingAppointment.setAppointmentTime(
                    appointment.getAppointmentTime()
            );
            existingAppointment.setReason(appointment.getReason());
            existingAppointment.setStatus(appointment.getStatus());

            return appointmentRepository.save(existingAppointment);
        }

        return null;
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}