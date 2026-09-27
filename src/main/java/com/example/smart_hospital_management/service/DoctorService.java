package com.example.smart_hospital_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.smart_hospital_management.entity.Doctor;
import com.example.smart_hospital_management.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {

        Doctor existingDoctor = doctorRepository.findById(id).orElse(null);

        if (existingDoctor != null) {

            existingDoctor.setName(doctor.getName());
            existingDoctor.setSpecialization(doctor.getSpecialization());
            existingDoctor.setPhone(doctor.getPhone());
            existingDoctor.setEmail(doctor.getEmail());
            existingDoctor.setAvailableTime(doctor.getAvailableTime());

            return doctorRepository.save(existingDoctor);
        }

        return null;
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}