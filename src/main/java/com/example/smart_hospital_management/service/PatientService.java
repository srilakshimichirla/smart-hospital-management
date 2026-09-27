package com.example.smart_hospital_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.smart_hospital_management.entity.Patient;
import com.example.smart_hospital_management.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElse(null);
    }

    public Patient updatePatient(Long id, Patient patient) {

        Patient existingPatient = patientRepository.findById(id).orElse(null);

        if (existingPatient != null) {

            existingPatient.setName(patient.getName());
            existingPatient.setAge(patient.getAge());
            existingPatient.setGender(patient.getGender());
            existingPatient.setPhone(patient.getPhone());
            existingPatient.setEmail(patient.getEmail());
            existingPatient.setAddress(patient.getAddress());

            return patientRepository.save(existingPatient);
        }

        return null;
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}