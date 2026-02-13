-- FUD-Archive Storage Setup
-- Run this in your Supabase SQL Editor AFTER schema.sql
--
-- WICHTIG: Erstelle zuerst den Bucket im Dashboard:
--   Storage → New Bucket → Name: "screenshots" → Public: ON → Max size: 5MB
--   Erlaubte MIME-Types: image/jpeg, image/png, image/webp
--
-- Danach dieses SQL ausführen für die Policies:

-- Public read access
CREATE POLICY "Public read screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'screenshots');

-- Anyone can upload to screenshots bucket
CREATE POLICY "Anyone can upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'screenshots');

-- Only authenticated users can delete (admin via service role key)
CREATE POLICY "Authenticated users can delete screenshots"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'screenshots' AND auth.role() = 'authenticated');
