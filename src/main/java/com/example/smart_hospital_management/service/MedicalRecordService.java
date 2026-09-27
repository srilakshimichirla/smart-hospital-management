package com.example.smart_hospital_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.smart_hospital_management.entity.MedicalRecord;
import com.example.smart_hospital_management.repository.MedicalRecordRepository;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(
            MedicalRecordRepository medicalRecordRepository) {

        this.medicalRecordRepository = medicalRecordRepository;
    }

    // Add Medical Record
    public MedicalRecord addMedicalRecord(MedicalRecord record) {

        return medicalRecordRepository.save(record);
    }

    // Get All Medical Records
    public List<MedicalRecord> getAllMedicalRecords() {

        return medicalRecordRepository.findAll();
    }

    // Get Medical Record By ID
    public MedicalRecord getMedicalRecordById(Long id) {

        return medicalRecordRepository
                .findById(id)
                .orElse(null);
    }

    // Get Records By Patient
    public List<MedicalRecord> getRecordsByPatient(Long patientId) {

        return medicalRecordRepository.findByPatientId(patientId);
    }

    // Get Records By Doctor
    public List<MedicalRecord> getRecordsByDoctor(Long doctorId) {

        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    // Update Medical Record
    public MedicalRecord updateMedicalRecord(
            Long id,
            MedicalRecord record) {

        MedicalRecord existingRecord =
                medicalRecordRepository.findById(id).orElse(null);

        if (existingRecord != null) {

            existingRecord.setPatientId(record.getPatientId());
            existingRecord.setDoctorId(record.getDoctorId());
            existingRecord.setDiagnosis(record.getDiagnosis());
            existingRecord.setPrescription(record.getPrescription());
            existingRecord.setNotes(record.getNotes());
            existingRecord.setRecordDate(record.getRecordDate());

            return medicalRecordRepository.save(existingRecord);
        }

        return null;
    }

    // Delete Medical Record
    public void deleteMedicalRecord(Long id) {

        medicalRecordRepository.deleteById(id);
    }
}