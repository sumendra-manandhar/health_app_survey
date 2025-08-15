-- Sample data for Swarnabindu Prashan system
-- This script inserts sample data for testing and demonstration

-- Insert sample health workers
INSERT INTO health_workers (name, qualification, license_number, contact_number, email, health_center, specialization) VALUES
('डा. राम प्रसाद शर्मा', 'BAMS, MD (Ayurveda)', 'AYU001', '9841234567', 'ram.sharma@health.gov.np', 'स्वर्णबिन्दु प्राशन केन्द्र, काठमाडौं', 'बाल रोग विशेषज्ञ'),
('डा. सीता देवी पौडेल', 'BAMS', 'AYU002', '9851234568', 'sita.paudel@health.gov.np', 'आयुर्वेद अस्पताल, धुलिखेल', 'सामान्य चिकित्सक'),
('डा. माया गुरुङ', 'BAMS, PhD', 'AYU003', '9861234569', 'maya.gurung@health.gov.np', 'आयुर्वेद केन्द्र, पोखरा', 'बाल स्वास्थ्य विशेषज्ञ');

-- Insert sample medicine batches
INSERT INTO medicine_batches (batch_number, manufacture_date, expiry_date, quantity_ml, remaining_ml, manufacturer, quality_check_status, storage_location) VALUES
('SB001-240120', '2024-01-15', '2026-01-15', 1000, 850, 'राष्ट्रिय आयुर्वेद उत्पादन केन्द्र', 'approved', 'मुख्य भण्डार, काठमाडौं'),
('SB002-240220', '2024-02-15', '2026-02-15', 1000, 920, 'राष्ट्रिय आयुर्वेद उत्पादन केन्द्र', 'approved', 'मुख्य भण्डार, काठमाडौं'),
('SB003-240320', '2024-03-15', '2026-03-15', 1000, 1000, 'राष्ट्रिय आयुर्वेद उत्पादन केन्द्र', 'approved', 'मुख्य भण्डार, काठमाडौं');

-- Insert Pushya Nakshatra dates for 2024
INSERT INTO pushya_calendar (pushya_date, nepali_date, lunar_month, is_auspicious, special_notes) VALUES
('2024-01-20', '२०८० पुष ०५', 'पुष', TRUE, 'स्वर्णबिन्दु प्राशनको लागि अत्यन्त शुभ दिन'),
('2024-02-17', '२०८० माघ ०४', 'माघ', TRUE, 'पुष्य नक्षत्र - बाल स्वास्थ्यको लागि उत्तम'),
('2024-03-16', '२०८० फाल्गुन ०२', 'फाल्गुन', TRUE, 'वसन्त ऋतुमा पुष्य नक्षत्र'),
('2024-04-13', '२०८० चैत्र ०१', 'चैत्र', TRUE, 'नयाँ वर्षको पहिलो पुष्य नक्षत्र'),
('2024-05-10', '२०८१ वैशाख २७', 'वैशाख', TRUE, 'ग्रीष्म ऋतुको सुरुवात'),
('2024-06-07', '२०८१ जेठ २४', 'जेठ', TRUE, 'गर्मी मौसममा विशेष सावधानी'),
('2024-07-04', '२०८१ आषाढ २०', 'आषाढ', TRUE, 'वर्षा ऋतुको सुरुवात'),
('2024-08-01', '२०८१ श्रावण १६', 'श्रावण', TRUE, 'श्रावण महिनाको पुष्य नक्षत्र'),
('2024-08-28', '२०८१ भाद्र १२', 'भाद्र', TRUE, 'वर्षा ऋतुको अन्त्य'),
('2024-09-25', '२०८१ आश्विन ०९', 'आश्विन', TRUE, 'शरद ऋतुको सुरुवात'),
('2024-10-22', '२०८१ कार्तिक ०६', 'कार्तिक', TRUE, 'शरद ऋतुमा पुष्य नक्षत्र'),
('2024-11-19', '२०८१ मंसिर ०४', 'मंसिर', TRUE, 'हिउँद ऋतुको सुरुवात'),
('2024-12-16', '२०८१ पुष ०१', 'पुष', TRUE, 'पुष महिनाको पहिलो पुष्य नक्षत्र');

-- Insert sample registrations
INSERT INTO registrations (
    local_id, serial_no, child_name, gender, birth_date, father_name, mother_name, 
    contact_number, district, municipality, ward_no, tole, caste, religion, 
    vaccination_status, allergies, health_history, current_medication, health_conditions
) VALUES
('reg_001', '001', 'राम बहादुर श्रेष्ठ', 'male', '2023-05-10', 'कृष्ण बहादुर श्रेष्ठ', 'गीता श्रेष्ठ', 
 '9841234567', 'काठमाडौं', 'काठमाडौं महानगरपालिका', 5, 'टेकु', 'श्रेष्ठ', 'hindu', 
 'complete', 'छैन', 'सामान्य स्वास्थ्य अवस्था', 'छैन', '["none"]'),

