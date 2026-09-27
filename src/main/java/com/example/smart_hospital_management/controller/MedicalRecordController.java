package com.example.smart_hospital_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.smart_hospital_management.entity.MedicalRecord;
import com.example.smart_hospital_management.service.MedicalRecordService;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(
            MedicalRecordService medicalRecordService) {

        this.medicalRecordService = medicalRecordService;
    }

    // Add Medical Record
    @PostMapping
    public MedicalRecord addMedicalRecord(
            @RequestBody MedicalRecord record) {

        return medicalRecordService.addMedicalRecord(record);
    }

    // Get All Medical Records
    @GetMapping
    public List<MedicalRecord> getAllMedicalRecords() {

        return medicalRecordService.getAllMedicalRecords();
    }

    // Get Medical Record By ID
    @GetMapping("/{id}")
    public MedicalRecord getMedicalRecordById(
            @PathVariable Long id) {

        return medicalRecordService.getMedicalRecordById(id);
    }

    // Get Records By Patient
    @GetMapping("/patient/{patientId}")
    public List<MedicalRecord> getRecordsByPatient(
            @PathVariable Long patientId) {

        return medicalRecordService.getRecordsByPatient(patientId);
    }

    // Get Records By Doctor
    @GetMapping("/doctor/{doctorId}")
    public List<MedicalRecord> getRecordsByDoctor(
            @PathVariable Long doctorId) {

        return medicalRecordService.getRecordsByDoctor(doctorId);
    }

    // Update Medical Record
    @PutMapping("/{id}")
    public MedicalRecord updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecord record) {

        return medicalRecordService.updateMedicalRecord(
                id,
                record
        );
    }

    // Delete Medical Record
    @DeleteMapping("/{id}")
    public String deleteMedicalRecord(
            @PathVariable Long id) {

        medicalRecordService.deleteMedicalRecord(id);

        return "Medical record deleted successfully";
    }
}