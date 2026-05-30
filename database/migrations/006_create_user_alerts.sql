-- Table user_alerts
CREATE TABLE user_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    code_commune TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Empêcher les doublons
    UNIQUE(user_id, code_commune)
);

-- Activer RLS
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- Politique : un user ne voit que SES alertes
CREATE POLICY "Lecture ses propres alertes"
ON user_alerts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Politique : un user peut créer SES alertes
CREATE POLICY "Créer ses propres alertes"
ON user_alerts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Politique : un user peut modifier SES alertes (pour désactiver)
CREATE POLICY "Modifier ses propres alertes"
ON user_alerts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);