('reg_002', '002', 'गीता कुमारी तामाङ', 'female', '2022-03-22', 'लक्ष्मण तामाङ', 'सुनिता तामाङ', 
 '9851234568', 'काभ्रेपलाञ्चोक', 'धुलिखेल नगरपालिका', 3, 'धुलिखेल', 'तामाङ', 'buddhist', 
 'complete', 'छैन', 'सामान्य', 'छैन', '["none"]'),

('reg_003', '003', 'अर्जुन गुरुङ', 'male', '2021-12-08', 'बिर बहादुर गुरुङ', 'माया गुरुङ', 
 '9861234569', 'कास्की', 'पोखरा महानगरपालिका', 15, 'लेकसाइड', 'गुरुङ', 'hindu', 
 'complete', 'छैन', 'हल्का रुघाखोकी को इतिहास', 'छैन', '["none"]');

-- Insert sample screenings
INSERT INTO screenings (
    local_id, registration_id, child_name, serial_no, screening_date, screening_type, 
    swarnabindu_date, doses_given, dose_amount, health_issues, referral_status, 
    next_steps, batch_number, administered_by
) VALUES
('screen_001', 1, 'राम बहादुर श्रेष्ठ', '001', '2024-01-20', 'first-time', 
 '2024-01-20', 1, '1 थोपा', 'सामान्य स्वास्थ्य अवस्था', 'not-required', 
 'एक महिना पछि फलोअप', 'SB001-240120', 'डा. राम प्रसाद शर्मा'),

('screen_002', 1, 'राम बहादुर श्रेष्ठ', '001', '2024-02-20', 'follow-up', 
 '2024-02-20', 2, '2 थोपा', '', 'not-required', 
 'अर्को महिना तेस्रो खुराक', 'SB002-240220', 'डा. राम प्रसाद शर्मा'),

('screen_003', 2, 'गीता कुमारी तामाङ', '002', '2024-01-21', 'first-time', 
 '2024-01-21', 1, '2 थोपा', '', 'not-required', 
 'नियमित फलोअप', 'SB001-240120', 'डा. सीता देवी पौडेल'),

('screen_004', 3, 'अर्जुन गुरुङ', '003', '2024-01-22', 'first-time', 
 '2024-01-22', 1, '4 थोपा', 'हल्का रुघाखोकी', 'referred', 
 'डाक्टरको सल्लाह लिनुहोस्', 'SB001-240120', 'डा. माया गुरुङ');

-- Insert sample evaluations
INSERT INTO evaluations (
    registration_id, evaluation_date, evaluator_name, physical_development, 
    mental_development, immunity_status, digestive_health, overall_health_score, 
    recommendations, next_evaluation_date
) VALUES
(1, '2024-03-20', 'डा. राम प्रसाद शर्मा', 
 '{"height": "75cm", "weight": "9.5kg", "general_appearance": "स्वस्थ"}',
 '{"cognitive_abilities": "उत्तम", "behavior": "सामान्य", "social_interaction": "राम्रो"}',
 '{"illness_frequency": "कम", "recovery_time": "छिटो", "overall_immunity": "बलियो"}',
 '{"appetite": "राम्रो", "digestion": "सामान्य", "bowel_movement": "नियमित"}',
 8, 'स्वर्णबिन्दु प्राशन जारी राख्नुहोस्। शारीरिक गतिविधि बढाउनुहोस्।', '2024-06-20'),

(2, '2024-03-21', 'डा. सीता देवी पौडेल',
 '{"height": "85cm", "weight": "12kg", "general_appearance": "स्वस्थ"}',
 '{"cognitive_abilities": "उत्कृष्ट", "behavior": "सक्रिय", "social_interaction": "उत्तम"}',
 '{"illness_frequency": "धेरै कम", "recovery_time": "छिटो", "overall_immunity": "धेरै बलियो"}',
 '{"appetite": "उत्तम", "digestion": "राम्रो", "bowel_movement": "नियमित"}',
 9, 'उत्कृष्ट प्रगति। स्वर्णबिन्दु प्राशन जारी राख्नुहोस्।', '2024-06-21');

-- Insert sample certificates
INSERT INTO certificates (
    registration_id, certificate_number, child_name, father_name, mother_name, 
    total_doses, start_date, completion_date, issued_date, issued_by, health_center
) VALUES
(1, 'SP-240001', 'राम बहादुर श्रेष्ठ', 'कृष्ण बहादुर श्रेष्ठ', 'गीता श्रेष्ठ', 
 2, '2024-01-20', '2024-02-20', '2024-02-25', 'डा. राम प्रसाद शर्मा', 'स्वर्णबिन्दु प्राशन केन्द्र, काठमाडौं');

-- Update medicine batch quantities based on usage
UPDATE medicine_batches SET remaining_ml = remaining_ml - 50 WHERE batch_number = 'SB001-240120';
UPDATE medicine_batches SET remaining_ml = remaining_ml - 20 WHERE batch_number = 'SB002-240220';
