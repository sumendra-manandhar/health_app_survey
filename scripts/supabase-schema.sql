-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_no VARCHAR(50) UNIQUE NOT NULL,
  
  -- Child Information
  child_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  age VARCHAR(50) NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  
  -- Guardian Information
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  guardian_name VARCHAR(255),
  contact_number VARCHAR(20) NOT NULL,
  
  -- Address Information
  caste VARCHAR(100),
  religion VARCHAR(50),
  ethnicity VARCHAR(100),
  language VARCHAR(50),
  district VARCHAR(100) NOT NULL,
  palika VARCHAR(255) NOT NULL,
  ward VARCHAR(10) NOT NULL,
  tole VARCHAR(255),
  
  -- Health Information
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  muac DECIMAL(5,2),
  head_circumference DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  vaccination_status TEXT,
  health_issues TEXT,
  
  -- Swarnabindu Information
  swarnabindu_date DATE,
  dose_amount VARCHAR(20),
  dose_time VARCHAR(50),
  administered_by VARCHAR(255),
  child_reaction VARCHAR(50) DEFAULT 'normal',
  doses_given INTEGER DEFAULT 1,
  notes TEXT,
  
  -- Metadata
  registration_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE,
  local_id VARCHAR(100)
);

-- Create screenings table for follow-up visits
CREATE TABLE IF NOT EXISTS public.screenings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  
  -- Screening Information
  screening_date DATE NOT NULL,
  screening_type VARCHAR(50) NOT NULL CHECK (screening_type IN ('first-time', 'follow-up', 'emergency')),
  
  -- Health Assessment
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  health_issues TEXT,
  referral_status VARCHAR(50) DEFAULT 'not-required' CHECK (referral_status IN ('not-required', 'referred', 'completed')),
  next_steps TEXT,
  
  -- Swarnabindu Administration
  swarnabindu_date DATE,
  dose_amount VARCHAR(20),
  doses_given INTEGER DEFAULT 1,
  child_reaction VARCHAR(50) DEFAULT 'normal',
  administered_by VARCHAR(255),
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dose_logs table for detailed tracking
CREATE TABLE IF NOT EXISTS public.dose_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  screening_id UUID REFERENCES public.screenings(id) ON DELETE SET NULL,
  
  -- Dose Information
  dose_date DATE NOT NULL,
  dose_amount VARCHAR(20) NOT NULL,
  dose_time VARCHAR(50),
  administered_by VARCHAR(255) NOT NULL,
  child_reaction VARCHAR(50) DEFAULT 'normal',
  reaction_details TEXT,
  
  -- Follow-up Information
  next_dose_date DATE,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_serial_no ON public.registrations(serial_no);
CREATE INDEX IF NOT EXISTS idx_registrations_child_name ON public.registrations(child_name);
CREATE INDEX IF NOT EXISTS idx_registrations_contact ON public.registrations(contact_number);
CREATE INDEX IF NOT EXISTS idx_registrations_district ON public.registrations(district);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at);

CREATE INDEX IF NOT EXISTS idx_screenings_registration_id ON public.screenings(registration_id);
CREATE INDEX IF NOT EXISTS idx_screenings_date ON public.screenings(screening_date);

CREATE INDEX IF NOT EXISTS idx_dose_logs_registration_id ON public.dose_logs(registration_id);
CREATE INDEX IF NOT EXISTS idx_dose_logs_date ON public.dose_logs(dose_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_registrations_updated_at ON public.registrations;
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_screenings_updated_at ON public.screenings;
CREATE TRIGGER update_screenings_updated_at BEFORE UPDATE ON public.screenings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dose_logs_updated_at ON public.dose_logs;
CREATE TRIGGER update_dose_logs_updated_at BEFORE UPDATE ON public.dose_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dose_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - adjust based on your auth requirements)
DROP POLICY IF EXISTS "Allow all operations on registrations" ON public.registrations;
CREATE POLICY "Allow all operations on registrations" ON public.registrations FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on screenings" ON public.screenings;
CREATE POLICY "Allow all operations on screenings" ON public.screenings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on dose_logs" ON public.dose_logs;
CREATE POLICY "Allow all operations on dose_logs" ON public.dose_logs FOR ALL USING (true);

-- Insert some sample data for testing
INSERT INTO public.registrations (
  serial_no, child_name, date_of_birth, age, gender, father_name, mother_name,
  contact_number, caste, religion, ethnicity, language, district, palika, ward, tole,
  swarnabindu_date, dose_amount, administered_by, child_reaction, doses_given
) VALUES 
(
  'SB001', 'राम बहादुर श्रेष्ठ', '2020-05-10', '4 वर्ष', 'male', 'कृष्ण बहादुर श्रेष्ठ', 'सीता श्रेष्ठ',
  '9841234567', 'श्रेष्ठ', 'hindu', 'नेवार', 'nepali', 'काठमाडौं', 'काठमाडौं महानगरपालिका', '5', 'टेकु',
  '2024-01-20', '2 बुँदा', 'स्वास्थ्यकर्मी', 'normal', 1
),
(
  'SB002', 'गीता कुमारी तामाङ', '2021-03-22', '3 वर्ष', 'female', 'लक्ष्मण तामाङ', 'कमला तामाङ',
  '9851234568', 'तामाङ', 'buddhist', 'तामाङ', 'tamang', 'काभ्रेपलाञ्चोक', 'धुलिखेल नगरपालिका', '3', 'धुलिखेल',
  '2024-01-21', '2 बुँदा', 'स्वास्थ्यकर्मी', 'normal', 1
),
(
  'SB003', 'अर्जुन गुरुङ', '2019-12-08', '5 वर्ष', 'male', 'बिर बहादुर गुरुङ', 'माया गुरुङ',
  '9861234569', 'गुरुङ', 'hindu', 'गुरुङ', 'nepali', 'कास्की', 'पोखरा महानगरपालिका', '15', 'लेकसाइड',
  '2024-01-22', '2 बुँदा', 'स्वास्थ्यकर्मी', 'mild_reaction', 1
)
ON CONFLICT (serial_no) DO NOTHING;
