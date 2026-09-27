package com.example.smart_hospital_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smart_hospital_management.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}