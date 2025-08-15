

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
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
CREATE TABLE IF NOT EXISTS screenings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  
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
CREATE TABLE IF NOT EXISTS dose_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  screening_id UUID REFERENCES screenings(id) ON DELETE SET NULL,
  
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
CREATE INDEX IF NOT EXISTS idx_registrations_serial_no ON registrations(serial_no);
CREATE INDEX IF NOT EXISTS idx_registrations_child_name ON registrations(child_name);
CREATE INDEX IF NOT EXISTS idx_registrations_contact ON registrations(contact_number);
CREATE INDEX IF NOT EXISTS idx_registrations_district ON registrations(district);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

CREATE INDEX IF NOT EXISTS idx_screenings_registration_id ON screenings(registration_id);
CREATE INDEX IF NOT EXISTS idx_screenings_date ON screenings(screening_date);

CREATE INDEX IF NOT EXISTS idx_dose_logs_registration_id ON dose_logs(registration_id);
CREATE INDEX IF NOT EXISTS idx_dose_logs_date ON dose_logs(dose_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_screenings_updated_at BEFORE UPDATE ON screenings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dose_logs_updated_at BEFORE UPDATE ON dose_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dose_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - adjust based on your auth requirements)
CREATE POLICY "Allow all operations on registrations" ON registrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on screenings" ON screenings FOR ALL USING (true);
CREATE POLICY "Allow all operations on dose_logs" ON dose_logs FOR ALL USING (true);
